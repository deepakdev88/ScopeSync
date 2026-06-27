import React from 'react'

const Navbar = () => {
  return (
    <nav className='border-2 border-amber-200 p-3 flex justify-between w-screen'>
      <div>ScopeSync</div>
      <div className='flex gap-1.5'>
        <span>github</span>
        <span>About</span>
      </div>
    </nav>
  )
}

export default Navbar
