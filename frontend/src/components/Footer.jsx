import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
      <div>
        <img src={assets.icon_logo} alt="Logo" className="w-32 mb-4" />
        <p className="text-gray-600">
          Bespoke is your one-stop destination for trendy and affordable
          fashion. Discover a wide range of clothing and accessories that suit
          your style and budget. Shop now and elevate your wardrobe with
          Bespoke!
        </p>
      </div>

      <div>
        <p className="text-xl font-medium mb-5">COMPANY</p>
        <ul className="flex flex-col gap-1 text-gray-900">
          <Link to="/about" className="hover:text-black">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-black">
            Contact Us
          </Link>
          <Link to="/privacy-policy" className="hover:text-black">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-black">
            Terms & Conditions
          </Link>
          <Link to="/refund-policy" className="hover:text-black">
            Refund Policy
          </Link>
        </ul>
      </div>

      <div>
        <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
        <ul className="flex flex-col gap-1 text-gray-900">
          <li>Email: 5VX8M@example.com</li>
          <li>Phone: +1 234 567 890</li>
          <li>Address: 123 Fashion St, Style City, Country</li>
        </ul>
      </div>

      <div>
        <p className="text-xl font-medium mb-5">FOLLOW US</p>
        <div className="flex gap-4">
          <img
            src={assets.facebook_img}
            alt="Facebook"
            className="w-6 h-6 cursor-pointer"
          />
          <img
            src={assets.instagram_img}
            alt="Instagram"
            className="w-6 h-6 cursor-pointer"
          />
        </div>
      </div>

      <div className="col-span-full">
        <hr className="border-gray-300 mb-5" />
        <p className="text-gray-600 text-center">
          &copy; 2025 Bespoke. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
