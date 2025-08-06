import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { FaShoppingCart, FaCaretDown, FaHeart, FaBars, FaTimes } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Mobiles", link: "/mobiles" },
  { id: 3, name: "Laptops", link: "/laptop" },
  { id: 4, name: "Fashion", link: "/fashions" },
  { id: 5, name: "Electronics", link: "/electronics" },
];

const DropdownLinks = [
  { id: 1, name: "Offer Products", link: "/offer-products" },
  { id: 3, name: "Best Products", link: "/best-products" },
];

const Navbar = ({ handleloginPopup }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* Upper Navbar */}
      <div className="bg-primary/80 py-2">
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-bold text-lg sm:text-xl flex items-center gap-2 text-white">
            <img src={Logo} alt="Logo" className="w-8 sm:w-9" />
            Q-Mart
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link to="/wishlist">
              <button className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full flex items-center justify-center">
                <FaHeart className="text-white text-lg" />
              </button>
            </Link>

            {/* Cart */}
            <Link to="/cart">
              <button className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full flex items-center justify-center">
                <FaShoppingCart className="text-white text-lg" />
              </button>
            </Link>

            {/* Profile */}
            <button
              onClick={handleloginPopup}
              className="bg-gradient-to-r from-primary to-secondary p-2 rounded-full flex items-center justify-center"
            >
              <CgProfile className="text-white text-lg" />
            </button>

            {/* Dark mode (smaller) */}
            <div className="scale-90">
              <DarkMode />
            </div>

            {/* Hamburger Menu (Mobile Only) */}
            <button
              className="sm:hidden text-2xl text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Navbar (Desktop) */}
      <div className="sm:flex hidden justify-center">
        <ul className="flex items-center gap-4">
          {Menu.map((data) => (
            <li key={data.id}>
              <Link to={data.link} className="px-4 hover:text-primary duration-200">
                {data.name}
              </Link>
            </li>
          ))}
          {/* Dropdown */}
          <li className="group relative cursor-pointer">
            <span className="flex items-center gap-[2px] py-2">
              Trending Products
              <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
            </span>
            <div className="absolute hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <Link
                      to={data.link}
                      className="block w-full rounded-md p-2 hover:bg-primary/20"
                    >
                      {data.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 p-4">
          <ul className="flex flex-col gap-4">
            {Menu.map((data) => (
              <li key={data.id}>
                <Link
                  to={data.link}
                  className="block py-2 hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {data.name}
                </Link>
              </li>
            ))}
            {/* Dropdown Links */}
            <li>
              <p className="font-semibold">Trending Products</p>
              <ul className="ml-4 mt-2 flex flex-col gap-2">
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <Link
                      to={data.link}
                      className="block hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {data.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
