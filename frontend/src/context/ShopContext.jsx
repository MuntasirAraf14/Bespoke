import { createContext } from "react";
import { products } from "../assets/assets";
import React from "react";   
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = React.useState('');
    const [showSearch, setShowSearch] = React.useState(false);
    const [cartItems, setCartItems] = React.useState({});    

    const addToCart = async (itemId, size) => {
        if(!size){
            toast.error('Please select a size');
            return;
        }

        // Use JSON.parse(JSON.stringify()) for better browser compatibility
        let newCartItems = JSON.parse(JSON.stringify(cartItems));
        
        if(newCartItems[itemId]){
            if(newCartItems[itemId][size]){
                // If this size already exists, increment the quantity
                newCartItems[itemId][size] += 1;
            } else {
                // If this size doesn't exist, add it with quantity 1
                newCartItems[itemId][size] = 1;   
            }
        } else {
            // If this item doesn't exist, create it with the selected size
            newCartItems[itemId] = {};
            newCartItems[itemId][size] = 1;
        }
        setCartItems(newCartItems);
    }

    const getCartCount = () => {
        let count = 0;
        for(const itemId in cartItems){
            for(const size in cartItems[itemId]){
                try{
                    if(cartItems[itemId][size] > 0){
                        count += cartItems[itemId][size];
                    }
                } catch(error){
                    console.error("Error calculating cart count:", error);
                }
            }
        }
        return count;
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
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;