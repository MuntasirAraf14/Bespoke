import React, { useCallback, useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/shopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'


const Order = () => {

  const { backendURL, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = useCallback(async () => {
    try {
      if(!token){
        return null;
      }

      const response = await axios.post(backendURL + '/api/order/userorders', {}, {headers:{token}});
      if(response.data.success){
        const allOrdersItem = [];
        response.data.orders.forEach((order)=>{
          order.items.forEach((item)=>{
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          })
        })
        setOrderData(allOrdersItem.reverse());
      }
      
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendURL, token])

  useEffect(()=>{
    loadOrderData();
  },[loadOrderData])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      <div>
          {
            orderData.map((item, index) => (
              <div key={index} className='border-t border-b py-8 text-gray-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                        <img className='w-16 sm:w-20' src={item.image[0]} alt='' />
                        <div>
                            <p className='font-medium sm:text-base'>{item.name}</p>
                            <div className='flex items-center gap-3 mt-2 text-base text-gray-900'> 
                                <p className='text-lg'>{currency}{item.price}</p>
                                <p>Quantity : {item.quantity}</p>
                                <p>Size : {item.size}</p>
                            </div>
                            <p className='mt-2'>Date: <span className='text-gray-700'>{new Date(item.date).toDateString()}</span></p>
                            <p className='mt-2'>Payment: <span className='text-gray-700'>{item.paymentMethod}</span></p>
                        </div>
                  </div>
                <div className='md:w-1/2 flex justify-between'>
                    <div className='flex items-center gap-2'>
                        <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                        <p className='text-sm md:text-base'>{item.status}</p>
                    </div>
                    <button onClick={loadOrderData} className='py-2 px-4 rounded-xl border text-sm md:text-base font-medium text-black'>Track Order</button>

                </div>
              </div>
            ))
          }
      </div>
    </div>
  )
}

export default Order
