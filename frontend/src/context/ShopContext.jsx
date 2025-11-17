import { createContext } from "react";
import { products } from "../assets/assets";
import React from "react";   


export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = React.useState('');
    const [showSearch, setShowSearch] = React.useState(false);
    
    const value = {
        products: products,
        currency: currency,
        delivery_fee: delivery_fee,
        search: search,
        setSearch: setSearch,
        showSearch: showSearch,
        setShowSearch: setShowSearch
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
