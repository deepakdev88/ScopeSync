import React from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react';

const FinalWizard = ({
    handleModelsWizard,
    
}) => {
    const [selectedModel, setSelectedModel] = useState("Waterfall");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
    return (
        <>
            <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex justify-center items-center px-4 relative overflow-hidden'>
                <div className='absolute top-[-10%] left-[50%] -translate-x-1/2 w-100 h-50 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none'></div>

                <form
                    onSubmit={handleSubmit(handleModelsWizard)}
                    className='p-6 w-full max-w-md flex flex-col gap-4 border border-white/6 bg-[#0d0e14]/80 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 animate-scale-up'
                >
                    <div className='space-y-1'>
                        <h2 className='text-lg font-bold tracking-tight text-white'>Select SDLC Model</h2>
                        <p className='text-xs text-gray-500'>Choose a software development life cycle model for your project.</p>
                    </div>


                    <input type="hidden" value={selectedModel} {...register("models", { required: "Please select a model." })} />


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
        </>
    )
}

export default FinalWizard
