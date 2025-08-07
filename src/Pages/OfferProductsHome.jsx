import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { Link } from "react-router-dom";

const OfferProductsHome = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOfferProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/products`
        );
        const offerProducts = res.data.products.filter(
          (p) => p.offer && p.offer > 0
        );
        setProducts(offerProducts.slice(0, 10)); // Show 10 max
      } catch (err) {
        console.error("Error fetching offer products:", err);
      }
    };
    fetchOfferProducts();
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="container mt-10 mb-12 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-sm text-primary">Exclusive Deals</p>
        <h1 className="text-3xl font-bold">Offer Products</h1>
        <p className="text-gray-500 mt-1">
          Grab your favorites before the sale ends!
        </p>
      </div>

      {/* Slick Carousel */}
      {products.length === 0 ? (
        <p className="text-center text-gray-600">
          No offer products available.
        </p>
      ) : (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product._id} className="px-3">
              <div className="bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white shadow-xl duration-300 rounded-2xl group flex flex-col justify-between items-center p-4 text-center h-[320px] mb-10">
                <Link to={`/product/${product._id}`} className="w-full">
                  {/* Image */}
                  <div className="h-[150px] flex justify-center items-center mb-4">
                    <img
                      src={product.image}
                      alt={product.productname}
                      className="h-full object-contain group-hover:scale-105 duration-300"
                    />
                  </div>

                  {/* Info */}
                  <h3 className="font-semibold text-lg">
                    {product.productname}
                  </h3>
                  <p className="text-sm text-gray-500 group-hover:text-white duration-300 mb-1 line-clamp-2">
                    {product.description.slice(0, 40)}...
                  </p>
                  <p className="text-primary font-semibold group-hover:text-white duration-300">
                    ₹{product.price}{" "}
                    <span className="text-red-500 text-sm ml-1">
                      {product.offer}% OFF
                    </span>
                  </p>
<div className="mt-4 flex justify-center">
  <div className="inline-flex items-center gap-1 text-primary group-hover:text-white font-semibold transition-all duration-300">
    GET NOW
    <svg
      className="w-5 h-5 mt-[1px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  </div>
</div>

                </Link>
              </div>
            </div>
          ))}
        </Slider>
      )}

      {/* View All Button */}
      <div className="text-center mt-8">
        <Link to="/offer-products">
          <button className="bg-primary text-white py-2 px-6 rounded-full hover:bg-primary/80 duration-300">
            View All Offers
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OfferProductsHome;
