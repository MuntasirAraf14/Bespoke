import React, { useMemo, useContext } from "react";
import { ShopContext } from "../context/shopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Cart = () => {
  // Added delivery_fee to context access
  const { products, currency, cartItems, updateQuantity, delivery_fee } =
    useContext(ShopContext);

  // --- Helper function to find product details by ID ---
  const getProductDetails = (id) =>
    products.find((product) => product._id === id);

  const cartData = useMemo(() => {
    if (products.length === 0) {
      return [];
    }

    const tempData = [];
    for (const itemId in cartItems) {
      for (const sizeKey in cartItems[itemId]) {
        const quantity = cartItems[itemId][sizeKey];
        if (quantity > 0) {
          tempData.push({
            id: itemId,
            size: sizeKey,
            quantity: quantity,
          });
        }
      }
    }
    return tempData;
  }, [cartItems, products]);

  // --- Helper function to calculate Subtotal ---
  const calculateSubtotal = () => {
    let subtotal = 0;
    cartData.forEach((item) => {
      const product = getProductDetails(item.id);
      if (product) {
        subtotal += product.price * item.quantity;
      }
    });
    return subtotal;
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + delivery_fee;

  // --- FIX 2: Controlled Input Handler for Quantity ---
  const handleQuantityChange = (itemId, size, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(itemId, size, quantity);
    } else {
      // If quantity drops to zero, remove the item
      updateQuantity(itemId, size, 0);
    }
  };

  if (cartData.length === 0) {
    return (
      <div className="py-20 text-center">
        <Title text1="Your" text2="Cart" />
        <p className="mt-8 text-lg text-gray-600">Your cart is empty.</p>
        <Link
          to="/collection"
          className="mt-4 inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-8">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* 1. Cart Items List (Left Side) */}
        <div className="lg:w-3/5">
          {cartData.map((item) => {
            const productData = getProductDetails(item.id);
            if (!productData) return null; // Safety check

            return (
              <div
                key={`${item.id}-${item.size}`}
                className="py-4 border-b text-gray-900 grid grid-cols-[3fr_2fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                {/* Product Info */}
                <div className="flex items-start gap-6">
                  <img
                    src={productData.image[0]}
                    alt={productData.name}
                    className="w-20 h-20 object-cover border"
                  />
                  <div>
                    <p className="font-medium">{productData.name}</p>
                    <div className="flex items-center gap-5 mt-1 text-sm">
                      <p className="font-semibold">
                        {currency}
                        {productData.price}
                      </p>
                      <p className="text-xs px-2 py-0.5 border bg-gray-100 rounded-sm">
                        Size: {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity & Subtotal */}
                <div className="flex items-center justify-between">
                  {/* Quantity Input (FIXED: Controlled Component) */}
                  <input
                    type="number"
                    min="1"
                    className="w-16 px-2 py-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, item.size, e.target.value)
                    }
                  />

                  {/* Item Total Price */}
                  <p className="hidden sm:block font-semibold">
                    {currency}
                    {productData.price * item.quantity}
                  </p>
                </div>

                {/* Remove Icon (FIXED: Correctly calling updateQuantity with ID) */}
                <img
                  onClick={() => updateQuantity(item.id, item.size, 0)}
                  className="w-5 cursor-pointer justify-self-end hover:opacity-70"
                  src={assets.bin_icon}
                  alt="Remove"
                />
              </div>
            );
          })}
        </div>

        {/* 2. Cart Summary (Right Side) */}
        <div className="lg:w-2/5 p-6 border bg-gray-50 rounded-lg h-max">
          <h2 className="text-xl font-semibold mb-6 border-b pb-3">
            Cart Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-medium">
                {currency}
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee:</span>
              <span className="font-medium">
                {delivery_fee === 0
                  ? <span className="text-sm text-gray-400 italic">Calculated at checkout</span>
                  : `${currency}${delivery_fee.toFixed(2)}`
                }
              </span>
            </div>

            <hr className="my-3 border-gray-300" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>
                {delivery_fee === 0
                  ? `${currency}${subtotal.toFixed(2)}`
                  : `${currency}${total.toFixed(2)}`
                }
              </span>
            </div>
          </div>
          <div>
            <Link
              to="/place-order"
              className="mt-8 block w-full text-center bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              PROCEED TO CHECKOUT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
