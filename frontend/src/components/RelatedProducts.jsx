import React, { useContext } from 'react'
import { ShopContext } from '../context/shopContext';
import ProductItem from '../components/ProductItem';
import Title from './Title';


const RelatedProducts = ({category, subCategory}) => {

    const {products} = useContext(ShopContext);
    const [relatedProducts, setRelatedProducts] = React.useState([]);

    React.useEffect(() => {
        if(products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter(item => category.includes(item.category));
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
            setRelatedProducts(productsCopy.slice(0,5));
        }
    }, [products, category, subCategory]);

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1="RELATED" text2="PRODUCTS"/>
        </div>
        <div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10'>
                {relatedProducts.map((item, index) => (
                    <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
                ))}
            </div>
        </div>
    </div>
  )
}

export default RelatedProducts