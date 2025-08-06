import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OfferProductsHome = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOfferProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/products`);
        const offerProducts = res.data.products.filter(
          (p) => p.offer && p.offer > 0
        );
        // Only show first 4 on home page
        setProducts(offerProducts.slice(0, 4));
      } catch (err) {
        console.error("Error fetching offer products:", err);
      }
    };
    fetchOfferProducts();
  }, []);

  return (
    <div className="container mt-10 mb-12">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-sm text-primary">Exclusive Deals</p>
        <h1 className="text-3xl font-bold">Offer Products</h1>
        <p className="text-gray-500 mt-1">Grab your favorites before the sale ends!</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
        {products.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">
            No offer products available.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="w-[240px] h-[360px] rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white shadow-xl duration-300 group flex flex-col justify-between items-center p-4 text-center"
            >
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
                <h3 className="font-semibold text-lg">{product.productname}</h3>
                <p className="text-sm text-gray-500 group-hover:text-white duration-300 mb-1 line-clamp-2">
                  {product.description.slice(0, 40)}...
                </p>
                <p className="text-primary font-semibold group-hover:text-white duration-300">
                  ₹{product.price}{" "}
                  <span className="text-red-500 text-sm ml-1">
                    {product.offer}% OFF
                  </span>
                </p>
              </Link>
            </div>
          ))
        )}
      </div>

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
