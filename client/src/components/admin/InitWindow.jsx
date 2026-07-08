import React from 'react'
import Navbar from '../Navbar';
import LogoutButton from '../LogoutButton';

const InitWindow = ({
    projects,
    setIsProjectWizard,
    setIsInitWindow,
    handleProject,
    deleteProject,
    showWipeConfirm,
    handleDeleteDatabase,
    setShowWipeConfirm,
    handleLogout
}) => {
    
    return (
        <>
            <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex flex-col relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300'>

                <div className='absolute top-[-20%] left-[50%] -translate-x-1/2 w-150 h-100 bg-emerald-500/[0.07] blur-[140px] rounded-full pointer-events-none'></div>
                <div className='absolute bottom-[-10%] left-[-10%] w-75 h-75 bg-green-500/2 blur-[100px] rounded-full pointer-events-none'></div>

                <Navbar onLogout={handleLogout} />
                

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
        </>
    )
}

export default InitWindow
