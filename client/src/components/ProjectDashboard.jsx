import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ProjectDashboard = ({
    project,
    isAdmin,
    taskInput,
    setTaskInput,
    handleTasksSubmit,
    handleClearAllTasks,
    handleStatusChange,
    handleDeleteTask
}) => {
    
    // UI Local States
    const [openPhaseName, setOpenPhaseName] = useState(null);
    const [activeStatusMenu, setActiveStatusMenu] = useState(null);
    const [isDropUp, setIsDropUp] = useState(false); // SMART PLACEMENT BUG FIX

    // Dynamic reactive mapping for the expanded modal workspace
    const currentOpenPhase = project?.phases?.find(p => p.phaseName === openPhaseName);

    const copyToClipBoard = () => {
        const link = `${window.location.origin}/project/${project._id}`
        navigator.clipboard.writeText(link)
        toast.success("Secure tracking link synced! 🔗", {
            style: { background: '#13151a', color: '#f3f4f6', border: '1px solid #2a2d35' }
        });
    }

    // Smart Dropdown Position Calculator
    const handleStatusMenuToggle = (e, taskId) => {
        e.stopPropagation(); // Prevents modal from closing or doing weird bubbling
        
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

    // Helper to extract clean time from DB timestamps dynamically
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
                    
                    {/* Background Soft Ambient Lights */}
                    <div className='absolute top-[-10%] right-[-5%] w-125 h-125 bg-emerald-500/2 blur-[140px] rounded-full pointer-events-none'></div>
                    <div className='absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-blue-500/2 blur-[120px] rounded-full pointer-events-none'></div>

                    {/* HEADER PANEL */}
                    <header className='w-full border-b border-white/6 bg-[#0d0e14]/40 backdrop-blur-md px-6 py-5 sticky top-0 z-40'>
                        <div className='max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                            <div className='flex items-center gap-4 flex-wrap min-w-0'>
                                <h1 className='text-xl font-extrabold tracking-tight text-white truncate'>{project.projectName}</h1>
                                <span className='text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20'>{project.models} Core</span>
                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${isAdmin ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' : 'bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse'}`}>
                                    <span className={`w-1 h-1 rounded-full ${isAdmin ? 'bg-blue-400' : 'bg-purple-400'}`}></span>
                                    {isAdmin ? 'Developer Management Console' : 'Client Live Gateway'}
                                </span>
                            </div>
                            {isAdmin && (
                                <button onClick={copyToClipBoard} className='inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/8 bg-white/2 hover:bg-white/6 hover:border-white/15 text-xs font-semibold text-gray-200 transition-all duration-200'>
                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                    Share Stream Link
                                </button>
                            )}
                        </div>
                    </header>

                    {/* UPPER SUMMARY PANEL */}
                    <section className='w-full max-w-7xl mx-auto px-6 pt-6 grid grid-cols-3 gap-4 shrink-0'>
                        {['Completed', 'In Progress', 'Pending'].map((metric, i) => {
                            const colors = ['text-emerald-400 border-emerald-500/10 bg-emerald-500/[0.02]', 'text-blue-400 border-blue-500/10 bg-blue-500/[0.02]', 'text-gray-400 border-white/[0.06] bg-white/[0.01]'];
                            const count = project.phases.flatMap(p => p.tasks).filter(t => 
                                metric === 'Completed' ? t.status === 'completed' :
                                metric === 'In Progress' ? t.status === 'progress' : t.status === 'pending'
                            ).length;
                            return (
                                <div key={metric} className={`border p-3 rounded-xl flex items-center justify-between font-mono text-[11px] ${colors[i]}`}>
                                    <span className='font-medium opacity-90'>{metric} Deliverables</span>
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
                                                <div className='grow flex flex-col items-center justify-center text-center p-6 opacity-40 border border-dashed border-white/5 rounded-xl my-auto font-mono text-[10px] text-gray-500'>Empty Scope Registry</div>
                                            ) : (
                                                phase.tasks.map((task) => (
                                                    <div key={task._id} className='border border-white/2 bg-white/1 p-3 rounded-xl flex items-center justify-between gap-3 font-sans text-xs'>
                                                        <div className='flex items-center gap-2.5 min-w-0 truncate'>
                                                            <span className={`font-bold shrink-0 ${task.status === 'completed' ? 'text-emerald-500/70' : task.status === 'progress' ? 'text-blue-400' : 'text-gray-600'}`}>
                                                                {task.status === 'completed' ? '✓' : task.status === 'progress' ? '●' : '○'}
                                                            </span>
                                                            <span className={`truncate ${task.status === 'completed' ? 'text-gray-400 opacity-70 font-normal' : 'text-gray-300 font-medium'}`}>
                                                                {task.name}
                                                            </span>
                                                        </div>
                                                        <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${
                                                            task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500/80 border-emerald-500/10' : 
                                                            task.status === 'progress' ? 'bg-blue-500/5 text-blue-400 border-blue-500/10' : 'bg-white/2 text-gray-400 border-white/4'
                                                        }`}>{task.status === 'completed' ? 'Done' : task.status === 'progress' ? 'Active' : 'Pending'}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Column Footer */}
                                        <div className='p-3.5 border-t border-white/4 bg-black/10 flex justify-between items-center text-[10px] font-mono text-gray-500 shrink-0 select-none'>
                                            <span className='text-emerald-500/60 group-hover/column:text-emerald-400 transition-colors font-semibold font-sans'>
                                                {isAdmin ? '→ Open Workspace' : '→ View Metrics'}
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

                    {/* 2. THE FLOATING WORKSPACE OVERLAY  */}
                    {currentOpenPhase && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050608]/80 backdrop-blur-md animate-fade-in' onClick={() => setOpenPhaseName(null)}>
                            <div className='w-full max-w-4xl h-[85vh] border border-white/8 bg-[#0d0e14] rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] overflow-hidden relative z-50 animate-scale-up text-left flex flex-col' onClick={(e) => e.stopPropagation()}>
                                
                                {/* Modal Header */}
                                <div className='p-6 border-b border-white/5 bg-white/1 flex justify-between items-center shrink-0'>
                                    <div className='flex items-center gap-3 min-w-0'>
                                        <div className='w-2.5 h-2.5 rounded-full bg-emerald-500/40 animate-pulse'></div>
                                        <h2 className='text-lg font-extrabold tracking-tight text-white truncate'>
                                            {currentOpenPhase.phaseName} <span className='text-gray-400 font-normal font-sans text-sm ml-2'>/ Pipeline Workspace</span>
                                        </h2>
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        {isAdmin && currentOpenPhase.tasks?.length > 0 && (
                                            <button 
                                                onClick={() => { handleClearAllTasks(currentOpenPhase.phaseName); setOpenPhaseName(null); }} 
                                                className='text-xs font-mono font-bold uppercase text-red-400 hover:text-red-300 transition-colors border border-red-500/20 bg-red-500/5 px-3 py-1.5 rounded-xl'
                                            >
                                                Wipe All Tasks
                                            </button>
                                        )}
                                        <button onClick={() => setOpenPhaseName(null)} className='text-gray-400 hover:text-white font-mono text-sm border border-white/6 bg-white/2 px-2.5 py-1 rounded-lg transition-all'>Escape [x]</button>
                                    </div>
                                </div>

                                {/* Modal Internal Body Split Layout */}
                                <div className='grow overflow-hidden flex flex-col md:flex-row'>
                                    
                                    {/* Left Panel: Task Submitter */}
                                    {isAdmin && (
                                        <div className='w-full md:w-80 border-b md:border-b-0 md:border-r border-white/4 p-6 bg-black/8 flex flex-col gap-4 shrink-0'>
                                            <div className='space-y-1'>
                                                <h3 className='text-xs font-bold tracking-widest text-gray-400 uppercase font-mono'>Register New Deliverable</h3>
                                                <p className='text-[11px] text-gray-500 leading-normal'>Incorporate atomic task tokens into this running framework phase pipeline environment.</p>
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
                                            <span>Active Nodes Registry</span>
                                            <span>{currentOpenPhase.tasks?.length || 0} Total Stacks</span>
                                        </div>

                                        <div className='grow overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-3'>
                                            {currentOpenPhase.tasks?.length === 0 ? (
                                                <div className='grow flex flex-col items-center justify-center text-center opacity-40 border border-dashed border-white/6 rounded-2xl p-12 my-auto font-mono text-xs text-gray-500'>
                                                    No task architectures mapped into this execution block matrix.
                                                </div>
                                            ) : (
                                                currentOpenPhase.tasks?.map((task) => (
                                                    <div 
                                                        key={task._id} 
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
                                                                <span className='text-[10px] font-mono text-gray-500 select-all'>node_hash: {task._id}</span>
                                                            </div>
                                                        </div>

                                                        <div className='flex items-center gap-4 shrink-0'>
                                                            {isAdmin ? (
                                                                /* Custom Smart Dropdown Menu Component Trigger */
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
                                                                        /* 
                                                                           BUG RESOLVED HERE:
                                                                           Dynamically checking `isDropUp` boolean value to swap alignments.
                                                                           If true -> opens upwards using `bottom-full mb-2`.
                                                                           If false -> opens downwards using `top-full mt-2`.
                                                                        */
                                                                        <div className={`absolute right-0 z-50 w-32 rounded-xl border border-white/8 bg-[#14161f] shadow-2xl overflow-hidden font-sans text-xs animate-fade-in ${
                                                                            isDropUp ? 'bottom-full mb-2' : 'top-full mt-2'
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