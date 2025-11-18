import React from 'react'


const Login = () => {

  const [currentState, setCurrentState] = React.useState('Sign Up');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // You can add your subscription logic here (e.g., API call)
    
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700'> 
      <div className='inline-flex items-center gap-2 mb-2 mt-10'> 
          <p className='prata-regular text-3xl sm:py-3 lg:text-5xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-900'/>
      </div>
      {currentState === 'Login' ? '' : <input type="text" placeholder='Name' className='w-full px-4 py-3 border border-gray-800 ' required>
      </input> }
      <input type="email" placeholder='Email' className='w-full px-4 py-3 border border-gray-800 ' required>
      </input>
      <input type="password" placeholder='password' className='w-full px-4 py-3 border border-gray-800 ' required>
      </input>
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot Password?</p>
        {
          currentState === 'Login' ? 
          <p className='cursor-pointer' onClick={() => setCurrentState('Sign Up')}>Create account</p> :
          <p className='cursor-pointer' onClick={() => setCurrentState('Login')}>Login Here</p>
        }
      </div>
      <button className='bg-black rounded-md text-white font-light px-8 py-2 mt-4'>
        {
          currentState === 'Login' ? 'Sign in' : 'Sign Up'
        }
      </button>
    </form>
  )
}

export default Login