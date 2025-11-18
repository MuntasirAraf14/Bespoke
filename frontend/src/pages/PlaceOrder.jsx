// pages/PlaceOrder.jsx (UPDATED PAYMENT SECTION)

import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { assets } from "../assets/assets"; // Ensure assets are imported

const PlaceOrder = () => {
  const { getCartCount, getSubtotal, getTotal, currency, delivery_fee } =
    useContext(ShopContext);
  const navigate = useNavigate();

  // ... (State and Calculation definitions remain the same) ...
  const cartItemCount = getCartCount();
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
  // ----------------------------

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation
    if (getCartCount() === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return;
    }

    // Logic to process order based on paymentMethod
    console.log("Order submitted. Payment method:", paymentMethod);
    // ... API call here ...
  };

  // Redirect if cart is empty
  if (cartItemCount === 0) {
    navigate("/cart");
    return null;
  }

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
                  {currency}
                  {delivery_fee.toFixed(2)}
                </span>
              </div>
              <hr className="my-3 border-gray-300" />
              <div className="flex justify-between text-xl font-bold text-black">
                <span>Total:</span>
                <span>
                  {currency}
                  {total.toFixed(2)}
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

              {/*<label 
                                htmlFor='bkash' 
                                className={`flex justify-between items-center p-3 rounded-md bg-white border cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'border-black ring-1 ring-black shadow-md' : 'border-gray-300 hover:border-gray-500'}`}
                            >
                                <div className='flex items-center gap-3'>
                                    <input type='radio' name='paymentMethod' id='bkash' value='bkash' required checked={paymentMethod === 'bkash'} className='w-4 h-4 text-black focus:ring-black' />
                                    <span className='text-gray-800 font-medium'>Pay by Bkash</span>
                                </div>
                                <img src={assets.bkash_logo} alt='Bkash Logo' className='w-12 h-auto'/>
                            </label>
                            */}

              {/* 3. Pay by Credit/Debit Card */}
              <label
                htmlFor="card"
                className={`flex justify-between items-center p-3 rounded-md bg-white border cursor-pointer transition-all ${
                  paymentMethod === "card"
                    ? "border-black ring-1 ring-black shadow-md"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="card"
                    value="card"
                    required
                    checked={paymentMethod === "card"}
                    className="w-4 h-4 text-black focus:ring-black"
                  />
                  <span className="text-gray-800 font-medium">
                    Credit/Debit Card
                  </span>
                </div>

                {/* --- FIX: Grouping and Responsive Image Sizing --- */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <img
                    src={assets.visa_card}
                    alt="Visa Card Logo"
                    className="w-8 sm:w-10 h-auto" // Use responsive utility widths
                  />
                  <img
                    src={assets.master_card}
                    alt="MasterCard Logo"
                    className="w-8 sm:w-10 h-auto" // Use responsive utility widths
                  />
                </div>
                {/* --- END FIX --- */}
              </label>
            </div>
            {/* --- END MODIFIED PAYMENT SECTION --- */}

            <button
              type="submit"
              className="mt-8 w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              CONFIRM AND PAY ({currency}
              {total.toFixed(2)})
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
