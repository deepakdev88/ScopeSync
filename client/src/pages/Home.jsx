import React from 'react'
import Navbar from "../components/Navbar"
import { NavLink } from 'react-router'

const Home = () => {
  return (
    <>
    <main className='w-screen h-screen flex flex-col  items-center'>
        <Navbar/>
      <div className='border-2 border-red-600 flex flex-col gap-3 justify-center items-center mt-12 '>
        <h1>Main Heading</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, sunt!</p>
        <span><button className='p-2 bg-green-400 rounded-xl'> <NavLink to="/admin">Devloper Console</NavLink> </button></span>
        
      </div>
    </main>
    </>
  )
}

export default Home
