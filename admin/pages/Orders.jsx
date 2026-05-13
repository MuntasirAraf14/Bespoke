import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendURL, currency } from "../src/config";
import { assets } from "../src/assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = useCallback(async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendURL + "/api/order/list",
        {},
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [token]);

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendURL + "/api/order/status",
        { orderId, status: event.target.value },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Order Page</h1>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border-2 border-gray-200 p-5 md:p-8 rounded-lg hover:shadow-lg transition-shadow"
          >
            {/* Parcel Icon */}
            <img className="w-12" src={assets.parcel_icon} alt="Parcel" />

            {/* Order Details */}
            <div>
              {/* Items List */}
              <div className="mb-3">
                {order.items.map((item, idx) => {
                  if (idx === order.items.length - 1) {
                    return (
                      <p key={idx} className="text-sm text-gray-700">
                        {item.name} x {item.quantity}{" "}
                        <span className="text-xs text-gray-500">
                          ({item.size})
                        </span>
                      </p>
                    );
                  } else {
                    return (
                      <p key={idx} className="text-sm text-gray-700">
                        {item.name} x {item.quantity}{" "}
                        <span className="text-xs text-gray-500">
                          ({item.size})
                        </span>
                        ,
                      </p>
                    );
                  }
                })}
              </div>

              {/* Customer Name */}
              <p className="font-semibold text-gray-800 mb-2">
                {order.address.firstName + " " + order.address.lastName}
              </p>

              {/* Address */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state},{" "}
                  {order.address.zipcode}, {order.address.country}
                </p>
              </div>

              {/* Phone */}
              <p className="text-sm text-gray-600 mt-2">
                📞 {order.address.phone}
              </p>
            </div>

            {/* Order Summary */}
            <div className="text-sm space-y-1">
              <p className="font-medium">
                Items:{" "}
                <span className="text-gray-600">{order.items.length}</span>
              </p>
              <p className="font-medium">
                Method:{" "}
                <span className="text-gray-600">{order.paymentMethod}</span>
              </p>
              <p className="font-medium">
                Payment:{" "}
                <span
                  className={`ml-1 ${
                    order.payment ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {order.payment ? "Done" : "Pending"}
                </span>
              </p>
              <p className="font-medium">
                Date:{" "}
                <span className="text-gray-600">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </p>
            </div>

            {/* Price Details */}
            <div className="text-sm space-y-1">
              <p className="text-gray-600">
                Amount:{" "}
                <span className="font-semibold">
                  {currency}
                  {order.amount}
                </span>
              </p>
            </div>

            {/* Status Selector */}
            <div>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="px-4 py-2 border-2 border-gray-300 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
