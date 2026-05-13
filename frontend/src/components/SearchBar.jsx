import React, { useEffect } from "react";
import { ShopContext } from "../context/shopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    React.useContext(ShopContext);
  const location = useLocation();

  // Automatically hide search bar when navigating away from collection page
  useEffect(() => {
    if (!location.pathname.includes("/collection")) {
      setShowSearch(false);
    }
  }, [location.pathname, setShowSearch]);

  // Component only renders if the global showSearch state is true
  if (!showSearch) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50 py-4 border-b border-gray-200 z-40 relative">
      <div className="flex items-center justify-center max-w-4xl mx-auto px-4">
        {/* Search Input Container */}
        <div className="flex items-center border border-gray-400 px-5 py-3 rounded-full w-full">
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-inherit flex-1 w-full outline-none text-base pr-3"
          />
          {/* Search Icon inside the bar */}
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Close Button: Positioned slightly away */}
        <img
          onClick={() => {
            setShowSearch(false);
            setSearch(""); // Clear search term when closing
          }}
          src={assets.cross_icon}
          alt="Close"
          className="w-4 ml-4 cursor-pointer hover:opacity-75 transition-opacity"
        />
      </div>
    </div>
  );
};

export default SearchBar;
