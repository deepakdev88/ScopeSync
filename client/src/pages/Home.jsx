import React from 'react'
import Navbar from "../components/Navbar"
import { NavLink } from 'react-router'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='w-full min-h-screen bg-[#090a0f] text-gray-300 flex flex-col relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-300'>

      {/* Background Ambient Glows */}
      <div className='absolute top-[-10%] left-[50%] -translate-x-1/2 w-150 h-75 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none'></div>
      <div className='absolute top-[50%] left-[-10%] w-125 h-125 bg-emerald-500/2 blur-[150px] rounded-full pointer-events-none'></div>
      <div className='absolute bottom-[10%] right-[-10%] w-100 h-100 bg-green-500/3 blur-[150px] rounded-full pointer-events-none'></div>

      <Navbar />

      {/* 1. HERO SECTION */}
      <header className='pt-20 pb-12 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto text-center relative z-10'>
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-medium mb-6 select-none animate-pulse'>
           Production Ready Dashboard
        </div>

        <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-gray-400 leading-tight mb-4'>
          Track Project Scopes <br /> Without the Chaos.
        </h1>

        <p className='text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mb-8 leading-relaxed'>
          A high-performance management console built for developers. Streamline your project lifecycle, map your phases, and sync directly with your deployment workflows seamlessly.
        </p>

        <div>
          <NavLink
            to="/admin"
            className='inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm bg-linear-to-r from-emerald-500 to-green-600 text-black hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
          >
            Launch Developer Console
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NavLink>
        </div>
      </header>

      {/* 2. PRODUCT VISUAL ANCHOR (Dashboard UI Mockup) */}
      <section className='w-full max-w-5xl mx-auto px-6 mb-16 relative z-10'>
        <div className='w-full rounded-2xl border border-white/6 bg-[#0d0e14]/60 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group'>
          {/* Top Bar Mimicking Browser Window */}
          <div className='flex items-center justify-between border-b border-white/4 pb-3 mb-4'>
            <div className='flex gap-1.5'>
              <span className='w-3 h-3 rounded-full bg-white/10'></span>
              <span className='w-3 h-3 rounded-full bg-white/10'></span>
              <span className='w-3 h-3 rounded-full bg-white/10'></span>
            </div>
            <div className='text-[11px] text-gray-600 font-mono bg-[#090a0f] px-4 py-0.5 rounded-md border border-white/2 select-none'>
              scope-sync.app/admin
            </div>
            <div className='w-12'></div>
          </div>

          
          {/* Minimalist Visual Simulation of Dashboard */}
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 p-2 text-left text-xs font-sans group-hover:opacity-100 transition-opacity duration-300'>

            {/* Simulated Phase 1 */}
            <div className='rounded-xl border border-white/4 bg-white/1 p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-colors'>
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <span className='font-semibold text-gray-200'>Phase 1: Discovery</span>
                  <span className='px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'>Done</span>
                </div>
                <div className='space-y-2'>
                  <div className='p-2 rounded bg-white/2 border border-white/2 text-gray-400 flex justify-between items-center'>
                    <span>Initial Architecture Wireframes</span>
                    <span className='text-gray-600'>✓</span>
                  </div>
                  <div className='p-2 rounded bg-white/2 border border-white/2 text-gray-400 flex justify-between items-center'>
                    <span>Database Schema Mapping</span>
                    <span className='text-gray-600'>✓</span>
                  </div>
                </div>
              </div>
              <div className='mt-4 text-[10px] text-gray-600 font-mono'>Updated 2h ago</div>
            </div>

            {/* Simulated Phase 2 */}
            <div className='rounded-xl border border-white/4 bg-white/1 p-4 flex flex-col justify-between hover:border-blue-500/20 transition-colors'>
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <span className='font-semibold text-gray-200'>Phase 2: Core Engine</span>
                  <span className='px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/10'>In Progress</span>
                </div>
                <div className='space-y-2'>
                  <div className='p-2 rounded bg-white/2 border border-white/2 text-gray-300 flex justify-between items-center'>
                    <span>JWT Authentication Pipeline</span>
                    <span className='w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse'></span>
                  </div>
                  <div className='p-2 rounded bg-white/2 border border-white/2 text-gray-500 '>
                    <span>API Router Setup</span>
                  </div>
                </div>
              </div>
              <div className='mt-4 text-[10px] text-gray-600 font-mono'>Updated 10m ago</div>
            </div>

            {/* Simulated Phase 3 */}
            <div className='rounded-xl border border-white/4 bg-white/1 p-4 flex flex-col justify-between hover:border-purple-500/20 transition-colors'>
              <div>
                <div className='flex items-center justify-between mb-3'>
                  <span className='font-semibold text-gray-200'>Phase 3: Deployment</span>
                  <span className='px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/10'>Pending</span>
                </div>
                <div className='space-y-2'>
                  <div className='p-2 rounded bg-white/1 border border-white/1 text-gray-600'>
                    AWS EC2 Instance Provisioning
                  </div>
                  <div className='p-2 rounded bg-white/1 border border-white/1 text-gray-600'>
                    SSL Certificate Configuration
                  </div>
                </div>
              </div>
              <div className='mt-4 text-[10px] text-gray-600 font-mono'>Locked</div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PREMIUM FEATURES GRID */}
      <section className='w-full max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-white/4'>
        <div className='text-center mb-16'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3'>
            Engineered for Modern Workflows
          </h2>
          <p className='text-sm text-gray-500 max-w-md mx-auto'>
            Stop fighting complex project systems. Get straight to mapping your development milestones.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

          {/* Card 1 with SVG */}
          <div className='group border border-white/5 bg-[#111218]/30 backdrop-blur-sm p-6 rounded-2xl hover:border-emerald-500/20 transition-all duration-300'>
            <div className='w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className='text-lg font-bold text-gray-200 mb-2'>Instant Scoping</h3>
            <p className='text-sm text-gray-500 leading-relaxed'>
              Create projects instantly using Agile, Scrum, Kanban, or Waterfall methodology blueprints with zero setup.
            </p>
          </div>

          {/* Card 2 with SVG */}
          <div className='group border border-white/5 bg-[#111218]/30 backdrop-blur-sm p-6 rounded-2xl hover:border-emerald-500/20 transition-all duration-300'>
            <div className='w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className='text-lg font-bold text-gray-200 mb-2'>Secure Client Links</h3>
            <p className='text-sm text-gray-500 leading-relaxed'>
              Generate read-only real-time tracking dashboards for clients with a single secure link.
            </p>
          </div>

          {/* Card 3 with SVG */}
          <div className='group border border-white/5 bg-[#111218]/30 backdrop-blur-sm p-6 rounded-2xl hover:border-emerald-500/20 transition-all duration-300 sm:col-span-2 lg:col-span-1'>
            <div className='w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className='text-lg font-bold text-gray-200 mb-2'>Isolated User Data</h3>
            <p className='text-sm text-gray-500 leading-relaxed'>
              Every request is scoped to the authenticated user - your projects, tasks, and data are never visible to anyone else on the platform.
            </p>
          </div>

        </div>
      </section>

      {/* 4. BOTTOM CALL-TO-ACTION (CTA) */}
      <section className='w-full max-w-4xl mx-auto px-6 py-16 text-center relative z-10 border-t border-white/4'>
        <h2 className='text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3'>
          Ready to Sync Your Project Scope?
        </h2>
        <p className='text-sm text-gray-500 max-w-md mx-auto mb-6'>
          Deploy your clean developer console in seconds and give your clients instant status clarity.
        </p>
        <NavLink
          to="/admin"
          className='inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-xs bg-white text-black hover:bg-gray-200 transition-all duration-200'
        >
          Open Admin Console
        </NavLink>
      </section>

      <Footer/>

    </div>
  )
}

export default Home