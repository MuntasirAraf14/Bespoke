import React, {useContext} from 'react'
import { ShopContext } from '../context/shopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const {products} = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = React.useState([]);

    React.useEffect(() => {
        const sortedProducts = [...products].sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        setLatestProducts(sortedProducts.slice(0, 12)); // Get the 12 latest products
    }, [products]);

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1="LATEST" text2="COLLECTION"/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-800'>
                Discover our latest collection of trendy and stylish products, carefully curated to keep you ahead in fashion. Explore now and elevate your wardrobe with the newest arrivals!

            </p>
        </div>

      {/*Render the 12 latest products*/}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-6'>
        {latestProducts.map((item, index) => (
          <ProductItem 
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

    </div>
  )
}

export default LatestCollection