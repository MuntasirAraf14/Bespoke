import React from 'react'
import { assets } from '../src/assets/assets'
import axios from 'axios';

import { backendURL } from '../src/App.jsx';
import {toast} from 'react-toastify';




const Add = ({ token }) => {
  const [image1, setImage1] = React.useState(null);
  const [image2, setImage2] = React.useState(null);
  const [image3, setImage3] = React.useState(null);
  const [image4, setImage4] = React.useState(null);

  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [subCategory, setSubCategory] = React.useState('');
  const [sizes, setSizes] = React.useState([]);
  const [bestSeller, setBestSeller] = React.useState(false);

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);

      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('bestSeller', bestSeller ? 'true' : 'false');

      const response = await axios.post(
        backendURL + '/api/product/add',
        formData,
        {
          headers: { token: token },
        }
      );
      if(response.data.success){
        toast.success(response.data.message);
        setName('');
        setPrice('');
        setDescription('');
        setCategory('');
        setSubCategory('');
        setSizes([]);
        setBestSeller(false);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error adding product:", error);
      toast.error('Error adding product');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">

      {/* Upload Images */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-3">
          {[{ set: setImage1, img: image1, id: "image1" },
            { set: setImage2, img: image2, id: "image2" },
            { set: setImage3, img: image3, id: "image3" },
            { set: setImage4, img: image4, id: "image4" }]
            .map(({ set, img, id }) => (
              <label key={id} htmlFor={id}>
                <img
                  className="w-20"
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt=""
                />
                <input
                  onChange={(e) => set(e.target.files[0])}
                  type="file"
                  id={id}
                  className="hidden"
                />
              </label>
            ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full mt-5">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border"
          type="text"
          placeholder="Product Name"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full mt-5">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border"
          rows="4"
          placeholder="Product Description"
          required
        ></textarea>
      </div>

      {/* Category */}
      <div>
        <p className="mt-5 mb-2">Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border"
        >
          <option value="">Select Category</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <p className="mt-5 mb-2">Sub Category</p>
        <select
          onChange={(e) => setSubCategory(e.target.value)}
          className="w-full px-3 py-2 border"
        >
          <option value="">Select Sub Category</option>
          <option value="Topwear">Topwear</option>
          <option value="Bottomwear">Bottomwear</option>
          <option value="Winterwear">Winterwear</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <p className="mt-5 mb-2">Product Price</p>
        <input
          onChange={(e) => setPrice(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border"
          type="number"
          placeholder="Product Price in USD"
          required
        />
      </div>

      {/* Sizes */}
      <div>
        <p className="mt-5 mb-2">Product Size</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 cursor-pointer bg-slate-200 rounded ${
                sizes.includes(size) ? "ring-2 ring-black" : ""
              }`}
            >
              <input type="checkbox" checked={sizes.includes(size)} readOnly />
              <span className="ml-2">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best Seller */}
      <div className="mt-5 flex gap-2">
        <input
          onChange={() => setBestSeller((prev) => !prev)}
          checked={bestSeller}
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller" className="cursor-pointer">
          Mark as Best Seller
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-gray-800 text-white px-5 py-2 rounded-full mt-5"
      >
        Add Product
      </button>
    </form>
  );
};

export default Add;