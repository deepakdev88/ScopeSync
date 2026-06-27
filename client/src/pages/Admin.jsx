import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Navbar from "../components/Navbar"
import ProjectDashboard from '../components/ProjectDashboard'


const Admin = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [isInitWindow, setIsInitWindow] = useState(false)
    const [projects, setProjects] = useState([])

    const [isProjectWizard, setisProjectWizard] = useState(false)
    const [isFinalWizard, setisFinalWizard] = useState(false)
    const [currentProject, setCurrentProject] = useState(null)
    const [activePhase, setActivePhase] = useState(null)
    const [taskInput, setTaskInput] = useState("")
    const [loading, setLoading] = useState(true)

    const modelPhases = {
        Waterfall: ["Requirements", "Design", "Implementation", "Verification"],
        Agile: ["Backlog", "In Progress", "Done"],
        Scrum: ["Sprint Planning", "Current Sprint", "Retrospective"],
        Kanban: ["To Do", "Doing", "Done"]
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const handleLogin = (data) => {
        setIsAuth(true)
        setIsInitWindow(true)
        reset()
    }

    const handleProjectWizard = (data) => {
        setisFinalWizard(true)
        setisProjectWizard(false)
    }

    const handleModelsWizard = async (data) => {
        const phases = modelPhases[data.models].map((phase) => ({
            phaseName: phase,
            tasks: []
        }))

        const newProject = {
            projectName: data.projectName,
            models: data.models,
            phases
        }



        try {
            const res = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProject)
            })

            const result = await res.json()
            console.log("from backend for fornted,", result)
            if (result.success) {
                const savedProject = result.data;
                setProjects(prev => [...prev, savedProject])
                setCurrentProject(savedProject)
                setisFinalWizard(false)
                reset()
                console.log("saved successfull", savedProject)
            }
        } catch (error) {
            console.error("fetch error ", error)
            alert('soory unable to connect')
        }
    }

    const handleProject = (value) => {
        setCurrentProject(value)
        setIsInitWindow(false)
    }

    const handleTasksSubmit = (e, phaseName) => {
        e.preventDefault()
        if (!taskInput.trim()) return

        const updatedPhases = currentProject.phases.map((phase) => {
            if (phase.phaseName === phaseName) {
                return {
                    ...phase,
                    tasks: [...phase.tasks, { id: crypto.randomUUID(), name: taskInput.trim(), status: "pending" }]
                }
            }
            return phase
        })

        updateProjectState(updatedPhases)
        setTaskInput("")
        setActivePhase(null)
    }

    // 🔥 NEW: Single Task Delete Logic
    const deleteProject = async (id) => {
        if (!window.confirm("Are you sure? Ye project database se ud jayega.")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();

            if (result.success) {
                // UI se remove kar do
                setProjects(prev => prev.filter(p => p._id !== id));
                // Agar delete kiya hua project hi open tha, toh dashboard band kar do
                if (currentProject?._id === id) {
                    setCurrentProject(null);
                    setIsInitWindow(true);
                }
            }
        } catch (err) {
            console.error("Delete karne mein error:", err);
        }
    };

    // 🔥 NEW: Clear All Tasks in a Specific Phase
    const handleClearAllTasks = (phaseName) => {
        const updatedPhases = currentProject.phases.map((phase) => {
            if (phase.phaseName === phaseName) {
                return { ...phase, tasks: [] }
            }
            return phase
        })
        updateProjectState(updatedPhases)
    }

    // Helper function taaki baar-baar duplicate code na likhna pade state update ke liye
    const updateProjectState = async (updatedPhases) => {
        const updatedProject = { ...currentProject, phases: updatedPhases };

        // UI Update (Fast response ke liye)
        setCurrentProject(updatedProject);
        setProjects(prev => prev.map((p) => p._id === currentProject._id ? updatedProject : p));

        // Database Update (Backend Sync)
        try {
            await fetch(`http://localhost:5000/api/projects/${currentProject._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phases: updatedPhases })
            });
            console.log("DB Updated!");
        } catch (err) {
            console.error("Database sync failed:", err);
            // Agar error aaye toh user ko alert do ya retry ka option dikhao
        }
    };

    const handleStatusChange = (phaseName, newStatus, _id) => {
        console.log(phaseName, newStatus, _id)
        const updatedPhases = currentProject.phases.map((phase) => {
            if (phase.phaseName === phaseName) {
                return {
                    ...phase,
                    tasks: phase.tasks.map((task) => {
                        if (task._id === _id) {
                            return {
                                ...task,
                                status: newStatus
                            }
                        }
                        return task
                    })
                }

            }
            return phase
        })

        updateProjectState(updatedPhases)
    }

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const res = await fetch('http://localhost:5000/api/projects');
            const result = await res.json();
            if (result.success) {
                setProjects(result.data);// Database ka data state mein set karo
                setLoading(true)
            }
        } catch (err) {
            console.error("Fetch karne mein error:", err);
        }
    };

    useEffect(() => {
        fetchProjects(); // Initial load
    }, []); // Empty dependency array

    if (!isAuth) {
        return (
            <form onSubmit={handleSubmit(handleLogin)} className='flex justify-center items-center w-screen h-screen bg-gray-50'>
                <div className='p-6 border-2 border-green-700 w-[90%] max-w-md flex flex-col gap-4 justify-center items-center bg-white rounded-xl shadow-md'>
                    <h1 className='text-xl font-bold text-gray-800'>Enter Developer Secret Key</h1>
                    <input
                        type="password"
                        placeholder='Enter key..'
                        className='border p-2 rounded w-full'
                        {...register("key", {
                            required: "This field is required.",
                            val_idate: (value) => value === import.meta.env.VITE_ADMIN_PASSWORD || "Inval_id Key."
                        })}
                    />
                    {errors.key && <div className='text-red-500 text-sm'>{errors.key.message}</div>}
                    <input className='bg-green-500 text-white font-bold p-2 px-6 rounded-xl cursor-pointer hover:bg-green-600 transition' type="submit" value="Login" />
                </div>
            </form>
        )
    }

    return (
        <>
            {isInitWindow && (
                <div className='flex flex-col gap-6 w-screen h-screen bg-gray-50'>
                    <Navbar />
                    <div className='flex flex-col justify-center items-center gap-3 p-6 border mx-auto w-[90%] max-w-xl bg-white rounded-xl shadow-sm'>
                        <h2 className='text-xl font-bold text-gray-700'>Initialize Your Project</h2>
                        <button onClick={() => { setisProjectWizard(true); setIsInitWindow(false); }} className='bg-green-500 text-white font-bold p-3 px-8 rounded-xl hover:bg-green-600 transition'>
                            Initialize New Project
                        </button>
                    </div>

                    <div className='flex flex-col justify-center items-center gap-3 p-6 border mx-auto w-[90%] max-w-xl bg-white rounded-xl shadow-sm'>
                        <h2 className='text-xl font-bold text-gray-700'>Recent Projects</h2>
                        {projects.length === 0 ? (
                            <p className='text-gray-400 text-sm'>No recent projects found.</p>
                        ) : (
                            // Admin.jsx ke return mein jahan mapping ho rahi hai:
                            <ul className='w-full flex flex-col gap-2'>
                                {projects.map((value) => (
                                    <li
                                        key={value._id}
                                        className='border p-3 rounded-lg bg-gray-100 flex justify-between items-center'
                                    >
                                        <span onClick={() => handleProject(value)} className="cursor-pointer font-medium text-gray-700 grow">
                                            {value.projectName} ({value.models})
                                        </span>
                                        <button
                                            onClick={() => deleteProject(value._id)}
                                            className='text-red-500 font-bold hover:bg-red-100 p-1 rounded'
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {projects.length > 0 && (
                            <button className='text-red-500 text-sm font-semibold hover:underline mt-2' onClick={() => setProjects([])}>Clear All Projects</button>
                        )}
                    </div>
                </div>
            )}

            {isProjectWizard && (
                <div className='flex justify-center items-center w-screen h-screen bg-gray-50'>
                    <form onSubmit={handleSubmit(handleProjectWizard)} className='p-6 w-[90%] max-w-md flex flex-col gap-4 bg-white border rounded-xl shadow-md'>
                        <h2 className='text-xl font-bold text-gray-800'>Project Name</h2>
                        <input type="text" placeholder='Enter your project name...' className='border p-2 rounded' {...register("projectName", { required: "This field is required." })} />
                        {errors.projectName && <div className='text-red-500 text-sm'>{errors.projectName.message}</div>}
                        <div className='flex justify-end w-full'>
                            <input className='bg-green-500 text-white p-2 px-6 rounded-xl cursor-pointer hover:bg-green-600' type="submit" value="Next" />
                        </div>
                    </form>
                </div>
            )}

            {isFinalWizard && (
                <div className='flex justify-center items-center w-screen h-screen bg-gray-50'>
                    <form onSubmit={handleSubmit(handleModelsWizard)} className='p-6 w-[90%] max-w-md flex flex-col gap-4 bg-white border rounded-xl shadow-md'>
                        <h2 className='text-xl font-bold text-gray-800'>Select Model Name</h2>
                        <select className='border p-2 rounded bg-white' {...register("models", { required: "Select val_id model." })}>
                            <option value="Waterfall">Waterfall</option>
                            <option value="Agile">Agile</option>
                            <option value="Scrum">Scrum</option>
                            <option value="Kanban">Kanban</option>
                        </select>
                        {errors.models && <div className='text-red-500 text-sm'>{errors.models.message}</div>}
                        <div className='flex justify-end w-full'>
                            <input className='bg-green-500 text-white p-2 px-6 rounded-xl cursor-pointer hover:bg-green-600' type="submit" value="Initialize & Generate Client Link" />
                        </div>
                    </form>
                </div>
            )}

            {currentProject && (
                <ProjectDashboard
                    project={currentProject}
                    isAdmin={true} // Kyunki yeh admin file hai
                    activePhase={activePhase}
                    setActivePhase={setActivePhase}
                    taskInput={taskInput}
                    setTaskInput={setTaskInput}
                    handleTasksSubmit={handleTasksSubmit}
                    handleClearAllTasks={handleClearAllTasks}
                    handleStatusChange={handleStatusChange}
                    handleDeleteTask={handleDeleteTask}
                />
            )}

        </>
    )
}

export default Admin