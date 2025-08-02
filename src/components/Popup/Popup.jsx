import React from "react";
import { CgProfile } from "react-icons/cg";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const Popup = ({ loginPopup, setloginPopup }) => {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    console.error("Invalid user JSON:", err);
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    setloginPopup(false);
    navigate("/");
  };

  if (!loginPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[350px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#802BB1] to-[#2B283E] h-28 flex justify-end p-3">
          <IoCloseOutline
            className="text-white text-2xl cursor-pointer"
            onClick={() => setloginPopup(false)}
          />
        </div>

        {/* Profile Image */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
            <div className="bg-gradient-to-r from-[#802BB1] to-[#2B283E] rounded-full w-full h-full flex items-center justify-center">
              <CgProfile className="text-5xl text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-20 text-center px-6 pb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user ? `Hi ${user.name || "User"}` : "Hi User"}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {user
              ? "You're logged in. Use the button below to log out."
              : "Welcome to our platform! Please register or log in to continue."}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            {user ? (
              <div className="flex flex-col items-center gap-3">
                <Link to="/my-orders" onClick={() => setloginPopup(false)}>
                  <button className="w-[200px] px-5 py-2 rounded-full border border-[#802BB1] text-[#802BB1] hover:bg-[#f3eaff] transition font-medium">
                    My Orders
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-[200px] px-5 py-2 rounded-full bg-gradient-to-r from-[#802BB1] to-[#2B283E] text-white font-medium hover:scale-105 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/register" onClick={() => setloginPopup(false)}>
                  <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#802BB1] to-[#2B283E] text-white font-medium hover:scale-105 transition">
                    Register
                  </button>
                </Link>
                <Link to="/login" onClick={() => setloginPopup(false)}>
                  <button className="px-5 py-2 rounded-full border border-[#802BB1] text-[#802BB1] hover:bg-[#f3eaff] transition font-medium">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
