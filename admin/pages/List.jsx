import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendURL, currency } from '../src/config';

const List = ({ token }) => {

  const [list, setList] = React.useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendURL + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error('Failed to fetch product list');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error fetching product list');
    }
  };

  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(
        backendURL + '/api/product/remove',
        { productId },
        { headers: { token: token } }
      );

      if (response.data.success) {
        toast.success('Product removed successfully');
        await fetchList();
      } else {
        toast.error('Failed to remove product');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error removing product');
    }
  }; 

  React.useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className='mb-2 text-lg font-semibold'>
        Product List Page - {list.length} products found.
        <div className='mt-5'>

          {/* Header */}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>

          {/* Product List */}
          {list.map((item, index) => (
            <div
              key={index}
              className='grid md:grid-cols-[1fr_3fr_1fr_1fr_1fr] grid-cols-[1fr_3fr_1fr] items-center gap-2 py-2 px-2 border-b text-sm'
            >
              <img src={item.image[0]} alt={item.name} className='w-16 h-16 object-cover' />
              <span>{item.name}</span>
              <span>{item.category} / {item.subCategory}</span>
              <span>{currency} {item.price}</span>

              {/* Delete Button */}
              <button
                onClick={() => removeProduct(item._id)}
                className='px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600'
              >
                Delete
              </button>
            </div>
          ))}

        </div>
      </p>
    </>
  )
}

export default List;
