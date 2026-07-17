import React, { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "./shopContext";

const ShopContextProvider = (props) => {
  const currency = "৳";
  // const delivery_fee = 10; // Removed constant, now using state below
  const tokenStorageKey = "bespoke_customer_token";
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = React.useState("");
  const [showSearch, setShowSearch] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [token, setToken] = React.useState(() => localStorage.getItem(tokenStorageKey) || "");
  const [delivery_fee, setDeliveryFee] = React.useState(0); // 0 until user enters city/state on checkout

  // 1. Initialize cartItems by checking localStorage first.
  const [cartItems, setCartItems] = React.useState(() => {
    const storedCart = localStorage.getItem("cartData");
    try {
      return storedCart ? JSON.parse(storedCart) : {};
    } catch {
      localStorage.removeItem("cartData");
      return {};
    }
  });

  // 2. Synchronization Effect: Save cartItems to localStorage whenever the state changes.
  useEffect(() => {
    try {
      localStorage.setItem("cartData", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Error saving cart to local storage", e);
    }
  }, [cartItems]);

  // --- Core Cart Management Functions ---

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let newCartItems = structuredClone(cartItems);

    if (newCartItems[itemId]) {
      if (newCartItems[itemId][size]) {
        newCartItems[itemId][size] += 1;
      } else {
        newCartItems[itemId][size] = 1;
      }
    } else {
      newCartItems[itemId] = {};
      newCartItems[itemId][size] = 1;
    }
    setCartItems(newCartItems);

    if (token) {
      try {
        await axios.post(
          backendURL + "/api/cart/add",
          { productId: itemId, size },
          { headers: { token } },
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let newCartItems = structuredClone(cartItems);

    if (!newCartItems[itemId] || !newCartItems[itemId][size]) return;

    if (quantity <= 0) {
      // Delete the specific size entry
      delete newCartItems[itemId][size];

      // If there are no more sizes for this item, delete the item key entirely
      if (Object.keys(newCartItems[itemId]).length === 0) {
        delete newCartItems[itemId];
      }
    } else {
      newCartItems[itemId][size] = quantity;
    }
    setCartItems(newCartItems);

    if (token) {
      try {
        const response = await axios.post(
          backendURL + "/api/cart/update",
          { productId: itemId, size, quantity },
          {
            headers: {
              token: token,
            },
          },
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Error updating cart");
      }
    }
  };

  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        count += cartItems[itemId][size];
      }
    }
    return count;
  };

  // --- New Checkout Calculation Functions ---

  const getSubtotal = () => {
    let subtotal = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        for (const size in cartItems[itemId]) {
          subtotal += product.price * cartItems[itemId][size];
        }
      }
    }
    return subtotal;
  };

  const getTotal = () => {
    return getSubtotal() + delivery_fee;
  };

  // Function to get the flattened cart array (used for Cart.jsx and PlaceOrder.jsx)
  const getCartItemsData = () => {
    const cartData = [];
    // Create a map for faster lookup
    const productMap = new Map(products.map((p) => [p._id, p]));

    for (const itemId in cartItems) {
      const product = productMap.get(itemId);
      if (product) {
        for (const sizeKey in cartItems[itemId]) {
          const quantity = cartItems[itemId][sizeKey];
          if (quantity > 0) {
            cartData.push({
              ...product, // Include all product details
              size: sizeKey,
              quantity: quantity,
              totalPrice: product.price * quantity,
            });
          }
        }
      }
    }
    return cartData;
  };

  const getProductsData = useCallback(async () => {
    try {
      const limit = 100;
      let page = 1;
      let pages = 1;
      const allProducts = [];

      do {
        const response = await axios.get(`${backendURL}/api/product/list?page=${page}&limit=${limit}`);
        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }

        allProducts.push(...response.data.products);
        pages = response.data.pagination?.pages || 1;
        page += 1;
      } while (page <= pages);

      setProducts(allProducts);
    } catch (error) {
      console.log("Error fetching products:", error);
      toast.error("Error fetching products");
    }
  }, [backendURL]);

  const getUserCart = useCallback(async (userToken) => {
    try {
      const response = await axios.get(backendURL + "/api/cart/get", {
        headers: {
          token: userToken,
        },
      });
      console.log("API Response:", response.data);
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching cart");
    }
  }, [backendURL]);

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  useEffect(() => {
    const refreshProducts = () => {
      if (!document.hidden) {
        getProductsData();
      }
    };

    window.addEventListener("focus", refreshProducts);
    document.addEventListener("visibilitychange", refreshProducts);

    return () => {
      window.removeEventListener("focus", refreshProducts);
      document.removeEventListener("visibilitychange", refreshProducts);
    };
  }, [getProductsData]);

  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [getUserCart, token]);

  const value = {
    products: products,
    currency: currency,
    delivery_fee: delivery_fee,
    setDeliveryFee: setDeliveryFee, // Exposed setter
    search: search,
    setSearch: setSearch,
    showSearch: showSearch,
    setShowSearch: setShowSearch,
    cartItems: cartItems,
    addToCart: addToCart,
    getCartCount: getCartCount,
    setCartItems: setCartItems,
    updateQuantity: updateQuantity,

    // --- Added for Checkout ---
    getSubtotal: getSubtotal,
    getTotal: getTotal,
    getCartItemsData: getCartItemsData,
    backendURL: backendURL,
    token: token,
    setToken: setToken,
    tokenStorageKey,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
