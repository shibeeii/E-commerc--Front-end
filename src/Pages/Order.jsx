import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Order = () => {

  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  const handleQuantity = (type) => {
    setQuantity((prev) => (type === "inc" ? prev + 1 : Math.max(prev - 1, 1)));
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("userToken");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      toast.warning("Please login or register to add to cart");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/cart/add`, {
        userId: user._id,
        productId,
        quantity,
      });
      toast.success("Product added to cart");
      setTimeout(() => navigate("/cart"), 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };
const handleAddToWishlist = async (productId) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("userToken");

  if (!user || !token) {
    toast.warning("Please login or register to add to wishlist");
    setTimeout(() => navigate("/login"), 1500);
    return;
  }

  try {
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/wishlist/add`, {
      userId: user._id,
      productId,
    });
    toast.success("Added to wishlist");
  } catch (err) {
    toast.error("Failed to add to wishlist");
    console.error("Wishlist error:", err);
  }
};


  if (!product)
    return <div className="text-center py-20 text-xl">Loading...</div>;

  const originalPrice = product.price;
  const offer = product.offer || 0;
  const discountedPrice = originalPrice - (originalPrice * offer) / 100;
  const savings = originalPrice - discountedPrice;

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 max-w-6xl mx-auto mt-10 px-4 pb-20">
      {/* Product Image */}
      <div className="w-full lg:w-1/2">
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={product.image}
            alt={product.productname}
            className="w-full h-[300px] sm:h-[400px] object-contain bg-white"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center">
        <p className="text-primary font-bold tracking-wide uppercase text-xs sm:text-sm mb-1">
          {product.productname.split(" ")[0]}
        </p>
        <h2 className="text-xl sm:text-3xl font-bold mb-3 text-gray-800 dark:text-white">
          {product.productname}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-4 max-w-md dark:text-gray-300">
          {product.description}
        </p>

        <div className="flex items-center gap-4 mb-2">
          <span className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            ₹{discountedPrice.toFixed(2)}
          </span>
          {offer > 0 && (
            <span className="bg-orange-100 text-primary px-2 py-0.5 rounded text-xs font-bold">
              {offer}% OFF
            </span>
          )}
        </div>
        {offer > 0 && (
          <>
            <p className="line-through text-gray-400 text-sm">
              ₹{originalPrice.toFixed(2)}
            </p>
            <p className="text-green-600 text-sm mb-4 font-medium">
              You save ₹{savings.toFixed(2)}
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
          {/* Quantity Selector */}
          <div className="flex items-center border rounded-md overflow-hidden w-28">
            <button
              className="flex-1 bg-gray-200 text-black px-2 py-1"
              onClick={() => handleQuantity("dec")}
            >
              -
            </button>
            <span className="flex-1 text-center">{quantity}</span>
            <button
              className="flex-1 bg-gray-200 text-black px-2 py-1"
              onClick={() => handleQuantity("inc")}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(product._id)}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 transition duration-300 text-white font-semibold px-5 py-2 rounded-md shadow w-full sm:w-auto"
          >
            <FaShoppingCart /> Add to cart
          </button>

          <button
            onClick={() => handleAddToWishlist(product._id)}
            className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 transition text-white font-semibold px-5 py-2 rounded-md shadow w-full sm:w-auto"
          >
            <FaHeart />
            Wishlist
          </button>
        </div>
      </div>

      <ToastContainer theme="colored" position="top-center" autoClose={2000} />
    </div>
  );
};

export default Order;
