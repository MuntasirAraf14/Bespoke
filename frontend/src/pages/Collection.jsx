import React from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';


const Collection = () => {

  const { products } = useContext(ShopContext);
  
  const [showFilters, setShowFilters] = React.useState(false);

  const [filterProducts, setFilterProducts] = React.useState([]);

  const [category, setCategory] = React.useState([]);
  const [subCategory, setSubCategory] = React.useState([]);

  const [sortBy, setSortBy] = React.useState('');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value)); 
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  }

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value)); 
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }
    setFilterProducts(productsCopy);

  }

  const sortProducts = (sortBy) => {
    let productsCopy = filterProducts.slice();
    if (sortBy === 'Low to High') {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'High to Low') {
      productsCopy.sort((a, b) => b.price - a.price); 
    } else {
      productsCopy = products.slice();
    }
    setFilterProducts(productsCopy);
  }



  React.useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  React.useEffect(() => {
    let filtered = products;
    if (category.length > 0) {
      filtered = filtered.filter(item => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      filtered = filtered.filter(item => subCategory.includes(item.subCategory));
    }
    setFilterProducts(filtered);
  }, [category, subCategory]);

  React.useEffect(() => {
    sortProducts(sortBy);
  }, [sortBy]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      <div className='min-w-60'>
        <p onClick={() => setShowFilters(!showFilters)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilters ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="Dropdown" />
        </p>
        
        {/* This is the key change */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilters ? '' : 'hidden'} sm:block`}>
          {/* Your filter content will go here */}
          <p className='mb-3 text-sm font-medium'>Categories</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-900'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'}  onChange={toggleCategory} />Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} />Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/>Kids
            </p>

          </div>
          {/* etc. */}
        </div>
        {/* Subcategory filters can go here */}
        <div>
           <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilters ? '' : 'hidden'} sm:block`}>
          {/* Your filter content will go here */}
          <p className='mb-3 text-sm font-medium'>Type</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-900'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory} />Topwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} />Bottomwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'}
              onChange={toggleSubCategory}/>Winterwear
            </p>

          </div>
          {/* etc. */}
        </div>
        </div>

      </div>
      {/* Right side */ }
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
             <Title text1={'All'} text2={'COLLECTIONS'}/>
             <select onChange={(e) => sortProducts(e.target.value)}className='border-2 border-gray-300 text-sm px-2'>
                <option value={'relevant'}>relevant</option>
                <option value={'Low to High'}>Low to High</option>
                <option value={'High to Low'}>High to Low</option>
                
             </select>
        </div>
        {/* Products Grid */ }
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (

            <ProductItem key={index} name={item.name} price={item.price} image={item.image} id={item._id} />

            
          ))
        }
        </div>

      </div>
    </div>
  )
}

export default Collection