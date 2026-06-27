import React from 'react'
import Navbar from '../components/Navbar'

const ProjectDashboard = ({
    project,
    isAdmin,
    activePhase,
    setActivePhase,
    taskInput,
    setTaskInput,
    handleTasksSubmit,
    handleClearAllTasks,
    handleStatusChange,
    handleDeleteTask
}) => {
    const copyToClipBoard = () => {
        const link = `${window.location.origin}/project/${project._id}`
        navigator.clipboard.writeText(link)
        alert("Client Link Copied to Clipboard!")
    }
    return (
        <>
            {project && (
                <div className='flex flex-col h-screen w-screen bg-gray-50'>
                    {/* <Navbar /> */}
                    <div className='flex mx-auto w-[90%] max-w-5xl my-4 p-4 bg-white border rounded-xl shadow-sm items-center justify-between'>
                        <div className='flex gap-4 items-center'>
                            <h2 className='text-xl font-bold border-r pr-4 text-gray-800'>{project.projectName}</h2>
                            <span className='bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded'>{project.models}</span>
                        </div>
                        {isAdmin && <div onClick={copyToClipBoard} className='text-sm text-green-600 font-semibold cursor-pointer hover:underline'>Client Link Generated 🔗</div> }
                        
                    </div>

                    <div className='w-[90%] max-w-5xl mx-auto mb-10'>
                        <h2 className='text-lg font-bold text-gray-700 mb-4'>Development Phases</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {project.phases.map((value) => (
                                <div key={value.phaseName} className='border bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 min-h-62.5'>
                                    <div className='flex justify-between items-center border-b pb-2'>
                                        <h3 className='font-bold text-gray-700'>{value.phaseName}</h3>
                                        {isAdmin && (
                                            <div className='flex gap-2'>
                                                <button onClick={() => setActivePhase(value.phaseName)} className='bg-green-500 text-white text-xs font-bold py-1 px-2.5 rounded hover:bg-green-600'>Add</button>
                                                {value.tasks.length > 0 && (
                                                    <button onClick={() => handleClearAllTasks(value.phaseName)} className='bg-red-100 text-red-600 text-xs font-bold py-1 px-2.5 rounded hover:bg-red-200'>Clear</button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {isAdmin && activePhase === value.phaseName && (
                                        <form onSubmit={(e) => handleTasksSubmit(e, value.phaseName)} className='mt-1'>
                                            <input
                                                type="text"
                                                value={taskInput}
                                                onChange={(e) => setTaskInput(e.target.value)}
                                                placeholder='Press Enter to save...'
                                                className='border p-2 text-sm rounded w-full focus:outline-none focus:border-green-500'
                                                autoFocus
                                            />
                                        </form>
                                    )}

                                    <ul className='flex flex-col gap-1.5 mt-2 overflow-y-auto max-h-45'>
                                        {value.tasks.length === 0 ? (
                                            <span className='text-xs text-gray-400 italic text-center my-auto'>No tasks yet</span>
                                        ) : (
                                            value.tasks.map((task, idx) => (
                                                // Added Flexbox design to put delete cross on the right end
                                                <li className='text-sm bg-gray-50 border p-2 rounded text-gray-600 flex justify-between items-center gap-2 break-all' key={idx}>
                                                    <span>{task.name}</span>
                                                    {isAdmin ? (<select value={task.status} onChange={(e) => handleStatusChange(value.phaseName, e.target.value, task._id)} >
                                                        <option value="pending">Pending</option>
                                                        <option value="progress">Progress</option>
                                                        <option value="completed">Completed</option>
                                                    </select>) : (
                                                        <span className="text-xs font-bold">{task.status}</span>
                                                    )}
                                                    {isAdmin && (
                                                        <button onClick={() => handleDeleteTask(value.phaseName, idx)}>❌</button>
                                                    )}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProjectDashboard
