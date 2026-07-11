import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Navbar from "../components/Navbar"
import ProjectDashboard from '../components/ProjectDashboard'
import InitWindow from '../components/admin/InitWindow'
import ProjectWizard from '../components/admin/ProjectWizard'
import FinalWizard from '../components/admin/FinalWizard'
import { toast } from 'react-hot-toast'
import { API_URL } from '../config';
import "../App.css"
import Auth from '../components/Auth'


const Admin = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [isInitWindow, setIsInitWindow] = useState(false)
    const [projects, setProjects] = useState([])
    const [wizardProjectName, setWizardProjectName] = useState("");
    const [isProjectWizard, setIsProjectWizard] = useState(false)
    const [isFinalWizard, setIsFinalWizard] = useState(false)
    const [currentProject, setCurrentProject] = useState(null)
    const [activePhase, setActivePhase] = useState(null)
    const [taskInput, setTaskInput] = useState("")
    const [loading, setLoading] = useState(true)
    const [isRegister, setIsRegister] = useState(false);
    const [showWipeConfirm, setShowWipeConfirm] = useState(false);

    const modelPhases = {
        Waterfall: ["Requirements", "Design", "Implementation", "Verification"],
        Agile: ["Backlog", "In Progress", "Done"],
        Scrum: ["Sprint Planning", "Current Sprint", "Retrospective"],
        Kanban: ["To Do", "Doing", "Done"]
    }

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${API_URL}/api/auth/verify`, {
                    credentials: 'include'
                })
                const result = await res.json()
                if (result.success) {
                    setIsAuth(true)
                    setIsInitWindow(true)
                    fetchProjects()
                }
            } catch (err) {
                console.error("Session is not valid:", err)// no valid session, stay logged out
            }
        }
        checkSession()
    }, [])

    const handleAuth = async (data) => {
    const endpoint = isRegister ? 'register' : 'login';
    
    toast.dismiss();
    const loadingToastId = toast.loading(isRegister ? "Creating your account..." : "Logging you in...", {
        style: { background: '#13151a', color: '#f3f4f6', border: '1px solid #2a2d35' }
    });

    try {
        
        const res = await fetch(`${API_URL}/api/auth/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: data.email, password: data.password })
        });

        const result = await res.json();

        if (result.success) {
            
            if (isRegister) {
                
                toast.loading("Account created! Logging you in automatically...", {
                    id: loadingToastId,
                    style: { background: '#13151a', color: '#f3f4f6', border: '1px solid #2a2d35' }
                });

               
                const loginRes = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email: data.email, password: data.password })
                });
                const loginResult = await loginRes.json();

                toast.dismiss(loadingToastId); 

                if (loginResult.success) {
                    toast.success("Welcome to ScopeSync!", {
                        style: { background: '#13151a', color: '#f3f4f6', border: '1px solid #2a2d35' },
                        iconTheme: { primary: '#10b981', secondary: '#13151a' }
                    });
                    setIsRegister(false);
                    setIsAuth(true);
                    setIsInitWindow(true);
                    fetchProjects();
                    if (typeof reset === 'function') reset(); 
                } else {
                    
                    toast.error("Account created, but auto-login failed. Please log in manually.");
                    setIsRegister(false);
                    if (typeof reset === 'function') reset();
                }

            
            } else {
                toast.dismiss(loadingToastId);
                toast.success("Logged in successfully.", {
                    style: { background: '#13151a', color: '#f3f4f6', border: '1px solid #2a2d35' },
                    iconTheme: { primary: '#10b981', secondary: '#13151a' }
                });
                setIsAuth(true);
                setIsInitWindow(true);
                fetchProjects();
                if (typeof reset === 'function') reset();
            }

        } else {
            
            toast.dismiss(loadingToastId);
            toast.error(result.message || "Authentication failed.");
        }
    } catch (error) {
        toast.dismiss(loadingToastId);
        console.error(" Authentication failure:", error);
        toast.error("Server connection lost. Please check your network.");
    }
};
    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            setIsAuth(false);
            setProjects([]);
            setCurrentProject(null);
            setIsInitWindow(false);
            toast.success("Logged out.");
        } catch (err) {
            console.error("Logout failed:", err);
            toast.error("Couldn't log out. Please try again.");
        }
    };

    const handleProjectWizard = (data) => {
        setWizardProjectName(data.projectName);
        setIsFinalWizard(true)
        setIsProjectWizard(false)

    }

    const handleModelsWizard = async (data) => {
        const phases = modelPhases[data.models].map((phase) => ({
            phaseName: phase,
            tasks: []
        }))

        const newProject = {
            projectName: wizardProjectName,
            models: data.models,
            phases
        }



        try {
            const res = await fetch(`${API_URL}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newProject)
            })

            const result = await res.json()

            if (result.success) {
                const savedProject = result.data;
                setProjects(prev => [...prev, savedProject])
                setCurrentProject(savedProject)
                setIsFinalWizard(false)
                setWizardProjectName("");
                reset()

            }
        } catch (error) {
            console.error("fetch error ", error)
            toast.error("Couldn't save the project. Try again.")
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
                    tasks: [...phase.tasks, { tempId: crypto.randomUUID(), name: taskInput.trim(), status: "pending" }]
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
            const res = await fetch(`${API_URL}/api/projects/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const result = await res.json();

            if (result.success) {
                toast.dismiss();
                setProjects(prev => prev.filter(p => p._id !== id));


                if (currentProject?._id === id) {
                    setCurrentProject(null);
                    setIsInitWindow(true);
                }


                toast.success("Project deleted successfully!", {
                    style: {
                        background: '#13151a',
                        color: '#f3f4f6',
                        border: '1px solid #2a2d35',
                        fontSize: '13px',
                        fontWeight: '500'
                    },
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                    }
                });
            } else {

                toast.error(result.message || "Could not delete project");
            }
        } catch (err) {
            console.error("Failed to delete project.:", err);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const deleteProject = (id) => {
        toast.dismiss()
        toast((t) => (
            <div className="flex flex-col gap-2 p-1 text-left">
                <span className="text-sm font-bold text-red-400">Delete Project</span>
                <span className="text-xs text-gray-400 leading-normal">This will permanently delete all project data. This cannot be undone.</span>
                <div className="flex gap-2 justify-end mt-2">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-[#1c1e24] text-gray-300 border border-white/5 text-xs px-3 py-1.5 font-medium rounded-xl hover:bg-white/5 hover:border-white/10 cursor-pointer transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { toast.dismiss(t.id); executeDeleteProject(id); }}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 font-semibold rounded-xl hover:bg-red-500/20 cursor-pointer transition active:scale-95"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        ), {
            id: `confirm-project-${id}`,
            duration: Infinity,
            position: "top-center",
            style: { background: '#13151a', border: '1px solid #2a2d35', padding: '12px' }
        });
    };

    // Clear all tasks in this phase
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
        toast.dismiss()
        toast((t) => (
            <div className="flex flex-col gap-2 p-1">
                <span className="text-xs text-gray-400 leading-normal">Are you sure you want to clear all tasks in this phase?</span>
                <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => toast.dismiss(t.id)} className="bg-[#1c1e24] text-gray-300 border border-white/5 text-xs px-3 py-1.5 font-medium rounded-xl hover:bg-white/5 hover:border-white/10 cursor-pointer transition">Cancel</button>
                    <button onClick={() => { toast.dismiss(t.id); executeClearAllTasks(phaseName); }} className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 font-semibold rounded-xl hover:bg-red-500/20 cursor-pointer transition active:scale-95">Clear All</button>
                </div>
            </div>
        ), { id: `confirm-clear-${phaseName}`, duration: Infinity });
    };

    // Updates project state and syncs with backend
    const updateProjectState = async (updatedPhases) => {
        const updatedProject = { ...currentProject, phases: updatedPhases };

        // UI Update (For fast responses)
        setCurrentProject(updatedProject);
        setProjects(prev => prev.map((p) => p._id === currentProject._id ? updatedProject : p));

        // Database Update
        try {
            const res = await fetch(`${API_URL}/api/projects/${currentProject._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ phases: updatedPhases })
            });
            const result = await res.json()
            if (result.success) {
                setCurrentProject(result.data);
                setProjects(prev => prev.map((p) => p._id === currentProject._id ? result.data : p));
            }

        } catch (err) {
            console.error("Database sync failed:", err);

        }
    };

    const handleStatusChange = (phaseName, newStatus, _id) => {


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
        if (!taskId) return toast.error("Something went wrong. Please refresh the page.");
        toast.dismiss()
        const toastId = toast.loading("Deleting...");

        try {
            const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await res.json();


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
                console.error(result.message)
                toast.error("Something went wrong. Please try again.", { id: toastId });
            }
        } catch (error) {
            toast.error("Network issue!", { id: toastId });
        }
    };

    const handleDeleteTask = (taskId, projectId) => {
        if (!taskId) return toast.error("Unable to delete task. Please refresh the page and try again.");
        toast.dismiss()
        toast((t) => (
            <div className="flex flex-col gap-2 p-1">
                <span className="text-xs text-gray-400 leading-normal">Delete this task? This can't be undone.</span>
                <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => toast.dismiss(t.id)} className="bg-[#1c1e24] text-gray-300 border border-white/5 text-xs px-3 py-1.5 font-medium rounded-xl hover:bg-white/5 hover:border-white/10 cursor-pointer transition">Cancel</button>
                    <button onClick={() => { toast.dismiss(t.id); executeDeleteTask(taskId, projectId); }} className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-3 py-1.5 font-semibold rounded-xl hover:bg-red-500/20 cursor-pointer transition active:scale-95">Delete</button>
                </div>
            </div>
        ), { id: `confirm-task-${taskId}`, duration: Infinity, position: "top-center" });
    };

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/api/projects`, {
                method: 'GET',
                credentials: 'include'
            });
            const result = await res.json();
            if (result.success) {
                setProjects(result.data);
            } else {

                console.warn("Authorization verification failed:", result.message);
                setIsAuth(false);
            }

        } catch (err) {
            console.error("Project repository data extraction routine failure:", err);
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteDatabase = async () => {

        toast.dismiss()
        try {
            const res = await fetch(`${API_URL}/api/projects`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const result = await res.json();

            if (result.success) {
                toast.success("All your projects have been deleted.");
                setProjects([]);
                setShowWipeConfirm(false);
            } else {
                console.error("Records removal routine rejected by server:", result.message);
                toast.error(result.message || "Couldn't delete your data. Please try again.");
            }
        } catch (error) {
            console.error("Network exception detected during bulk delete sequence:", error);
            toast.error("Couldn't connect to the server. Check your internet and try again");
        }
    };




    // If not authenticated, render the authentication shield
    if (!isAuth) {
        return (
            <Auth
                handleAuth={handleAuth}
                isRegister={isRegister}
                setIsRegister={setIsRegister}

            />
        )
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center w-screen h-screen bg-[#090a0f]'>
                <div className='flex flex-col items-center gap-3'>

                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-700'></div>
                    <p className='text-gray-500 font-semibold text-sm animate-pulse'>ScopeSync Data Loading...</p>
                </div>
            </div>
        )
    }




    return (
        <>
         

            {isInitWindow && (
                <InitWindow
                    projects={projects}
                    setIsProjectWizard={setIsProjectWizard}
                    setIsInitWindow={setIsInitWindow}
                    handleProject={handleProject}
                    deleteProject={deleteProject}
                    showWipeConfirm={showWipeConfirm}
                    handleDeleteDatabase={handleDeleteDatabase}
                    setShowWipeConfirm={setShowWipeConfirm}
                    handleLogout={handleLogout}
                />
            )}

            {isProjectWizard && (
                <ProjectWizard
                    handleProjectWizard={handleProjectWizard}
                />
            )}

            {isFinalWizard && (

                <FinalWizard
                    handleModelsWizard={handleModelsWizard}
                />
            )}

            {currentProject && (
                <ProjectDashboard
                    project={currentProject}
                    isAdmin={true}
                    activePhase={activePhase}
                    setActivePhase={setActivePhase}
                    taskInput={taskInput}
                    setTaskInput={setTaskInput}
                    handleTasksSubmit={handleTasksSubmit}
                    handleClearAllTasks={handleClearAllTasks}
                    handleStatusChange={handleStatusChange}
                    handleDeleteTask={handleDeleteTask}
                    setIsInitWindow={setIsInitWindow}
                    setCurrentProject={setCurrentProject}
                    handleLogout={handleLogout}
                />
            )}

        </>
    )
}

export default Admin