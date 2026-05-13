import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/shopContext";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title"; // Assuming Title component exists

const Profile = () => {
  const { token, backendURL, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'orders'
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const fetchProfile = useCallback(async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get(backendURL + "/api/user/profile", {
        headers: { token },
      });
      if (response.data.success) {
        setUserData(response.data.user);
        setFormData({
          phone: response.data.user.phone || "",
          street: response.data.user.address?.street || "",
          city: response.data.user.address?.city || "",
          state: response.data.user.address?.state || "",
          zipCode: response.data.user.address?.zipCode || "",
          country: response.data.user.address?.country || "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [backendURL, navigate, token]);

  const fetchOrders = useCallback(async () => {
    try {
      if (!token) return;
      const response = await axios.post(
        backendURL + "/api/order/userorders",
        {},
        { headers: { token } },
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendURL, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append(
        "address",
        JSON.stringify({
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        }),
      );

      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await axios.put(
        backendURL + "/api/user/profile",
        formDataToSend,
        { headers: { token } },
      );

      if (response.data.success) {
        setUserData(response.data.user);
        setIsEditing(false);
        setImage(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, [fetchOrders, fetchProfile]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="border-t pt-10 min-h-[80vh]">
      <div className="text-2xl mb-8">
        <Title text1="MY" text2="PROFILE" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Tabs */}
        <div className="flex flex-col gap-2 md:w-1/4">
          {/* Profile Image Display in Sidebar */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 mb-3 bg-gray-100 flex items-center justify-center">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : userData?.image ? (
                <img
                  src={userData.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-400">👤</span>
              )}
            </div>
            {isEditing && (
              <label
                htmlFor="profile-image"
                className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
              >
                Change Photo
                <input
                  type="file"
                  id="profile-image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            )}
          </div>

          <button
            onClick={() => setActiveTab("profile")}
            className={`text-left px-4 py-3 border rounded transition-colors ${activeTab === "profile" ? "bg-black text-white" : "hover:bg-gray-100"}`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`text-left px-4 py-3 border rounded transition-colors ${activeTab === "orders" ? "bg-black text-white" : "hover:bg-gray-100"}`}
          >
            Order History
          </button>
        </div>

        {/* Content Area */}
        <div className="md:w-3/4">
          {/* --- PROFILE TAB --- */}
          {activeTab === "profile" && (
            <div className="bg-gray-50 p-6 rounded shadow-sm border">
              <h3 className="text-xl font-semibold mb-6">
                Account Information
              </h3>
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-lg font-medium">{userData?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Email Address
                    </label>
                    <p className="text-lg font-medium">{userData?.email}</p>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm text-gray-500">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                      />
                    ) : (
                      <p className="text-lg font-medium">
                        {userData?.phone || "Not set"}
                      </p>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-md font-semibold mb-4 text-gray-700">
                      Shipping Address
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Street</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                          />
                        ) : (
                          <p className="text-lg">
                            {userData?.address?.street || "Not set"}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">City</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            />
                          ) : (
                            <p className="text-lg">
                              {userData?.address?.city || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">State</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            />
                          ) : (
                            <p className="text-lg">
                              {userData?.address?.state || "Not set"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">
                            Zip Code
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            />
                          ) : (
                            <p className="text-lg">
                              {userData?.address?.zipCode || "Not set"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">
                            Country
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                            />
                          ) : (
                            <p className="text-lg">
                              {userData?.address?.country || "Not set"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    {isEditing ? (
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className={`bg-black text-white px-6 py-2 rounded transition-colors ${isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"}`}
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => setIsEditing(false)}
                          className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        Edit Details
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* --- ORDERS TAB --- */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold mb-4">Order History</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
              ) : (
                orders.map((order, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4 border-b pb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          Order ID:{" "}
                          <span className="text-gray-500 font-normal">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Status:{" "}
                          <span
                            className={`text-${order.status === "Delivered" ? "green" : "orange"}-600`}
                          >
                            {order.status}
                          </span>
                        </p>
                        <p className="text-sm">Method: {order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={item.image[0]}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <span>
                              {item.name} x {item.quantity}{" "}
                              <span className="text-gray-500">
                                ({item.size})
                              </span>
                            </span>
                          </div>
                          <span className="font-medium">
                            {currency}
                            {item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-4 pt-3 flex justify-between items-center">
                      {order.note && (
                        <div className="text-sm text-gray-500 italic max-w-xs">
                          "Note: {order.note}"
                        </div>
                      )}
                      <p className="text-lg font-bold ml-auto">
                        Total: {currency}
                        {order.amount}
                      </p>
                    </div>
                    <div className="mt-2 text-right">
                      <button
                        onClick={() => fetchOrders()}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Track Order
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
