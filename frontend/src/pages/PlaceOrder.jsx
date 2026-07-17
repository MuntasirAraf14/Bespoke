// pages/PlaceOrder.jsx (UPDATED PAYMENT SECTION)

import React, { useContext, useState } from "react";
import { ShopContext } from "../context/shopContext";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    getSubtotal,
    getTotal,
    currency,
    delivery_fee,
    token,
    products,
    cartItems,
    setCartItems,
    backendURL,
    setDeliveryFee, // Added setDeliveryFee here
  } = useContext(ShopContext);
  const navigate = useNavigate();

  // ... (State and Calculation definitions remain the same) ...
  const subtotal = getSubtotal();
  const total = getTotal();

  // State for form inputs (unchanged)
  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // --- NEW STATE FOR PAYMENT ---
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderNote, setOrderNote] = useState(""); // State for tailoring note
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  // ----------------------------

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!token) {
        toast.error("Please login to place order");
        navigate("/login", { state: { from: "/place-order" } });
        return;
      }

      let orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId),
            );
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      setIsSubmitting(true);

      let orderData = {
        address: addressData,
        items: orderItems,
        note: orderNote, // Pass note to backend
      };

      if (paymentMethod === "cod") {
        const response = await axios.post(
          backendURL + "/api/order/place",
          orderData,
          { headers: { token } },
        );
        if (response.data.success) {
          setCartItems({});
          navigate("/order");
        } else {
          toast.error(response.data.message);
        }
      } else if (paymentMethod === "sslcommerz") {
        const response = await axios.post(
          backendURL + "/api/order/sslcommerz",
          orderData,
          { headers: { token } },
        );
        if (response.data.success) {
          setCartItems({});
          window.location.replace(response.data.session_url);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Location Based Shipping Logic ---
  React.useEffect(() => {
    if (!addressData.city && !addressData.state) {
      setDeliveryFee(0);
      return;
    }
    const isInsideDhaka =
      addressData.city.toLowerCase().includes("dhaka") ||
      addressData.state.toLowerCase().includes("dhaka");
    setDeliveryFee(isInsideDhaka ? 60 : 120);
  }, [addressData.city, addressData.state, setDeliveryFee]);

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <form onSubmit={handleSubmit} className="pt-10">
      <Title text1="PLACE" text2="YOUR ORDER" />

      <div className="flex flex-col lg:flex-row gap-10 mt-8">
        {/* 1. Delivery Information (Left Side) - (unchanged) */}
        <div className="lg:w-3/5">
          {/* ... Address form inputs ... (as provided in previous step) */}
          <h2 className="text-2xl font-semibold mb-6">Delivery Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              required
              name="firstName"
              onChange={handleAddressChange}
              value={addressData.firstName}
              type="text"
              placeholder="First Name"
              className={inputClass}
            />
            <input
              required
              name="lastName"
              onChange={handleAddressChange}
              value={addressData.lastName}
              type="text"
              placeholder="Last Name"
              className={inputClass}
            />
          </div>

          <div className="mt-4">
            <input
              required
              name="email"
              onChange={handleAddressChange}
              value={addressData.email}
              type="email"
              placeholder="Email Address"
              className={inputClass}
            />
          </div>

          <div className="mt-4">
            <input
              required
              name="street"
              onChange={handleAddressChange}
              value={addressData.street}
              type="text"
              placeholder="Street Address"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <input
              required
              name="city"
              onChange={handleAddressChange}
              value={addressData.city}
              type="text"
              placeholder="City"
              className={inputClass}
            />
            <input
              required
              name="state"
              onChange={handleAddressChange}
              value={addressData.state}
              type="text"
              placeholder="State"
              className={inputClass}
            />
            <input
              required
              name="zipCode"
              onChange={handleAddressChange}
              value={addressData.zipCode}
              type="text"
              placeholder="Zip Code"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-10">
            <input
              required
              name="country"
              onChange={handleAddressChange}
              value={addressData.country}
              type="text"
              placeholder="Country"
              className={inputClass}
            />
            <input
              required
              name="phone"
              onChange={handleAddressChange}
              value={addressData.phone}
              type="text"
              placeholder="Phone Number"
              className={inputClass}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">
              Custom Tailoring / Note
            </h2>
            <textarea
              className={inputClass + " h-32 resize-none"}
              placeholder="Add special instructions for size, fit, or delivery..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* 2. Order Summary and Payment (Right Side) */}
        <div className="lg:w-2/5">
          <div className="border bg-gray-50 p-6 rounded-lg">
            {/* Summary Details (unchanged) */}
            <h2 className="text-2xl font-semibold mb-4 border-b pb-3">
              Order Summary
            </h2>
            {/* ... (Summary calculation structure remains the same) ... */}
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  {currency}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>
                  {delivery_fee === 0
                    ? <span className="text-sm text-gray-400 italic">Enter city to calculate</span>
                    : `${currency}${delivery_fee.toFixed(2)}`
                  }
                </span>
              </div>
              <hr className="my-3 border-gray-300" />
              <div className="flex justify-between text-xl font-bold text-black">
                <span>Total:</span>
                <span>
                  {delivery_fee === 0
                    ? `${currency}${subtotal.toFixed(2)}`
                    : `${currency}${total.toFixed(2)}`
                  }
                </span>
              </div>
            </div>

            {/* --- MODIFIED: Payment Method Section --- */}
            <h3 className="text-lg font-semibold mt-8 mb-4">Payment Method</h3>

            {/* Payment Options Wrapper */}
            <div className="flex flex-col gap-3" onChange={handlePaymentChange}>
              {/* 1. Cash on Delivery (COD) */}
              <label
                htmlFor="cod"
                className={`flex justify-between items-center p-3 rounded-md bg-white border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-black ring-1 ring-black shadow-md"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    required
                    checked={paymentMethod === "cod"}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <span className="text-gray-800 font-medium">
                    Cash on Delivery
                  </span>
                </div>
                {/* Placeholder for Icon (COD has no external logo) */}
                <span className="text-sm text-gray-600">Pay upon delivery</span>
              </label>

              {/* 2. Pay by Bkash */}

              {/* 2. Pay by Mobile Wallets (bKash / Nagad) */}
              <label
                htmlFor="sslcommerz"
                className={`flex justify-between items-center p-3 rounded-md bg-white border cursor-pointer transition-all ${paymentMethod === "sslcommerz" ? "border-black ring-1 ring-black shadow-md" : "border-gray-300 hover:border-gray-500"}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="sslcommerz"
                    value="sslcommerz"
                    required
                    checked={paymentMethod === "sslcommerz"}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <span className="text-gray-800 font-medium">
                    Mobile Payment (bKash/Nagad)
                  </span>
                </div>
                {/* We use assets for logos or text fallback if assets missing. Assuming generic representation for now */}
                <div className="flex gap-2">
                  <span className="text-xs bg-pink-600 text-white px-2 py-1 rounded">
                    bKash
                  </span>
                  <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">
                    Nagad
                  </span>
                </div>
              </label>
            </div>
            {/* --- END MODIFIED PAYMENT SECTION --- */}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-8 w-full bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
            >
              {isSubmitting
                ? "PROCESSING..."
                : delivery_fee === 0
                  ? `CONFIRM ORDER (${currency}${subtotal.toFixed(2)} + delivery)`
                  : `CONFIRM AND PAY (${currency}${total.toFixed(2)})`
              }
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default PlaceOrder;
