import React from 'react'
import Title from '../components/Title'
import {assets} from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1="About" text2="Us"/>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt=""/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-900'>
          <p>
          Bespoke is a premier destination for high-quality custom tailoring and fashion, dedicated to providing clients with personalized style and exceptional craftsmanship. From bespoke suits to custom-designed ensembles, we bring your vision to life with precision, style, and attention to detail.
          </p>
          <p>
          We believe that true style comes from perfect fit and personal expression. Our expert tailors and designers work closely with each client to create garments that reflect their unique personality and enhance their confidence. Whether for business, special occasions, or everyday elegance, Bespoke delivers timeless sophistication tailored just for you.
          </p>
          <b className='text-gray-900'>Our Mission</b>
          <p>
            To empower individuals through exceptional custom tailoring, where every garment tells a story of personal style, confidence, and refined craftsmanship. Bespoke is committed to delivering precision, quality, and timeless elegance in every stitch, ensuring each client feels extraordinary in what they wear.
          </p>
        </div>
      </div>
      <div className='text-4xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 mr-5'>
          <p className='text-2xl text-gray-900'>Customer Service</p>
          <p>
            At Bespoke, we're committed to providing exceptional service from the moment you walk through our door. Our friendly team is always ready to assist you with personalized styling advice, product recommendations, and any questions you may have. Whether you're in-store or shopping online, we're here to make your experience seamless and enjoyable.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 mr-5'>
          <p className='text-2xl text-gray-900'>Convenience</p>
          <p>
            We believe that true style comes from perfect fit and personal expression. Our expert tailors and designers work closely with each client to create garments that reflect their unique personality and enhance their confidence. Whether for business, special occasions, or everyday elegance, Bespoke delivers timeless sophistication tailored just for you.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <p className='text-2xl text-gray-900'>Quality Assurance</p>
          <p>
            Quality is at the heart of everything we do at Bespoke. From the fabrics we select to the final stitch, every detail is crafted with precision and care. Our commitment to excellence ensures that every garment you wear not only looks stunning but also feels luxurious and lasts for years to come.
          </p>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default About