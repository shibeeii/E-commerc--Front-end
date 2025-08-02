import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const WishlistPage = () => {

  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchWishlist = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/wishlist/${user._id}`);
      const items = res.data.items || [];
      setWishlist(items);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

const handleRemove = async (productId) => {
  try {
    await axios.delete(`${import.meta.env.VITE_SERVER_URL}/wishlist/remove`, {
      data: {
        userId: user._id,
        productId,
      },
    });
    fetchWishlist();
  } catch (err) {
    console.error("Failed to remove from wishlist:", err);
  }
};


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">My Wishlist</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading wishlist...</p>
      ) : wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        wishlist.map((item) => (
          <div
            key={item.productId._id}
            className="border rounded-lg p-4 mb-6 shadow-sm"
          >
            <div className="flex gap-4">
              <img
                src={item.productId.image}
                alt={item.productId.productname}
                className="w-32 h-32 object-contain"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {item.productId.productname}
                </h2>
                <p className="text-sm text-gray-600">{item.productId.description}</p>
                <div className="mt-2 text-base">
                  <span className="text-green-600 font-semibold mr-2">
                    ₹{item.productId.price.toFixed(2)}
                  </span>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <button
                    className="text-red-600 text-sm"
                    onClick={() => handleRemove(item.productId._id)}
                  >
                    Remove from Wishlist
                  </button>
                  <Link to={`/product/${item.productId._id}`}>
                    <button className="text-blue-600 text-sm font-medium">View Product</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WishlistPage;
