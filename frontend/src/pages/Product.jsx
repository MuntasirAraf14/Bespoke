// pages/Product.js

import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/shopContext";
import RelatedProducts from "../components/RelatedProducts";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SizeGuide from "../components/SizeGuide";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const productData = React.useMemo(
    () => products.find((item) => item._id === productId),
    [productId, products],
  );
  const [image, setImage] = React.useState("");
  const [size, setSize] = React.useState("");
  const [showSizeGuide, setShowSizeGuide] = React.useState(false);

  React.useEffect(() => {
    setImage(productData?.image?.[0] || "");
  }, [productData]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <Helmet>
        <title>{productData.name} | Bespoke</title>
        <meta name="description" content={productData.description} />
      </Helmet>
      {/* Product Details Section */}
      <div className="flex flex-col gap-12 sm:gap-12 sm:flex-row">
        {/* Image Gallery */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Thumbnail ${index + 1}`}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 border-gray-300"
                onClick={() => setImage(item)}
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img
              src={image}
              alt={productData.name}
              className="w-full sm:w-[100%] border-2 border-gray-300"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-gray-400 italic">No reviews yet</span>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-900 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <div className="flex justify-between items-center">
              <p>Select Size</p>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-sm text-gray-500 hover:text-black underline"
              >
                Size Guide
              </button>
            </div>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300 ${
                    size === item ? "bg-gray-300" : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)}>
            <div className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 w-max">
              Add to Cart
            </div>
          </button>
          <hr className="mt-8 sm:w-4/5"></hr>
          <div className="text-sm font-bold text-gray-700 mt-5 flex flex-col gap-1">
            <p>100% Original Product</p>
            <p>Cash on Delivery Available on this product.</p>
            <p>Easy 7 days returns and exchanges.</p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews</p>
        </div>
        <div className="flex flex-col gap-4 border border-gray-300 px-6 py-6 text-sm text-gray-800">
          <p>{productData.description}</p>
        </div>
      </div>
      {/* Related Products Section */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
      <SizeGuide
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </div>
  ) : (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex flex-col gap-12 sm:gap-12 sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {[...Array(4)].map((_, i) => (
              <LoadingSkeleton
                key={i}
                className="w-[24%] sm:w-full h-24 sm:mb-3 flex-shrink-0"
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <LoadingSkeleton className="w-full h-[500px]" />
          </div>
        </div>
        <div className="flex-1">
          <LoadingSkeleton className="w-3/4 h-8 mt-2" />
          <LoadingSkeleton className="w-1/4 h-4 mt-2" />
          <LoadingSkeleton className="w-1/4 h-8 mt-5" />
          <LoadingSkeleton className="w-full h-32 mt-5" />
        </div>
      </div>
    </div>
  );
};

export default Product;
