import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
const ProjectDashboard = ({
    project,
    isAdmin,
    taskInput,
    setTaskInput,
    handleTasksSubmit,
    handleClearAllTasks,
    handleStatusChange,
    handleDeleteTask,
    setIsInitWindow,
    setCurrentProject
}) => {

    // UI Local States
    const [openPhaseName, setOpenPhaseName] = useState(null);
    const [activeStatusMenu, setActiveStatusMenu] = useState(null);
    const [isDropUp, setIsDropUp] = useState(false);


    const currentOpenPhase = project?.phases?.find(p => p.phaseName === openPhaseName);

    const copyToClipBoard = () => {
        const link = `${window.location.origin}/project/${project._id}`
        navigator.clipboard.writeText(link)
        toast.success("Link copied!", {
            style: { background: '#13151a', color: '#f3f4f6', border: '1px solid #2a2d35' }
        });
    }


    const handleStatusMenuToggle = (e, taskId) => {
        e.stopPropagation();

        if (activeStatusMenu === taskId) {
            setActiveStatusMenu(null);
        } else {
            // Calculate remaining space below the clicked button
            const rect = e.currentTarget.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;


            setIsDropUp(spaceBelow < 150);
            setActiveStatusMenu(taskId);
        }
    };


    const getSystemTime = (dbDate) => {
        if (!dbDate) return "Live Synced";
        try {
            return `Updated ${new Date(dbDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } catch (e) {
            return "Sync Active";
        }
    }

    const getPhaseStatus = (tasks = []) => {
        if (tasks.length === 0) return { label: "Pending", style: "bg-gray-500/10 text-gray-400 border-white/[0.04]" };
        const completedCount = tasks.filter(t => t.status === "completed").length;
        if (completedCount === tasks.length) return { label: "Done", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" };
        const progressCount = tasks.filter(t => t.status === "progress").length;
        if (progressCount > 0 || completedCount > 0) return { label: "In Progress", style: "bg-blue-500/10 text-blue-400 border-blue-500/10 animate-pulse" };
        return { label: "Pending", style: "bg-gray-500/10 text-gray-400 border-white/[0.04]" };
    }

    return (
        <>
            {project && (
                <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex flex-col relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300'>


                    <div className='absolute top-[-10%] right-[-5%] w-125 h-125 bg-emerald-500/2 blur-[140px] rounded-full pointer-events-none'></div>
                    <div className='absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-blue-500/2 blur-[120px] rounded-full pointer-events-none'></div>

                    {/* HEADER PANEL */}
                    <header className='w-full border-b border-white/6 bg-[#0d0e14]/40 backdrop-blur-md px-6 py-4 sticky top-0 z-40'>
                        <div className='max-w-7xl mx-auto flex flex-col gap-4 w-full'>

                            {/* TOP ROW: Contextual Navigation Controls */}
                            <div className='flex items-center justify-between border-b border-white/4 pb-3 w-full'>
                                {/* Dynamic Back Navigation */}
                                {isAdmin &&
                                    (<button
                                        type="button"
                                        onClick={() => {
                                            setIsInitWindow(true);          // Dashboard main window active
                                            setCurrentProject(null);       // Current project view close / false
                                        }}
                                        className='inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-gray-200 transition-colors group cursor-pointer'
                                    >
                                        <svg className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        <span>Back to Dashboard</span>
                                    </button>)}



                                {isAdmin && (
                                    <button
                                        type="button"
                                        onClick={() => {

                                            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                            window.location.href = "/admin";
                                        }}
                                        className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/4 bg-white/1 hover:bg-red-500/4 hover:border-red-500/20 text-[11px] font-sans font-medium text-gray-500 hover:text-red-400 shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all duration-200 cursor-pointer group'
                                    >

                                        <svg
                                            className="w-3.5 h-3.5 opacity-50 group-hover:opacity-90 transition-opacity duration-200"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign Out</span>
                                    </button>
                                )}
                            </div>

                            {/* BOTTOM ROW: Original Project Metadata & Actions */}
                            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full'>
                                <div className='flex items-center gap-4 flex-wrap min-w-0'>
                                    <h1 className='text-xl font-extrabold tracking-tight text-white truncate'>{project.projectName}</h1>
                                    <span className='text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20'>{project.models}</span>
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${isAdmin ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' : 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse'}`}>
                                        <span className={`w-1 h-1 rounded-full ${isAdmin ? 'bg-blue-400' : 'bg-purple-400'}`}></span>
                                        {isAdmin ? 'Admin View' : 'Shared View'}
                                    </span>
                                </div>
                                {isAdmin && (
                                    <button onClick={copyToClipBoard} className='inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/8 bg-white/2 hover:bg-white/6 hover:border-white/15 text-xs font-semibold text-gray-200 transition-all duration-200'>
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                        Share Link
                                    </button>
                                )}
                            </div>

                        </div>
                    </header>

                    {/* UPPER SUMMARY PANEL */}
                    <section className='w-full max-w-7xl mx-auto px-6 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0'>
                        {['Completed', 'In Progress', 'Pending'].map((metric, i) => {
                            const colors = ['text-emerald-400 border-emerald-500/10 bg-emerald-500/[0.02]', 'text-blue-400 border-blue-500/10 bg-blue-500/[0.02]', 'text-gray-400 border-white/[0.06] bg-white/[0.01]'];
                            const count = project.phases.flatMap(p => p.tasks).filter(t =>
                                metric === 'Completed' ? t.status === 'completed' :
                                    metric === 'In Progress' ? t.status === 'progress' : t.status === 'pending'
                            ).length;
                            return (
                                <div key={metric} className={`border p-3 rounded-xl flex items-center justify-between font-mono text-[11px] ${colors[i]}`}>
                                    <span className='font-medium opacity-90'>{metric}</span>
                                    <span className='font-bold text-sm bg-white/2 border border-white/4 px-2 py-0.5 rounded'>{count}</span>
                                </div>
                            );
                        })}
                    </section>

                    {/* 1. MAIN MONITOR BOARD */}
                    <main className='grow max-w-7xl mx-auto w-full px-6 py-8 relative z-10'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start'>
                            {project.phases.map((phase) => {
                                const phaseStatus = getPhaseStatus(phase.tasks);
                                return (
                                    <div
                                        key={phase.phaseName}
                                        onClick={() => setOpenPhaseName(phase.phaseName)}
                                        className='w-full h-90 border border-white/5 bg-[#0d0e14]/50 hover:bg-[#10111a]/70 hover:border-white/12 backdrop-blur-md rounded-2xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-200 cursor-pointer group/column'
                                    >
                                        {/* Column Header */}
                                        <div className='p-4 border-b border-white/4 bg-white/1 flex justify-between items-center shrink-0'>
                                            <h3 className='font-bold text-sm tracking-tight text-gray-200 truncate group-hover/column:text-white transition-colors'>{phase.phaseName}</h3>
                                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${phaseStatus.style}`}>{phaseStatus.label}</span>
                                        </div>

                                        {/* Tasks Queue List Area */}
                                        <div className='grow overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar pointer-events-none'>
                                            {phase.tasks.length === 0 ? (
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
                                                    <p className='text-xs text-gray-400 font-mono'>No tasks yet.</p>
                                                </div>
                                            ) : (
                                                phase.tasks.map((task) => (
                                                    <div key={task._id || task.tempId} className='border border-white/2 bg-white/1 p-3 rounded-xl flex items-center justify-between gap-3 font-sans text-xs'>
                                                        <div className='flex items-center gap-2.5 min-w-0 truncate'>
                                                            <span className={`font-bold shrink-0 ${task.status === 'completed' ? 'text-emerald-500/70' : task.status === 'progress' ? 'text-blue-400' : 'text-gray-600'}`}>
                                                                {task.status === 'completed' ? '✓' : task.status === 'progress' ? '●' : '○'}
                                                            </span>
                                                            <span className={`truncate ${task.status === 'completed' ? 'text-gray-400 opacity-70 font-normal' : 'text-gray-300 font-medium'}`}>
                                                                {task.name}
                                                            </span>
                                                        </div>
                                                        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500/80 border-emerald-500/10' :
                                                            task.status === 'progress' ? 'bg-blue-500/5 text-blue-400 border-blue-500/10' : 'bg-white/2 text-gray-400 border-white/4'
                                                            }`}>{task.status === 'completed' ? 'Done' : task.status === 'progress' ? 'Active' : 'Pending'}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Column Footer */}
                                        <div className='p-3.5 border-t border-white/4 bg-black/10 flex justify-between items-center text-[10px] font-mono text-gray-500 shrink-0 select-none'>
                                            <span className='text-emerald-500/60 group-hover/column:text-emerald-400 transition-colors font-semibold font-sans'>
                                                {isAdmin ? '→ Open' : '→ View'}
                                            </span>
                                            <span className='text-gray-400 group-hover/column:text-gray-400 transition-colors'>
                                                {getSystemTime(project.updatedAt)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </main>


                    {currentOpenPhase && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050608]/80 backdrop-blur-md animate-fade-in' onClick={() => setOpenPhaseName(null)}>
                            <div className='w-full max-w-4xl h-[85vh] border border-white/8 bg-[#0d0e14] rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden relative z-50 animate-scale-up text-left flex flex-col' onClick={(e) => e.stopPropagation()}>

                                {/* Modal Header */}
                                <div className='p-6 border-b border-white/5 bg-white/1 flex flex-col sm:flex-row justify-between sm:items-center gap-3 shrink-0'>
                                    <div className='flex items-center gap-3 min-w-0'>
                                        <div className='w-2.5 h-2.5 rounded-full bg-emerald-500/40 animate-pulse'></div>
                                        <h2 className='text-lg font-extrabold tracking-tight text-white truncate'>
                                            {currentOpenPhase.phaseName}
                                        </h2>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        {isAdmin && currentOpenPhase.tasks?.length > 0 && (
                                            <button
                                                onClick={() => { handleClearAllTasks(currentOpenPhase.phaseName); setOpenPhaseName(null); }}
                                                className='text-xs font-mono font-bold uppercase text-red-400 hover:text-red-300 transition-colors border border-red-500/20 bg-red-500/5 px-3 py-1.5 rounded-xl'
                                            >
                                                Delete All
                                            </button>
                                        )}
                                        <button onClick={() => setOpenPhaseName(null)} className='text-gray-400 hover:text-white font-mono text-sm border border-white/6 bg-white/2 px-2.5 py-1 rounded-lg transition-all'>Close</button>
                                    </div>
                                </div>

                                {/* Modal Internal Body Split Layout */}
                                <div className='grow overflow-hidden flex flex-col md:flex-row'>

                                    {/* Left Panel: Task Submitter */}
                                    {isAdmin && (
                                        <div className='w-full md:w-80 border-b md:border-b-0 md:border-r border-white/4 p-6 bg-black/8 flex flex-col gap-4 shrink-0'>
                                            <div className='space-y-1'>
                                                <h3 className='text-xs font-bold tracking-widest text-gray-400 uppercase font-mono'>Add Task</h3>
                                                <p className='text-[11px] text-gray-500 leading-normal'>Add a new task to this phase.</p>
                                            </div>
                                            <form onSubmit={(e) => handleTasksSubmit(e, currentOpenPhase.phaseName)} className='w-full'>
                                                <input
                                                    type="text"
                                                    value={taskInput}
                                                    onChange={(e) => setTaskInput(e.target.value)}
                                                    placeholder='Type task summary & press Enter...'
                                                    className='w-full bg-[#14161e] text-gray-200 border border-white/8 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/40 placeholder:text-gray-600 transition-all duration-150 shadow-inner'
                                                    autoFocus
                                                />
                                            </form>
                                        </div>
                                    )}

                                    {/* Right Panel: Tasks List Area */}
                                    <div className='grow p-6 flex flex-col overflow-hidden bg-white/0.5'>
                                        <div className='flex justify-between items-center text-[10px] font-mono tracking-widest text-gray-400 uppercase border-b border-white/2 pb-3 mb-4 shrink-0'>
                                            <span>Tasks</span>
                                            <span>{currentOpenPhase.tasks?.length || 0} Tasks</span>
                                        </div>

                                        <div className='grow overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-3'>
                                            {currentOpenPhase.tasks?.length === 0 ? (
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
                                                    <p className='text-xs text-gray-400 font-mono'>No tasks yet.</p>
                                                </div>
                                            ) : (
                                                currentOpenPhase.tasks?.map((task) => (
                                                    <div
                                                        key={task._id || task.tempId}
                                                        className='group border border-white/4 bg-[#111218]/50 p-4 rounded-xl flex items-center justify-between gap-6 hover:border-white/8 hover:bg-[#141620]/60 transition-all duration-150'
                                                    >
                                                        <div className='flex items-center gap-4 min-w-0 grow'>
                                                            <span className={`text-base font-bold shrink-0 select-none ${task.status === 'completed' ? 'text-emerald-600' : task.status === 'progress' ? 'text-blue-400 animate-pulse' : 'text-gray-600'}`}>
                                                                {task.status === 'completed' ? '✓' : task.status === 'progress' ? '●' : '○'}
                                                            </span>
                                                            <div className='flex flex-col min-w-0 gap-0.5'>
                                                                <span className={`text-sm font-semibold wrap-break-word leading-relaxed ${task.status === 'completed' ? 'text-gray-400 opacity-60 font-normal' : 'text-gray-200'}`}>
                                                                    {task.name}
                                                                </span>

                                                            </div>
                                                        </div>

                                                        <div className='flex items-center gap-4 shrink-0'>
                                                            {isAdmin ? (

                                                                <div className="relative">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => handleStatusMenuToggle(e, task._id)} // FIXED WRAPPER TRIGGER
                                                                        className="bg-[#14161e] text-gray-300 border border-white/8 rounded-xl px-3 py-1.5 text-xs font-medium hover:border-white/15 flex items-center gap-2 transition-all min-w-25 justify-between"
                                                                    >
                                                                        <span className={task.status === 'completed' ? 'text-emerald-400' : task.status === 'progress' ? 'text-blue-400' : 'text-gray-400'}>
                                                                            {task.status === 'completed' ? 'Completed' : task.status === 'progress' ? 'In Progress' : 'Pending'}
                                                                        </span>
                                                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                                                    </button>

                                                                    {activeStatusMenu === task._id && (

                                                                        <div className={`absolute right-0 z-50 w-32 rounded-xl border border-white/8 bg-[#14161f] shadow-2xl overflow-hidden font-sans text-xs animate-fade-in ${isDropUp ? 'bottom-full mb-2' : 'top-full mt-2'
                                                                            }`}>
                                                                            {[['pending', 'Pending'], ['progress', 'In Progress'], ['completed', 'Completed']].map(([v, l]) => (
                                                                                <div
                                                                                    key={v}
                                                                                    onClick={() => { handleStatusChange(currentOpenPhase.phaseName, v, task._id); setActiveStatusMenu(null); }}
                                                                                    className={`px-4 py-2.5 cursor-pointer hover:bg-white/3 transition-colors ${task.status === v ? 'text-emerald-400 font-bold bg-emerald-500/5' : 'text-gray-400'}`}
                                                                                >
                                                                                    {l}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded border ${task.status === 'completed' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' : task.status === 'progress' ? 'bg-blue-500/5 text-blue-400 border-blue-500/10' : 'bg-white/2 text-gray-400 border-white/4'}`}>
                                                                    {task.status}
                                                                </span>
                                                            )}

                                                            {isAdmin && (
                                                                <button
                                                                    onClick={() => handleDeleteTask(task._id, project._id)}
                                                                    className='text-gray-500 hover:text-red-400 p-1 rounded-xl hover:bg-red-500/10 transition-all shrink-0'
                                                                    title="Remove Task Target"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </>
    )
}

export default ProjectDashboard