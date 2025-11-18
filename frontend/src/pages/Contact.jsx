import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]'
        src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center gap-6 items-start'>
          <p className='font-semibold text-xl'>
            Our Store
          </p>
          <p className='text-gray-600'>
            54709 West 2nd Street, Suite 
            <br />
            San Francisco, CA 94107
          </p>
          
          <p className='text-shadow-gray-500'>
            Tel : (+880) 0000000 <br/>
            Email: blabla@gmail.com
          </p>
          <p className='font-semibold text-xl text-gray-800'>
            Careers at Forever
          </p>
          <p className='text-gray-700'>
            Learn more about our Teams and Culture.
          </p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 rounded-xl'>
            Explore Jobs
          </button>

        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default Contact