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
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("✅ Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order", err);
      toast.error("❌ Failed to delete order.");
    }
  };

  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18).text("Invoice", 14, 20);
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
    <div className="container mx-auto px-4 py-6">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-500 mb-5">View and manage your order history</p>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="w-full border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium text-sm">
                  <span className="text-gray-600">Order #</span> {order._id}
                </p>
                <p className="text-gray-500 text-xs">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Unknown"}
                </p>
              </div>

              {/* Status */}
            {/* Status & Payment Mode */}
<div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
  <span
    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      order.status === "Delivered"
        ? "bg-green-100 text-green-600"
        : order.status === "Cancelled"
        ? "bg-red-100 text-red-600"
        : "bg-yellow-100 text-yellow-600"
    }`}
  >
    {order.status || "Pending"}
  </span>
  <span className="text-xs text-gray-500">
    Payment Mode: <span className="font-medium text-gray-700">{order.paymentMode || "N/A"}</span>
  </span>
</div>

              

              {/* Products */}
              <div className="border-t border-b py-3 mb-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 mb-3 last:mb-0"
                  >
                    <img
                      src={item.productId?.image || ""}
                      alt={item.productId?.productname || "Product"}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h2 className="font-medium text-gray-800 text-sm">
                        {item.productId?.productname || "Unnamed product"}
                      </h2>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity ?? 0}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      ₹{item.price ?? "0.00"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div className="mb-3">
                <h3 className="font-medium text-gray-800 mb-1 text-sm">
                  Shipping Info
                </h3>
                <p className="text-gray-600 text-sm">
                  {order.shippingAddress?.fullName || "N/A"}
                </p>
                <p className="text-gray-600 text-sm">
                  {order.shippingAddress?.addressLine || ""},{" "}
                  {order.shippingAddress?.city || ""},{" "}
                  {order.shippingAddress?.state || ""}
                </p>
                <p className="text-gray-600 text-sm">
                  Phone: {order.shippingAddress?.phone || "N/A"}
                </p>
              </div>

              {/* Total */}
              <div className="flex justify-between font-semibold text-gray-900 border-t pt-2 text-sm">
                <span>Total</span>
                <span>₹{order.amount ?? "0.00"}</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="flex-1 px-3 py-1.5 rounded bg-red-700 text-white hover:bg-red-800 text-xs"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleDownloadInvoice(order)}
                  className="flex-1 px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
                >
                  Invoice
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
