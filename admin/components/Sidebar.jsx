import React from 'react'
import { NavLink } from 'react-router-dom'
import {assets} from '../src/assets/assets'


const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2'>
        <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
            <NavLink className='flex items-center gap-3 p-2 px-4 rounded-full transition-all duration-200 uppercase text-sm font-medium border border-transparent text-gray-700 hover:border-gray-300 hover:text-black' to="/" end>
                <span className='text-xl'>📊</span>
                <span className='hidden md:block'>Dashboard</span>
            </NavLink>
            <NavLink className='flex items-center gap-3 p-2 px-4 rounded-full transition-all duration-200 uppercase text-sm font-medium border border-transparent text-gray-700 hover:border-gray-300 hover:text-black' to="/add">
                <img className='w-6 h-6' src={assets.add_icon} alt="Add Icon" />
                <span className='hidden md:block'>Add Item</span>
            </NavLink>
            <NavLink className='flex items-center gap-3 p-2 px-4 rounded-full transition-all duration-200 uppercase text-sm font-medium border border-transparent text-gray-700 hover:border-gray-300 hover:text-black' to="/list">
                <img className='w-6 h-6' src={assets.order_icon} alt="List Icon" />
                <span className='hidden md:block'>List Items</span>
            </NavLink>
            <NavLink className='flex items-center gap-3 p-2 px-4 rounded-full transition-all duration-200 uppercase text-sm font-medium border border-transparent text-gray-700 hover:border-gray-300 hover:text-black' to="/orders">
                <img className='w-6 h-6' src={assets.order_icon} alt="Order Icon" />
                <span className='hidden md:block'>Orders</span>
            </NavLink>
            <NavLink className='flex items-center gap-3 p-2 px-4 rounded-full transition-all duration-200 uppercase text-sm font-medium border border-transparent text-gray-700 hover:border-gray-300 hover:text-black' to="/job-applications">
                <span className='text-xl'>CV</span>
                <span className='hidden md:block'>Job Applications</span>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar
