import React from 'react'
import { useForm } from 'react-hook-form'
const ProjectWizard = ({
    handleProjectWizard
}) => {
    
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
  return (
    <>
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
    </>
  )
}

export default ProjectWizard
