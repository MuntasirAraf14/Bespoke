import { createContext } from "react";
import { products } from "../assets/assets";
import React, { useEffect } from "react";   
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = React.useState('');
    const [showSearch, setShowSearch] = React.useState(false);
    
    // 1. Initialize cartItems by checking localStorage first.
    const [cartItems, setCartItems] = React.useState(() => {
        const storedCart = localStorage.getItem('cartData');
        return storedCart ? JSON.parse(storedCart) : {};
    });    

    // 2. Synchronization Effect: Save cartItems to localStorage whenever the state changes.
    useEffect(() => {
        try {
            localStorage.setItem('cartData', JSON.stringify(cartItems));
        } catch (e) {
            console.error("Error saving cart to local storage", e);
        }
    }, [cartItems]);

    // --- Core Cart Management Functions ---

    const addToCart = async (itemId, size) => {
        if(!size){
            toast.error('Please select a size');
            return;
        }

        let newCartItems = structuredClone(cartItems);
        
        if(newCartItems[itemId]){
            if(newCartItems[itemId][size]){
                newCartItems[itemId][size] += 1;
            } else {
                newCartItems[itemId][size] = 1;   
            }
        } else {
            newCartItems[itemId] = {};
            newCartItems[itemId][size] = 1;
        }
        setCartItems(newCartItems);
    }

    const updateQuantity = (itemId, size, quantity) => {
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
    }

    const getCartCount = () => {
        let count = 0;
        for(const itemId in cartItems){
            for(const size in cartItems[itemId]){
                count += cartItems[itemId][size];
            }
        }
        return count;
    }
    
    // --- New Checkout Calculation Functions ---

    const getSubtotal = () => {
        let subtotal = 0;
        for (const itemId in cartItems) {
            const product = products.find(p => p._id === itemId);
            if (product) {
                for (const size in cartItems[itemId]) {
                    subtotal += product.price * cartItems[itemId][size];
                }
            }
        }
        return subtotal;
    }

    const getTotal = () => {
        return getSubtotal() + delivery_fee;
    }
    
    // Function to get the flattened cart array (used for Cart.jsx and PlaceOrder.jsx)
    const getCartItemsData = () => {
        const cartData = [];
        for(const itemId in cartItems){
            const product = products.find(p => p._id === itemId);
            if (product) {
                for(const sizeKey in cartItems[itemId]){
                    const quantity = cartItems[itemId][sizeKey];
                    if(quantity > 0){
                        cartData.push({
                            ...product, // Include all product details
                            size: sizeKey,
                            quantity: quantity,
                            totalPrice: product.price * quantity
                        });
                    }
                }
            }
        }
        return cartData;
    }

    const value = {
        products: products,
        currency: currency,
        delivery_fee: delivery_fee,
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
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;