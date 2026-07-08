import React from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

const Auth = ({
    handleAuth,
    isRegister
}) => {
    
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm()
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

export default Auth
