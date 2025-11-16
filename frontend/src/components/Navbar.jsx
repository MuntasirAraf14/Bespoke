import React from 'react'
import {assets} from '../assets/assets'
import { NavLink, Link } from 'react-router-dom'  
import {useState} from 'react'

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    // Navbar Container
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'>
        <img src={assets.logo} alt="Logo" className='w-36' />
      </Link>
       
       <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-400 hidden'/>
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-400 hidden'/>
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-400 hidden'/>
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-400 hidden'/>
        </NavLink>
       </ul>

       <div className='flex items-center gap-6'>
        <img src={assets.search_icon} alt="Menu" className='w-5 cursor-pointer' />

        <div className='group relative'>
          <img src={assets.profile_icon} alt="User" className='w-5 cursor-pointer' />
          <div className='absolute top-10 right-0 w-32 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity'>
              <p className='px-4 py-2 hover:bg-gray-300 rounded-t-md'>My Profile</p>
              <p className='px-4 py-2 hover:bg-gray-300 rounded-t-md'>Orders</p>
              <p className='px-4 py-2 hover:bg-gray-300 rounded-t-md'>Logout</p>
          </div>
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} alt="Cart" className='w-5 min-w-5' />
          <div className='absolute  right-[-5px] bottom-[-9px] text-white text-center leading-4 bg-black aspect-square rounded-full text-[10px] w-4 h-4.5 flex items-center justify-center rounded-full'>3</div>
        </Link>
        <img onClick={()=> setVisible(true)} src={assets.menu_icon} alt="Menu" className='w-6 cursor-pointer sm:hidden' />
       </div>

        {/* Mobile Menu */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
          <div className='flex flex-col text-gray-600'>
            <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt=""/>
            <p className='font-semibold'>Back</p>
            </div>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/'>HOME</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/collection'>COLLECTION</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/about'>ABOUT</NavLink>
            <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border border-gray-200' to='/contact'>CONTACT</NavLink>
          </div>
          
        </div>
          
    </div>
  )
}

export default Navbar