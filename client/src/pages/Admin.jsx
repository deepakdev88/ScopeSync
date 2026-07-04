import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Navbar from "../components/Navbar"
import ProjectDashboard from '../components/ProjectDashboard'
import { toast, Toaster } from 'react-hot-toast'
import { API_URL } from '../config';
import "../App.css"


const Admin = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [isInitWindow, setIsInitWindow] = useState(false)
    const [projects, setProjects] = useState([])

    const [isProjectWizard, setIsProjectWizard] = useState(false)
    const [isFinalWizard, setIsFinalWizard] = useState(false)
    const [currentProject, setCurrentProject] = useState(null)
    const [activePhase, setActivePhase] = useState(null)
    const [taskInput, setTaskInput] = useState("")
    const [loading, setLoading] = useState(true)
    const [selectedModel, setSelectedModel] = useState("Waterfall");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [showWipeConfirm, setShowWipeConfirm] = useState(false);

    const modelPhases = {
        Waterfall: ["Requirements", "Design", "Implementation", "Verification"],
        Agile: ["Backlog", "In Progress", "Done"],
        Scrum: ["Sprint Planning", "Current Sprint", "Retrospective"],
        Kanban: ["To Do", "Doing", "Done"]
    }

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()




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

    const handleProjectWizard = (data) => {
        setIsFinalWizard(true)
        setIsProjectWizard(false)
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
            console.error("Delete karne mein error:", err);
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
            <>

                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: '#0d0e14',
                            color: '#d1d5db',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '12px',
                            fontSize: '13px',
                            backdropFilter: 'blur(12px)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#0d0e14',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#0d0e14',
                            },
                        },
                    }}
                />

                <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex flex-col items-center justify-center relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300 font-sans antialiased'>


                    <div className='absolute top-[-10%] left-[50%] -translate-x-1/2 w-150 h-75 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none'></div>
                    <div className='absolute bottom-[10%] right-[-10%] w-100 h-100 bg-green-500/3 blur-[150px] rounded-full pointer-events-none'></div>


                    <div className='w-[90%] max-w-100 rounded-2xl border border-white/6 bg-[#0d0e14]/60 backdrop-blur-md p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 space-y-6'>


                        <div className='text-center'>
                            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-medium mb-4 select-none'>
                                <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse'></span>
                                {isRegister ? "Registration Mode" : "Console Gateway"}
                            </div>

                            <h1 className='text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400 leading-tight mb-2'>
                                {isRegister ? "Create Account" : "Access Console"}
                            </h1>
                            <p className='text-xs text-gray-500 leading-relaxed max-w-xs mx-auto'>
                                {isRegister
                                    ? "Create an account to start tracking your projects."
                                    : "Log in to access your dashboard."
                                }
                            </p>
                        </div>


                        <form onSubmit={handleSubmit(handleAuth)} className='space-y-4'>


                            <div className='space-y-2'>
                                <label className='text-xs font-semibold text-gray-400 block tracking-wide'>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder='developer@scopesync.dev'
                                    autoFocus
                                    className='w-full rounded-xl border border-white/6 bg-[#090a0f] p-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/40 transition-colors duration-200'
                                    {...register("email", {
                                        required: "Email is required.",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter a valid email address."
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className='text-red-400/90 text-xs mt-1 font-medium flex items-center gap-1'>
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>


                            <div className='space-y-2'>
                                <label className='text-xs font-semibold text-gray-400 block tracking-wide'>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder='••••••••'
                                    className='w-full rounded-xl border border-white/6 bg-[#090a0f] p-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/40 transition-colors duration-200'
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters long."
                                        }
                                    })}
                                />
                                {errors.password && (
                                    <p className='text-red-400/90 text-xs mt-1 font-medium flex items-center gap-1'>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>


                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className='mt-2 w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm bg-linear-to-r from-emerald-500 to-green-600 text-black hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:scale-100 transition-all duration-200 cursor-pointer'
                            >
                                {isSubmitting ? (
                                    <span className='flex items-center gap-2'>
                                        <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : (
                                    <span>{isRegister ? "Create Account" : "Log In"}</span>
                                )}
                            </button>
                        </form>


                        <div className='pt-4 border-t border-white/4 text-center'>
                            <span
                                onClick={() => { setIsRegister(!isRegister); reset(); }}
                                className='text-xs text-gray-500 hover:text-emerald-400 font-medium cursor-pointer transition-colors duration-200 select-none'
                            >
                                {isRegister
                                    ? "Already have an account? Log in"
                                    : "Don't have an account? Sign up"
                                }
                            </span>
                        </div>

                    </div>
                </div>
            </>
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
                <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex flex-col relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300'>

                    <div className='absolute top-[-20%] left-[50%] -translate-x-1/2 w-150 h-100 bg-emerald-500/[0.07] blur-[140px] rounded-full pointer-events-none'></div>
                    <div className='absolute bottom-[-10%] left-[-10%] w-75 h-75 bg-green-500/2 blur-[100px] rounded-full pointer-events-none'></div>

                    <Navbar />

                    <main className='grow flex flex-col justify-center items-center py-12 px-4 relative z-10 w-full max-w-4xl mx-auto animate-fade-in'>


                        <div className='w-full grid grid-cols-1 md:grid-cols-5 border border-white/6 bg-[#0d0e14]/40 backdrop-blur-xl rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden'>

                            {/* Left Panel: Primary Actions (2 Columns) */}
                            <div className='md:col-span-2 p-8 flex flex-col justify-between bg-white/1 border-b md:border-b-0 md:border-r border-white/4'>
                                <div className='space-y-4'>
                                    <div className='w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0'>
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <circle cx="12" cy="12" r="2.5" />
                                        </svg>
                                    </div>
                                    <div className='space-y-1.5'>
                                        <h2 className='text-xl font-extrabold tracking-tight text-white'>
                                            Project Engine
                                        </h2>
                                        <p className='text-xs text-gray-500 leading-relaxed'>
                                            Create and manage your development projects in one place.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setIsProjectWizard(true); setIsInitWindow(false); }}
                                    className='mt-8 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs bg-linear-to-r from-emerald-500 to-green-600 text-black hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200'
                                >
                                    <span>New Project</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>

                            {/* Right Panel: Workspaces  (3 Columns) */}
                            <div className='md:col-span-3 p-8 flex flex-col justify-between bg-black/10'>
                                <div className='w-full flex flex-col h-full'>
                                    <div className='w-full flex justify-between items-center pb-4 border-b border-white/4 mb-4'>
                                        <span className='text-xs font-bold tracking-widest text-gray-500 uppercase font-mono'>
                                            Your Projects
                                        </span>
                                        <span className='text-[10px] font-mono bg-white/4 border border-white/6 text-emerald-400 px-2 py-0.5 rounded-md'>
                                            {projects.length} Projects
                                        </span>
                                    </div>

                                    {projects.length === 0 ? (
                                        <div className='grow flex flex-col items-center justify-center py-12 text-center opacity-40'>
                                            <svg
                                                fill="#9ca3af"
                                                className="w-8 h-8 shrink-0"
                                                viewBox="0 0 26.901 26.901"
                                                version="1.1"
                                                id="Capa_1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                xmlSpace="preserve"
                                            >
                                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                                <g id="SVGRepo_iconCarrier">
                                                    <g>
                                                        <path d="M24.514,6.516H21.47v2.07h1.399c0.713,0,1.292,0.578,1.292,1.291v13.66c0,0.715-0.579,1.295-1.292,1.295H9.948 c-0.713,0-1.29-0.58-1.29-1.295v-1.398H6.683v3.139c0,0.896,0.725,1.623,1.62,1.623h16.211c0.894,0,1.619-0.727,1.619-1.623V8.137 C26.133,7.244,25.409,6.516,24.514,6.516z" />
                                                        <path d="M20.218,18.76V1.621C20.218,0.728,19.49,0,18.598,0H2.386C1.491,0,0.767,0.729,0.767,1.621V18.76 c0,0.898,0.724,1.623,1.619,1.623h16.212C19.492,20.383,20.218,19.658,20.218,18.76z" />
                                                    </g>
                                                </g>
                                            </svg>
                                            <p className='text-xs text-gray-400 font-mono'>No projects yet.</p>
                                        </div>
                                    ) : (
                                        <ul className='w-full flex flex-col gap-3 max-h-65 overflow-y-auto pr-1 custom-scrollbar'>
                                            {projects.map((value) => (
                                                <li
                                                    key={value._id}
                                                    className='group border border-white/4 bg-[#111218]/30 p-3.5 rounded-xl flex items-center justify-between hover:border-emerald-500/20 hover:bg-[#141620]/50 transition-all duration-200'
                                                >

                                                    <div
                                                        onClick={() => handleProject(value)}
                                                        className="flex items-center gap-4 cursor-pointer grow min-w-0"
                                                    >

                                                        <div className="w-9 h-9 rounded-xl bg-white/2 border border-white/6 flex items-center justify-center text-gray-500 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all duration-300 shrink-0">
                                                            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>


                                                        <div className="flex flex-col min-w-0 gap-1">
                                                            <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                                                                {value.projectName}
                                                            </span>
                                                            <div className="flex items-center gap-2">

                                                                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                                                    {value.models || "Standard"}
                                                                </span>

                                                            </div>
                                                        </div>
                                                    </div>


                                                    <button
                                                        onClick={() => deleteProject(value._id)}
                                                        className='text-xs font-semibold text-gray-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10  group-hover:opacity-100 transition-all duration-150 shrink-0'
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {projects.length > 0 && (
                                    <div className='mt-8 pt-6 border-t border-white/5 w-full flex flex-col items-end gap-3 transition-all duration-300'>
                                        {!showWipeConfirm ? (

                                            <button
                                                type="button"
                                                onClick={() => setShowWipeConfirm(true)}
                                                className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/1 hover:bg-red-500/3 hover:border-red-500/10 text-[11px] font-mono text-zinc-500 hover:text-red-400 border-dashed hover:border-solid transition-all duration-200 cursor-pointer group select-none'
                                            >

                                                <svg
                                                    className="w-3.5 h-3.5 opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-150"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span>Delete All Projects</span>
                                            </button>
                                        ) : (

                                            <div className='w-full sm:w-auto flex flex-col sm:flex-row items-center gap-5 bg-[#110c0e] border border-red-950/60 backdrop-blur-md px-4 py-3 rounded-xl animate-fade-in justify-between shadow-[0_12px_40px_rgba(0,0,0,0.7)] z-10 animate-scale-up'>
                                                <div className='flex items-center gap-2.5 select-none'>

                                                    <span className='w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse shrink-0'></span>
                                                    <p className='text-[11px] font-sans font-medium text-zinc-400 tracking-wide leading-none'>
                                                        This will permanently delete all your projects. This cannot be undone.
                                                    </p>
                                                </div>

                                                <div className='flex items-center gap-4 w-full sm:w-auto justify-end font-sans'>
                                                    <button
                                                        type="button"
                                                        className='text-zinc-500 hover:text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer select-none'
                                                        onClick={() => setShowWipeConfirm(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className='bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-black px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide transition-all duration-200 shadow-inner cursor-pointer'
                                                        onClick={handleDeleteDatabase}
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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
                            <p className='text-xs text-gray-500'>Give your project a name.</p>
                        </div>

                        <input
                            type="text"
                            placeholder='e.g., CloudScope Platform Engine'
                            className='w-full bg-[#14161e] text-gray-200 border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40 placeholder:text-gray-700 transition-all duration-200'
                            {...register("projectName", { required: "Project name is required." })}
                        />
                        {errors.projectName && <div className='text-red-400 font-medium text-xs mt-0.5'> {errors.projectName.message}</div>}

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
                            <h2 className='text-lg font-bold tracking-tight text-white'>Select Methodology</h2>
                            <p className='text-xs text-gray-500'>Choose a project management methodology.</p>
                        </div>


                        <input type="hidden" value={selectedModel} {...register("models", { required: "Please select a methodology." })} />


                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between bg-[#14161e] text-gray-300 border border-white/8 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/40 shadow-sm transition-all duration-200"
                            >
                                <span className="font-medium text-gray-200">{selectedModel} </span>
                                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>


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
                                            {model}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {errors.models && <div className='text-red-400 font-medium text-xs mt-0.5'> {errors.models.message}</div>}

                        <div className='flex justify-end w-full mt-2'>
                            <input
                                className={`p-2.5 px-6 rounded-xl font-bold text-xs tracking-wide transition-all duration-200 ${isSubmitting
                                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                                    : 'bg-linear-to-r from-emerald-500 to-green-600 text-black cursor-pointer hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                type="submit"
                                value={isSubmitting ? "Creating Project..." : "Create Project"}
                                disabled={isSubmitting}
                            />
                        </div>
                    </form>
                </div>
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
                />
            )}

        </>
    )
}

export default Admin