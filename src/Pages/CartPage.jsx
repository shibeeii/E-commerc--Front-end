import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const fetchCart = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/cart/${user._id}`);
      const items = res.data.cart?.items || res.data.items || [];
      setCart(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/cart/update`, {
        userId: user._id,
        productId,
        quantity: newQty,
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/cart/remove`, {
        data: { userId: user._id, productId },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/cart/clear/${user._id}`);
      fetchCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  // Calculate totals with discount
  const discountedTotal = cart.reduce((acc, item) => {
    const originalPrice = item.price;
    const offer = item.productId.offer || 0;
    const discountedPrice = originalPrice - (originalPrice * offer) / 100;
    return acc + discountedPrice * item.quantity;
  }, 0);

  const totalSavings = cart.reduce((acc, item) => {
    const offer = item.productId.offer || 0;
    return acc + ((item.price * item.quantity) * offer) / 100;
  }, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center">My Cart</h1>
        {cart.length > 0 && (
          <button onClick={handleClearCart} className="text-primary font-medium">
            Clear Cart
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">cart is empty</p>
      ) : cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        cart.map((item) => {
          const originalPrice = item.price;
          const offer = item.productId.offer || 0;
          const discountedPrice = originalPrice - (originalPrice * offer) / 100;

          return (
            <div key={item.productId._id} className="border rounded-lg p-4 mb-6 shadow-sm">
              <p className="text-green-600 text-xs font-semibold mb-2">
                Get It For Lowest Price
              </p>
              <div className="flex gap-4">
                <img
                  src={item.productId.image}
                  alt={item.productId.productname}
                  className="w-32 h-32 object-contain"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.productId.productname}</h2>
                  <p className="text-sm text-gray-600">{item.productId.description}</p>
                  <div className="mt-2 text-base">
                    <span className="text-green-600 font-semibold mr-2">
                      ₹{(discountedPrice * item.quantity).toFixed(2)}
                    </span>
                    {offer > 0 && (
                      <span className="line-through text-gray-500 mr-2">
                        ₹{(originalPrice * item.quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-1">🚚 <strong>Superfast delivery</strong></p>

                  <div className="mt-3 flex justify-between items-center">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId._id, parseInt(e.target.value))
                      }
                      className="border rounded px-2 py-1 text-sm w-28"
                    >
                      {[...Array(10).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
                      ))}
                    </select>
                    <button
                      className="text-red-600"
                      onClick={() => handleRemove(item.productId._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {cart.length > 0 && (
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
          <div>
            {totalSavings > 0 && (
              <p className="text-green-600 text-sm">
                You save ₹{totalSavings.toFixed(2)}
              </p>
            )}
            <p className="text-2xl font-bold text-black">
              ₹{discountedTotal.toFixed(2)}
            </p>
          </div>
          <Link to={"/checkout"}>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg">
              Place Order
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
