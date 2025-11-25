import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { token, backendURL } = useContext(ShopContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const fetchProfile = async () => {
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
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        backendURL + "/api/user/profile",
        {
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-3">
        <h1 className="font-medium">My Profile</h1>
      </div>

      <div className="flex flex-col gap-4 max-w-[500px]">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-medium">{userData?.name}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{userData?.email}</p>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Phone</p>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2"
              />
            ) : (
              <p className="text-lg">{userData?.phone || "Not set"}</p>
            )}
          </div>

          <div className="border-t pt-4 mt-2">
            <h2 className="text-lg font-medium mb-3">Address</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Street</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                ) : (
                  <p>{userData?.address?.street || "Not set"}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">City</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  ) : (
                    <p>{userData?.address?.city || "Not set"}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">State</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  ) : (
                    <p>{userData?.address?.state || "Not set"}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">Zip Code</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  ) : (
                    <p>{userData?.address?.zipCode || "Not set"}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-500">Country</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2"
                    />
                  ) : (
                    <p>{userData?.address?.country || "Not set"}</p>
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
                  className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
