import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-medium text-gray-800 mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mt-2 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
      >
        BACK TO HOME
      </Link>
    </div>
  );
};

export default NotFound;
