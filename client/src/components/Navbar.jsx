import React from 'react'
import { NavLink } from 'react-router'

const Navbar = () => {
  return (
    <nav className='sticky top-0 z-50 w-full border-b border-white/6 bg-[#090a0f]/80 backdrop-blur-md px-6 py-4'>
      <div className='max-w-6xl mx-auto flex justify-between items-center w-full'>
        {/* Brand Logo */}
        <div className='text-lg font-bold tracking-tight text-white flex items-center gap-2 select-none'>
          <span className='bg-linear-to-r from-emerald-400 to-green-500 w-3 h-3 rounded-full animate-pulse'></span>
          ScopeSync
        </div>
        
        {/* Nav Links */}
        <div className='flex items-center gap-6 text-sm font-medium text-gray-400'>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className='hover:text-white transition-colors duration-200 flex items-center gap-1'
          >
            GitHub
          </a>
          <NavLink to="/about" className='hover:text-white transition-colors duration-200'>
            About
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar