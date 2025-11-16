import React from 'react'

const NewsletterBox = () => {

  const onSubmitHandler  = (event) =>{
      event.preventDefault();
      // You can add your subscription logic here
      alert("Thank you for subscribing!");
  }
  
  return (
    <div className='text-center'>
        <p  className='text-3xl font-semibold mb-4'>Subscribe now - get 20% offer</p>
        <p className='w-3/4 m-auto text-gray-600 mb-6'>Join our newsletter to stay updated with the latest trends, exclusive offers, and new arrivals. Subscribe now and enjoy a special 20% discount on your first purchase!</p>
        
        {/* Wrap in a <form> and change button type to "submit" */}
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input type="email" placeholder='Enter your email address' className='w-full sm:flex-1 outline-none' required/>
            <button type="submit" className='bg-black text-white p-3  hover:bg-gray-800 transition-colors'>
                Subscribe
            </button>
        </form>

    </div>
  )
}

export default NewsletterBox