import React from "react";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown, FaHeart } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";


const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "Mobiles",
    link: "/mobiles",
  },
  {
    id: 3,
    name: "Laptops",
    link: "/laptop",
  },
  {
    id: 3,
    name: "Fashion",
    link: "/fashions",
  },
  {
    id: 3,
    name: "Electronics",
    link: "/electronics",
  },
];

const DropdownLinks = [
  {
    id: 1,
    name: "Offer Products",
    link: "/#",
  },
  {
    id: 2,
    name: "Best Selling",
    link: "/#",
  },
  {
    id: 3,
    name: "Top Rated",
    link: "/#",
  },
];

const Navbar = ({ handleloginPopup }) => {
  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* upper Navbar */}
      <div className="bg-primary/80 py-2">
        <div className="container flex justify-between items-center">
          <div>
            <a
              href="#"
              className="font-bold text-2xl text-white sm:text-3xl flex gap-2"
            >
              <img src={Logo} alt="Logo" className="w-10" />
              Q-Mart
            </a>
          </div>

          <div className="flex justify-between items-center gap-4">
            {/* whishlist */}
           <Link to={'/wishlist'}>
              <button className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white  py-1 px-4 rounded-full flex items-center gap-3 group">
                <FaHeart className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </button>
           </Link>

            {/* order button */}
<Link to={'/cart'}>
              <button className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white  py-1 px-4 rounded-full flex items-center gap-3 group">
                <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </button>
</Link>
            <button onClick={()=>handleloginPopup()} className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white  py-1 px-4 rounded-full flex items-center gap-3 group">
              <CgProfile className="text-xl text-white drop-shadow-sm cursor-pointer" />
            </button>

            {/* Darkmode Switch */}
            <div>
              <DarkMode />
            </div>
          </div>
        </div>
      </div>
      {/* lower Navbar */}
      <div data-aos="zoom-in" className="flex justify-center">
        <ul className="sm:flex hidden items-center gap-4">
          {Menu.map((data) => (
            <li key={data.id}>
              <a
                href={data.link}
                className="inline-block px-4 hover:text-primary duration-200"
              >
                {data.name}
              </a>
            </li>
          ))}
          {/* Simple Dropdown and Links */}
          <li className="group relative cursor-pointer">
            <a href="#" className="flex items-center gap-[2px] py-2">
              Trending Products
              <span>
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </span>
            </a>
            <div className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="inline-block w-full rounded-md p-2 hover:bg-primary/20 "
                    >
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
