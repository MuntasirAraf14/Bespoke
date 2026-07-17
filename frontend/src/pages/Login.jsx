import React, { useEffect } from "react";
import { ShopContext } from "../context/shopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentState, setCurrentState] = React.useState(location.state?.form || "Login");
  const { token, setToken, backendURL, tokenStorageKey } = React.useContext(ShopContext);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendURL + "/api/user/register", {
          name: name,
          email: email,
          password: password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem(tokenStorageKey, response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendURL + "/api/user/login", {
          email: email,
          password: password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem(tokenStorageKey, response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
    // You can add your subscription logic here (e.g., API call)
  };

  const googleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(backendURL + "/api/user/google", {
        token: credentialResponse.credential,
      });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem(tokenStorageKey, response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Google Login Failed");
    }
  };

  const googleError = () => {
    toast.error("Google Login Failed");
  };

  useEffect(() => {
    if (token) {
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    }
  }, [token, location.state, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl sm:py-3 lg:text-5xl">
          {currentState}
        </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-900" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name"
          className="w-full px-4 py-3 border border-gray-800 "
          required
        ></input>
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
        className="w-full px-4 py-3 border border-gray-800 "
        required
      ></input>
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="password"
        className="w-full px-4 py-3 border border-gray-800 "
        required
      ></input>
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Password?</p>
        {currentState === "Login" ? (
          <p
            className="cursor-pointer"
            onClick={() => setCurrentState("Sign Up")}
          >
            Create account
          </p>
        ) : (
          <p
            className="cursor-pointer"
            onClick={() => setCurrentState("Login")}
          >
            Login Here
          </p>
        )}
      </div>
      <button className="bg-black rounded-md text-white font-light px-8 py-2 mt-4">
        {currentState === "Login" ? "Sign in" : "Sign Up"}
      </button>
      <div className="mt-4">
        <GoogleLogin onSuccess={googleSuccess} onError={googleError} />
      </div>
    </form>
  );
};

export default Login;
