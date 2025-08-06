import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/products/top`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching top products", err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="container mt-10 mb-12">
      <div className="text-left mb-10">
        <p className="text-sm text-primary">Top Rated Products for you</p>
        <h1 className="text-3xl font-bold">Best Products</h1>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No top products found.</p>
      ) : (
        <Slider {...settings}>
          {products.map((data, index) => (
            <div key={data._id} className="p-4">
              <div
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px] mx-auto p-4"
              >
                {/* Wishlist Button */}
                <button
                  className="absolute top-3 left-3 bg-white text-black p-2 rounded-full shadow 
                     group-hover:bg-primary group-hover:text-white transition-all duration-300"
                >
                  <FaHeart />
                </button>

                {/* Add to Cart Button */}
                <button
                  className="absolute top-3 right-3 bg-white text-black p-2 rounded-full shadow 
                     group-hover:bg-primary group-hover:text-white transition-all duration-300"
                >
                  <FaCartShopping />
                </button>

                {/* Image */}
                <Link to={`/product/${data._id}`}>
                  <div className="h-[150px] flex justify-center items-center">
                    <img
                      src={data.image}
                      alt={data.productname}
                      className="max-w-[140px] transform group-hover:scale-105 duration-300 drop-shadow-md"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="mt-4 text-center">
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(4)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-500" />
                    ))}
                  </div>
                  <h1 className="text-lg font-bold mb-1">{data.productname}</h1>
                  <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2 mb-2">
                    {data.description}
                  </p>
                  <p className="text-primary font-semibold group-hover:text-white mb-3">
                    ₹{data.price}
                  </p>

                  <Link to={`/product/${data._id}`}>
                    <button className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full group-hover:bg-white group-hover:text-primary">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default TopProducts;
