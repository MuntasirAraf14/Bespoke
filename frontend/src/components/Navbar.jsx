import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/shopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems, tokenStorageKey } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login", { state: { form: "Login" } });
    localStorage.removeItem(tokenStorageKey);
    setToken("");
    setCartItems({});
  };

  const location = useLocation();
  const isCollectionPage = location.pathname.includes("/collection");

  const getNavLinkClass = ({ isActive }) =>
    `p-2 px-4 rounded-full transition-all duration-200 uppercase text-sm font-medium 
     ${
       isActive
         ? "border border-black bg-gray-100 text-black"
         : "border border-transparent text-gray-700 hover:border-gray-300 hover:text-black"
     }`;

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to="/">
        <img src={assets.icon_logo} alt="Logo" className="w-36" />
      </Link>

      <ul className="hidden sm:flex gap-4 text-sm">
        <NavLink to="/" className={getNavLinkClass}>
          <p>HOME</p>
        </NavLink>
        <NavLink to="/collection" className={getNavLinkClass}>
          <p>COLLECTION</p>
        </NavLink>
        <NavLink to="/about" className={getNavLinkClass}>
          <p>ABOUT</p>
        </NavLink>
        <NavLink to="/contact" className={getNavLinkClass}>
          <p>CONTACT</p>
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        {isCollectionPage && (
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            alt="Search"
            className="w-5 cursor-pointer hover:opacity-75 transition-opacity"
          />
        )}

        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            alt="User"
            className="w-5 cursor-pointer hover:opacity-75 transition-opacity"
          />

          {/* Dropdown Menu */}
          {token && (
            <div className="absolute top-10 right-0 w-32 bg-white shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <p
                onClick={() => navigate("/profile")}
                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-t-md cursor-pointer"
              >
                My Profile
              </p>
              <p
                onClick={() => navigate("/order")}
                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
              >
                Orders
              </p>
              <p
                onClick={logout}
                className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-b-md cursor-pointer"
              >
                Logout
              </p>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            alt="Cart"
            className="w-5 min-w-5 hover:opacity-75 transition-opacity"
          />
          <div className="absolute right-[-7px] top-[-7px] text-white text-center text-[10px] w-4 h-4 bg-black rounded-full flex items-center justify-center">
            {getCartCount()}
          </div>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          alt="Menu"
          className="w-6 cursor-pointer sm:hidden hover:opacity-75 transition-opacity"
        />
      </div>

      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white z-[90] transition-all duration-300 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-5 cursor-pointer border-b"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p className="font-semibold">Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-3 pl-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
