import React from 'react'
import {assets} from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-800'>
        <div>
            <img src={assets.receving_img} className='w-12 m-auto mb-5' alt="Exchange Icon" />
            <h2 className='text-center text-xl font-semibold mb-2'>Easy Exchange Policy</h2>
            <p className='w-3/4 m-auto text-center text-gray-600 text-sm'>
                We offer a hassle-free exchange policy within 30 days of purchase. If you're not completely satisfied with your order, simply contact our customer service team to initiate the exchange process. Please ensure that the items are in their original condition with tags attached.
            </p>    
        </div>
        <div>
            <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="Quality Icon" />
            <h2 className='text-center text-xl font-semibold mb-2'>Premium Quality Products</h2>
            <p className='w-3/4 m-auto text-center text-gray-600 text-sm'>
                At Bespoke, we are committed to providing you with premium quality products. Each item in our collection is carefully selected and crafted to ensure durability, comfort, and style. We work with trusted suppliers to bring you the best in fashion.
            </p>    
        </div>
        <div>
            <img src={assets.support_img} className='w-12 m-auto mb-5' alt="Support Icon" />
            <h2 className='text-center text-xl font-semibold mb-2'>24/7 Customer Support</h2>
            <p className='w-3/4 m-auto text-center text-gray-600 text-sm'>
                Our dedicated customer support team is available 24/7 to assist you with any inquiries or issues you may have. Whether you need help with your order, product information, or general questions, we're here to provide prompt and friendly assistance.
            </p>    
        </div>  
    </div>
  )
}

export default OurPolicy