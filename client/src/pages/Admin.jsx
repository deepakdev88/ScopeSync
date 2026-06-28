import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Navbar from "../components/Navbar"
import ProjectDashboard from '../components/ProjectDashboard'
import { toast, Toaster } from 'react-hot-toast'
import "../App.css"


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
    const [selectedModel, setSelectedModel] = useState("Waterfall");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const modelPhases = {
        Waterfall: ["Requirements", "Design", "Implementation", "Verification"],
        Agile: ["Backlog", "In Progress", "Done"],
        Scrum: ["Sprint Planning", "Current Sprint", "Retrospective"],
        Kanban: ["To Do", "Doing", "Done"]
    }

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

    const handleLogin = (data) => {
        setIsAuth(true)
        setIsInitWindow(true)
        fetchProjects();
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
            toast.error('Sorry unable to connect.')
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
                    tasks: [...phase.tasks, { name: taskInput.trim(), status: "pending" }]
                }
            }
            return phase
        })

        updateProjectState(updatedPhases)
        setTaskInput("")
        setActivePhase(null)
    }


    // Handle projects deletion
    const executeDeleteProject = async (id) => {


        try {
            const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();

            if (result.success) {
                // Remove form UI
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

    const deleteProject = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-2 p-1">
                <span className="text-sm font-bold text-red-600">⚠️ DANGER ZONE</span>
                <span className="text-xs text-gray-400">This action is irreversible. All project data will be permanently lost. Proceed??</span>
                <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={() => { toast.dismiss(t.id); executeDeleteProject(id); }} className="bg-red-600 text-white text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-red-700 transition">Confirm Delete</button>
                </div>
            </div>
        ), { id: `confirm-project-${id}`, duration: Infinity, position: "top-center" });
    };

    // All Tasks in a Specific Phase
    const executeClearAllTasks = (phaseName) => {
        const updatedPhases = currentProject.phases.map((phase) => {
            if (phase.phaseName === phaseName) {
                return { ...phase, tasks: [] }
            }
            return phase
        })
        updateProjectState(updatedPhases)
        toast.success("All tasks cleared for this phase.");
    }

    const handleClearAllTasks = (phaseName) => {
        toast((t) => (
            <div className="flex flex-col gap-2 p-1">
                <span className="text-sm font-medium text-gray-400">Are you sure you want to clear all tasks in this phase?</span>
                <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={() => { toast.dismiss(t.id); executeClearAllTasks(phaseName); }} className="bg-red-500 text-white text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-red-600 transition">Clear All</button>
                </div>
            </div>
        ), { id: `confirm-clear-${phaseName}`, duration: Infinity });
    };

    // Helper function for avoiding repetative work
    const updateProjectState = async (updatedPhases) => {
        const updatedProject = { ...currentProject, phases: updatedPhases };

        // UI Update (For fast responses)
        setCurrentProject(updatedProject);
        setProjects(prev => prev.map((p) => p._id === currentProject._id ? updatedProject : p));

        // Database Update (Backend Sync)
        try {
            const res = await fetch(`http://localhost:5000/api/projects/${currentProject._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phases: updatedPhases })
            });
            const result = await res.json()
            if (result.success) {
                setCurrentProject(result.data);
                setProjects(prev => prev.map((p) => p._id === currentProject._id ? result.data : p));
            }
            console.log("DB Updated!");
        } catch (err) {
            console.error("Database sync failed:", err);

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

    // Handle tasks deletion
    const executeDeleteTask = async (taskId, projectId) => {
        if (!taskId) return toast.error("Invalid Task id refresh the page.");

        const toastId = toast.loading("Task Loading...");

        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            const result = await res.json();
            console.log("Backend response:", result);

            if (result.success) {
                // 1. Update projects array 
                setProjects(prevProjects =>
                    prevProjects.map((project) => {
                        if (project._id !== projectId) return project;

                        return {
                            ...project,
                            phases: project.phases.map((phase) => ({
                                ...phase, //  spread 
                                tasks: phase.tasks.filter(task => task._id !== taskId) // Deleted task 
                            }))
                        };
                    })
                );

                // 2. Update active dashboard
                setCurrentProject(prevProject => {
                    if (!prevProject) return null;
                    return {
                        ...prevProject,
                        phases: prevProject.phases.map((phase) => ({
                            ...phase,
                            tasks: phase.tasks.filter(task => task._id !== taskId)
                        }))
                    };
                });

                toast.success("Task deleted successfully", { id: toastId });
            } else {
                toast.error(`Something went wrong: ${result.message}`, { id: toastId });
            }
        } catch (error) {
            toast.error("Network issue!", { id: toastId });
        }
    };

    const handleDeleteTask = (taskId, projectId) => {
        if (!taskId) return toast.error("Bhai, taskId nahi mili!");

        toast((t) => (
            <div className="flex flex-col gap-2 p-1">
                <span className="text-sm font-medium text-gray-400">Do you really want to delete this task? </span>
                <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-gray-200 transition">No</button>
                    <button onClick={() => { toast.dismiss(t.id); executeDeleteTask(taskId, projectId); }} className="bg-red-500 text-white text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-red-600 transition">Yes</button>
                </div>
            </div>
        ), { id: `confirm-task-${taskId}`, duration: Infinity, position: "top-center" });
    };

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const res = await fetch('http://localhost:5000/api/projects');
            const result = await res.json();
            if (result.success) {
                setProjects(result.data);
                setLoading(false)
            }
            console.log("from backend for fornted again,", result)
        } catch (err) {
            console.error("Fetch karne mein error:", err);
            setLoading(false)
        }
    };



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
                            validate: (value) => value === import.meta.env.VITE_ADMIN_PASSWORD || "Invalid Key."
                        })}
                    />
                    {errors.key && <div className='text-red-500 text-sm'>{errors.key.message}</div>}
                    <input className='bg-green-500 text-white font-bold p-2 px-6 rounded-xl cursor-pointer hover:bg-green-600 transition' type="submit" value="Login" />
                </div>
            </form>
        )
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center w-screen h-screen bg-[#090a0f]'>
                <div className='flex flex-col items-center gap-3'>
                    {/* Tailwind Native Spinner */}
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-700'></div>
                    <p className='text-gray-500 font-semibold text-sm animate-pulse'>ScopeSync Data Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#13151a', // Rich dark background
                        color: '#f3f4f6',      // Light gray text
                        border: '1px solid #2a2d35', // Subtle dark border
                        borderRadius: '12px',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981', // Emerald green tick
                            secondary: '#13151a',
                        },
                    },
                }}
            />

            {isInitWindow && (
                <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex flex-col relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300'>
                    {/* Futuristic Subtle Mesh Gradients */}
                    <div className='absolute top-[-20%] left-[50%] -translate-x-1/2 w-150 h-100 bg-emerald-500/[0.07] blur-[140px] rounded-full pointer-events-none'></div>
                    <div className='absolute bottom-[-10%] left-[-10%] w-75 h-75 bg-green-500/2 blur-[100px] rounded-full pointer-events-none'></div>

                    <Navbar />

                    <main className='grow flex flex-col justify-center items-center py-12 px-4 relative z-10 w-full max-w-4xl mx-auto animate-fade-in'>

                        {/* Unified Command Control Center Shell */}
                        <div className='w-full grid grid-cols-1 md:grid-cols-5 border border-white/6 bg-[#0d0e14]/40 backdrop-blur-xl rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden'>

                            {/* Left Panel: Primary Actions (2 Columns) */}
                            <div className='md:col-span-2 p-8 flex flex-col justify-between bg-white/1 border-b md:border-b-0 md:border-r border-white/4'>
                                <div className='space-y-4'>
                                    <div className='w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-mono text-sm font-bold'>
                            //
                                    </div>
                                    <div className='space-y-1.5'>
                                        <h2 className='text-xl font-extrabold tracking-tight text-white'>
                                            Project Engine
                                        </h2>
                                        <p className='text-xs text-gray-500 leading-relaxed'>
                                            Deploy a secure lifecycle container. Initialize environments tailored for structured engineering deliverables.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setisProjectWizard(true); setIsInitWindow(false); }}
                                    className='mt-8 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs bg-linear-to-r from-emerald-500 to-green-600 text-black hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200'
                                >
                                    <span>Initialize New Workspace</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>

                            {/* Right Panel: Workspaces Registry (3 Columns) */}
                            <div className='md:col-span-3 p-8 flex flex-col justify-between bg-black/10'>
                                <div className='w-full flex flex-col h-full'>
                                    <div className='w-full flex justify-between items-center pb-4 border-b border-white/4 mb-4'>
                                        <span className='text-xs font-bold tracking-widest text-gray-500 uppercase font-mono'>
                                            Active Environment Registers
                                        </span>
                                        <span className='text-[10px] font-mono bg-white/4 border border-white/6 text-emerald-400 px-2 py-0.5 rounded-md'>
                                            {projects.length} System Nodes
                                        </span>
                                    </div>

                                    {projects.length === 0 ? (
                                        <div className='grow flex flex-col items-center justify-center py-12 text-center opacity-40'>
                                            <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2m16 0h-2m-3 0H9m-3 0H4" />
                                            </svg>
                                            <p className='text-xs text-gray-500 font-mono'>No active execution stacks deployed.</p>
                                        </div>
                                    ) : (
                                        <ul className='w-full flex flex-col gap-3 max-h-65 overflow-y-auto pr-1 custom-scrollbar'>
                                            {projects.map((value) => (
                                                <li
                                                    key={value._id}
                                                    className='group border border-white/4 bg-[#111218]/30 p-3.5 rounded-xl flex items-center justify-between hover:border-emerald-500/20 hover:bg-[#141620]/50 transition-all duration-200'
                                                >
                                                    {/* Left Side: Clickable Info Segment */}
                                                    <div
                                                        onClick={() => handleProject(value)}
                                                        className="flex items-center gap-4 cursor-pointer grow min-w-0"
                                                    >
                                                        {/* Premium Minimalist Folder Icon */}
                                                        <div className="w-9 h-9 rounded-xl bg-white/2 border border-white/6 flex items-center justify-center text-gray-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300 shrink-0">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                                                            </svg>
                                                        </div>

                                                        {/* Stacked Meta Texts */}
                                                        <div className="flex flex-col min-w-0 gap-1">
                                                            <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                                                                {value.projectName}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                {/* Clear High-Contrast Micro Badge */}
                                                                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                    {value.models || "Standard"}
                                                                </span>
                                                                <span className="text-[10px] text-gray-600 font-mono select-none">
                                                                    node_id: {value._id?.slice(-6)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Side: Purge Interactive Button */}
                                                    <button
                                                        onClick={() => deleteProject(value._id)}
                                                        className='text-xs font-semibold text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-150 shrink-0'
                                                    >
                                                        Purge
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {projects.length > 0 && (
                                    <div className='mt-6 pt-4 border-t border-white/4 flex justify-end w-full'>
                                        <button
                                            className='text-red-500/50 text-[10px] tracking-wide font-mono uppercase hover:text-red-400 transition-colors'
                                            onClick={() => setProjects([])}
                                        >
                                            [ Wipe Database Registers ]
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </main>
                </div>
            )}

            {isProjectWizard && (
                <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex justify-center items-center px-4 relative overflow-hidden'>
                    <div className='absolute top-[-10%] left-[50%] -translate-x-1/2 w-100 h-50 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none'></div>

                    <form
                        onSubmit={handleSubmit(handleProjectWizard)}
                        className='p-6 w-full max-w-md flex flex-col gap-4 border border-white/6 bg-[#0d0e14]/80 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 animate-scale-up'
                    >
                        <div className='space-y-1'>
                            <h2 className='text-lg font-bold tracking-tight text-white'>Project Name</h2>
                            <p className='text-xs text-gray-500'>Define the workspace environment directory tag.</p>
                        </div>

                        <input
                            type="text"
                            placeholder='e.g., CloudScope Platform Engine'
                            className='w-full bg-[#14161e] text-gray-200 border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40 placeholder:text-gray-700 transition-all duration-200'
                            {...register("projectName", { required: "Project identity title is required." })}
                        />
                        {errors.projectName && <div className='text-red-400 font-medium text-xs mt-0.5'>⚠️ {errors.projectName.message}</div>}

                        <div className='flex justify-end w-full mt-2'>
                            <input
                                className='bg-linear-to-r from-emerald-500 to-green-600 text-black font-semibold text-xs px-6 py-2.5 rounded-xl cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
                                type="submit"
                                value="Continue"
                            />
                        </div>
                    </form>
                </div>
            )}

            {isFinalWizard && (
                <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex justify-center items-center px-4 relative overflow-hidden'>
                    <div className='absolute top-[-10%] left-[50%] -translate-x-1/2 w-100 h-50 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none'></div>

                    <form
                        onSubmit={handleSubmit(handleModelsWizard)}
                        className='p-6 w-full max-w-md flex flex-col gap-4 border border-white/6 bg-[#0d0e14]/80 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 animate-scale-up'
                    >
                        <div className='space-y-1'>
                            <h2 className='text-lg font-bold tracking-tight text-white'>Select Model Engine</h2>
                            <p className='text-xs text-gray-500'>Choose an operational framework topology layout.</p>
                        </div>

                        {/* Hidden Input: Taaki React Hook Form ko chupchap data milta rahe */}
                        <input type="hidden" value={selectedModel} {...register("models", { required: "Framework blueprint selection is required." })} />

                        {/* Custom Premium Dropdown Shell */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between bg-[#14161e] text-gray-300 border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/40 shadow-sm transition-all duration-200"
                            >
                                <span className="font-medium text-gray-200">{selectedModel} Framework Mapping</span>
                                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Floating Panel */}
                            {isDropdownOpen && (
                                <div className="absolute z-50 w-full mt-2 rounded-xl border border-white/8 bg-[#111218] shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in">
                                    {["Waterfall", "Agile", "Scrum", "Kanban"].map((model) => (
                                        <div
                                            key={model}
                                            onClick={() => {
                                                setSelectedModel(model);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${selectedModel === model
                                                ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                                                : 'text-gray-400 hover:bg-white/3 hover:text-white'
                                                }`}
                                        >
                                            {model} Topology Map
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {errors.models && <div className='text-red-400 font-medium text-xs mt-0.5'>⚠️ {errors.models.message}</div>}

                        <div className='flex justify-end w-full mt-2'>
                            <input
                                className={`p-2.5 px-6 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 ${isSubmitting
                                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                                    : 'bg-linear-to-r from-emerald-500 to-green-600 text-black cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                type="submit"
                                value={isSubmitting ? "Generating Workspace..." : "Initialize & Build Sync Link"}
                                disabled={isSubmitting}
                            />
                        </div>
                    </form>
                </div>
            )}
            {currentProject && (
                <ProjectDashboard
                    project={currentProject}
                    isAdmin={true} // Because its a admin file
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