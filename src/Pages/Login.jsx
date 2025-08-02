import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/login`, formData);
      const { token, user } = res.data;

      // ✅ Save user and token
      localStorage.setItem("userToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">

        {/* Left Side */}
<div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#802BB1] to-[#2B283E] text-white flex-col items-center justify-center p-10">
          <div className="bg-white text-[#802BB1] p-5 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Q-Mart</h2>
          <p className="text-center max-w-sm">
            Welcome , To the the Largest E-commerce Platform
          </p>
        </div>

        {/* Right Side - Form */}
<div className="w-full md:w-1/2 p-6 md:p-10">          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Login Account</h2>

            <label className="block mb-2 text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border rounded"
            />

            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="w-full p-3 mb-4 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-[#802BB1] text-white py-3 rounded hover:bg-[#6e25a0] transition"
            >
              Login
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t" />
              <span className="px-2 text-gray-400 text-sm">or continue with</span>
              <div className="flex-grow border-t" />
            </div>

            <div className="flex justify-center gap-4">
              <button className="flex-1 border py-2 rounded flex items-center justify-center gap-2">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" /> Google
              </button>
            </div>

            <p className="text-sm text-center mt-6">
              New User? <a href="/register" className="text-[#802BB1]">Register</a>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer theme="colored" position="top-center" autoClose={2000} />
    </div>
  );
};

export default Login;
