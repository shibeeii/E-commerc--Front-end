import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const fetchUserOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/orders/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching user orders", err);
      toast.error("❌ Failed to load orders.");
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "❓ Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Remove from UI instantly
      setOrders((prev) => prev.filter((order) => order._id !== orderId));

      toast.success("✅ Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order", err);
      toast.error("❌ Failed to delete order.");
    }
  };

  // Download Invoice
  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      14,
      38
    );

    doc.text("Shipping Information:", 14, 50);
    doc.text(`Name: ${order.shippingAddress?.fullName || "N/A"}`, 14, 58);
    doc.text(
      `Address: ${order.shippingAddress?.addressLine || ""}, ${
        order.shippingAddress?.city || ""
      }, ${order.shippingAddress?.state || ""}`,
      14,
      66
    );
    doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 14, 74);

    // Products section
    doc.text("Products:", 14, 90);
    let y = 98;
    order.items.forEach((item, idx) => {
      doc.text(
        `${idx + 1}. ${item.productId?.productname || "Product"}`,
        14,
        y
      );
      doc.text(`Qty: ${item.quantity}`, 120, y);
      doc.text(`Price: ${item.price}`, 160, y);
      y += 8;
    });

    doc.text(`Total Amount: ${order.amount ?? "0.00"}`, 14, y + 10);

    doc.save(`invoice_${order._id}.pdf`);
    toast.info("📄 Invoice downloaded!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-500 mb-6">View and manage your order history</p>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-xl shadow-lg p-6 bg-white transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl"
            >
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-center mb-4">
                <p className="font-medium">
                  <span className="text-gray-600">Order #</span> {order._id}
                </p>
                <p className="text-gray-500 text-sm">
                  Placed on{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown date"}
                </p>
              </div>

              {/* Status */}
              <div className="flex gap-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              {/* Product List */}
              <div className="border-t border-b py-4 mb-6">
                {Array.isArray(order.items) &&
                  order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 mb-4 last:mb-0"
                    >
                      <img
                        src={item.productId?.image || ""}
                        alt={item.productId?.productname || "Product"}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h2 className="font-semibold text-gray-800">
                          {item.productId?.productname || "Unnamed product"}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity ?? 0}
                        </p>
                      </div>
                      <p className="font-medium">₹{item.price ?? "0.00"}</p>
                    </div>
                  ))}
              </div>

              {/* Shipping Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Shipping Information
                </h3>
                <p className="text-gray-600">
                  {order.shippingAddress?.fullName || "N/A"}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress?.addressLine || ""},{" "}
                  {order.shippingAddress?.city || ""},{" "}
                  {order.shippingAddress?.state || ""}
                </p>
                <p className="text-gray-600">
                  Phone: {order.shippingAddress?.phone || "N/A"}
                </p>
              </div>

              {/* Order Summary */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Order Summary
                </h3>
                <div className="text-gray-600 space-y-1">
                  <div className="flex justify-between font-semibold border-t pt-2 text-gray-900">
                    <span>Total</span>
                    <span>₹{order.amount ?? "0.00"}</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition-colors"
                >
                  Delete Order
                </button>

                <button
                  onClick={() => handleDownloadInvoice(order)}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
