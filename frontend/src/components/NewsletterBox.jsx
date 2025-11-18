// NewsletterBox.jsx (STRUCTURAL IMPROVEMENT)

import React from 'react'

const NewsletterBox = () => {

  const onSubmitHandler  = (event) =>{
      event.preventDefault();
      // You can add your subscription logic here (e.g., API call)
      alert("Thank you for subscribing!");
  }
  
  return (
    <div className='text-center py-16'> {/* Added vertical padding for spacing */}
        <p className='text-3xl font-semibold mb-4'>Subscribe now - get 20% offer</p>
        <p className='w-full max-w-lg mx-auto text-gray-600 mb-8 px-4'> 
            {/* Used max-w-lg and center margin for better responsiveness */}
            Join our newsletter to stay updated with the latest trends, exclusive offers, and new arrivals. Subscribe now and enjoy a special 20% discount on your first purchase!
        </p>
        
        {/* Form: Increased overall max width for desktop input area */}
        <form 
            onSubmit={onSubmitHandler} 
            className='w-full max-w-md flex items-center gap-0 mx-auto border border-gray-300'
        >
            {/* Input: Uses flex-grow to take all remaining space within the form. Added padding. */}
            <input 
                type="email" 
                placeholder='Enter your email address' 
                className='flex-grow px-4 py-3 outline-none focus:ring-1 focus:ring-gray-400' 
                required
            />
            {/* Button: Fixed width, prominent background */}
            <button 
                type="submit" 
                className='bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800 transition-colors shrink-0'
            >
                Subscribe
            </button>
        </form>

    </div>
  )
}

export default NewsletterBox