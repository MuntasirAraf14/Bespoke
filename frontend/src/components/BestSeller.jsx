import React from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';


const BestSeller = () => {

    const {products} = useContext(ShopContext);
    const [bestSellerProducts, setBestSellerProducts] = React.useState([]);

    React.useEffect(() => {
        const bestSellers = products.filter((item) => item.bestseller);
        setBestSellerProducts(bestSellers.slice(0, 5));
    }, [products]);


  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1="BEST" text2="SELLERS" />
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Explore our top-rated products that customers love the most. These bestsellers are known for their exceptional quality, value, and popularity. Don't miss out on these must-have items!
            </p>
        </div>

        <div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
                {bestSellerProducts.map((item, index) => (
                    <div key={item.id} className='border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow duration-300'>
                       <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image}/>
                       
                    </div>
                ))}
            </div>
        </div>

    </div>
  )
}

export default BestSeller