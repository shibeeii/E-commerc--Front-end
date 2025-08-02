import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {

  const [orders, setOrders] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/orders/user/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching user orders", err);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded shadow p-4 mb-6 bg-white">
            <div className="flex justify-between items-center mb-2">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <p className="mb-2"><strong>Status:</strong> {order.status}</p>
            <p className="mb-4"><strong>Total:</strong> ₹{order.amount}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="border p-3 rounded flex gap-3">
                  <img
                    src={item.productId?.image}
                    alt={item.productId?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h2 className="font-semibold">{item.productId?.name}</h2>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
