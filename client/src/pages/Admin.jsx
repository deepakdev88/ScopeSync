import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Navbar from "../components/Navbar"
import ProjectDashboard from '../components/ProjectDashboard'
import InitWindow from '../components/admin/InitWindow'
import ProjectWizard from '../components/admin/ProjectWizard'
import FinalWizard from '../components/admin/FinalWizard'
import { toast, Toaster } from 'react-hot-toast'
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
                console.error("Session is not valid:",err)// no valid session, stay logged out
            }
        }
        checkSession()
    }, [])

    const handleAuth = async (data) => {


        const endpoint = isRegister ? 'register' : 'login';
        try {
            const res = await fetch(`${API_URL}/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Critically required to transmit secure httpOnly cookies cross-origin
                body: JSON.stringify({ email: data.email, password: data.password })
            });

            const result = await res.json();

            if (result.success) {
                if (isRegister) {
                    // Flow path for successful user registration
                    toast.success("Account successfully created! Please log in.");
                    setIsRegister(false); // Seamlessly flip back to login view context
                    reset();
                } else {
                    // Flow path for successful user login authentication
                    toast.success("Logged in successfully.");
                    setIsAuth(true);
                    setIsInitWindow(true);
                    fetchProjects();
                    reset();
                }
            } else {
                toast.error(result.message || "Incorrect email or password.");
            }
        } catch (error) {
            console.error("Critical authentication interface connection failure:", error);
            toast.error("Couldn't connect to the server. Check your internet and try again");
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
                // Remove form UI
                setProjects(prev => prev.filter(p => p._id !== id));
                // If thr deleted project was the currently open one, close the dashboard
                if (currentProject?._id === id) {
                    setCurrentProject(null);
                    setIsInitWindow(true);
                }
            }
        } catch (err) {
            console.error("Failed to delete project.:", err);
        }
    };

    const deleteProject = (id) => {
        toast((t) => (
            <div className="flex flex-col gap-2 p-1">
                <span className="text-sm font-bold text-red-600"> Delete Project</span>
                <span className="text-xs text-gray-400">This will permanently delete all project data. This cannot be undone</span>
                <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={() => { toast.dismiss(t.id); executeDeleteProject(id); }} className="bg-red-500 text-white text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-red-700 transition">Confirm Delete</button>
                </div>
            </div>
        ), { id: `confirm-project-${id}`, duration: Infinity, position: "top-center" });
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
                <span className="text-sm font-medium text-gray-400">Are you sure you want to clear all tasks in this phase?</span>
                <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={() => { toast.dismiss(t.id); executeClearAllTasks(phaseName); }} className="bg-red-500 text-white text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-red-600 transition">Clear All</button>
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

        // Database Update (Backend Sync)
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
                <span className="text-sm font-medium text-gray-400">Delete this task? This can't be undone.</span>
                <div className="flex gap-2 justify-end mt-1">
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-gray-200 transition">Cancel</button>
                    <button onClick={() => { toast.dismiss(t.id); executeDeleteTask(taskId, projectId); }} className="bg-red-500 text-white text-xs px-3 py-1.5 font-medium rounded-lg hover:bg-red-600 transition">Delete</button>
                </div>
            </div>
        ), { id: `confirm-task-${taskId}`, duration: Infinity, position: "top-center" });
    };

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/api/projects`, {
                method: 'GET',
                credentials: 'include' // Required to transmit the secure httpOnly token cookie to the protected route
            });
            const result = await res.json();
            if (result.success) {
                setProjects(result.data);
            } else {
                // If the token is invalid or expired, gracefully fallback and notify the user
                console.warn("Authorization verification failed:", result.message);
                setIsAuth(false); // Route the user back to the clean login state
            }

        } catch (err) {
            console.error("Project repository data extraction routine failure:", err);
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteDatabase = async () => {


        try {
            const res = await fetch(`${API_URL}/api/projects`, {
                method: 'DELETE',
                credentials: 'include' // Transmits the active token signature securely
            });

            const result = await res.json();

            if (result.success) {
                toast.success("All your projects have been deleted.");
                setProjects([]); // Flush the state context on the UI instantly
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
            />
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
                    maxToasts: 1
                }}
            />

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