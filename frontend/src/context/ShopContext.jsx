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
    
    // --- MODIFICATION 1: INITIAL STATE ---
    // Initialize cartItems by checking localStorage first. 
    // If local storage has cart data, use it; otherwise, start with an empty object.
    const [cartItems, setCartItems] = React.useState(() => {
        const storedCart = localStorage.getItem('cartData');
        return storedCart ? JSON.parse(storedCart) : {};
    });    

    // --- MODIFICATION 2: SYNCHRONIZATION EFFECT ---
    // Save cartItems to localStorage whenever the state changes.
    useEffect(() => {
        try {
            localStorage.setItem('cartData', JSON.stringify(cartItems));
        } catch (e) {
            console.error("Error saving cart to local storage", e);
        }
    }, [cartItems]);
    // ---------------------------------------------------


    const addToCart = async (itemId, size) => {
        if(!size){
            toast.error('Please select a size');
            return;
        }

        // Use structuredClone() for safer deep copying
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
        setCartItems(newCartItems); // This state change triggers the useEffect above
    }
    
    // ... (All other functions like getCartCount, updateQuantity remain the same) ...

    const getCartCount = () => {
        let count = 0;
        for(const itemId in cartItems){
            for(const size in cartItems[itemId]){
                if(cartItems[itemId][size] > 0){
                    count += cartItems[itemId][size];
                }
            }
        }
        return count;
    }

    const updateQuantity = (itemId, size, quantity) => {
        let newCartItems = structuredClone(cartItems);
        
        if (quantity <= 0) {
            // If quantity is zero or less, delete the specific size entry
            delete newCartItems[itemId][size];
            
            // If there are no more sizes for this item, delete the item key entirely
            if (Object.keys(newCartItems[itemId]).length === 0) {
                delete newCartItems[itemId];
            }
        } else {
            newCartItems[itemId][size] = quantity;
        }
        setCartItems(newCartItems); // This state change triggers the useEffect above
    }

    // ... (rest of the value object and return statement remain the same) ...

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
        updateQuantity: updateQuantity
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;