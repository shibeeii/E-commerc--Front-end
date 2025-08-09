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

    // Title
    doc.setFontSize(22);
    doc.setTextColor("#003366");
    doc.text("Q-Mart", 14, 20);

    doc.setLineWidth(0.5);
    doc.setDrawColor("#003366");
    doc.line(14, 24, 196, 24);

    // Order info
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Order ID: ${order._id}`, 14, 34);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      14,
      42
    );

    // Shipping info header
    doc.setFontSize(14);
    doc.setTextColor("#003366");
    doc.text("Shipping Information", 14, 58);
    doc.setLineWidth(0.3);
    doc.line(14, 60, 196, 60);

    // Shipping details
    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Name: ${order.shippingAddress?.fullName || "N/A"}`, 14, 68);
    doc.text(
      `Address: ${order.shippingAddress?.addressLine || ""}, ${
        order.shippingAddress?.city || ""
      }, ${order.shippingAddress?.state || ""} - ${
        order.shippingAddress?.pincode || ""
      }`,
      14,
      76,
      { maxWidth: 180 }
    );
    doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 14, 84);

    // Products header
    doc.setFontSize(14);
    doc.setTextColor("#003366");
    doc.text("Products", 14, 102);
    doc.line(14, 104, 196, 104);

    // Table header
    doc.setFontSize(12);
    doc.setTextColor("#000");
    const startY = 112;
    doc.text("No.", 14, startY);
    doc.text("Product Name", 24, startY);
    doc.text("Quantity", 140, startY);
    doc.text("Price (inr)", 170, startY);

    // Draw a line below header
    doc.line(14, startY + 2, 196, startY + 2);

    // Products list
    let y = startY + 12;
    order.items.forEach((item, idx) => {
      doc.text(`${idx + 1}`, 14, y);
      doc.text(item.productId?.productname || "Product", 24, y, {
        maxWidth: 110,
      });
      doc.text(`${item.quantity}`, 140, y);
      doc.text(`${item.price.toFixed(2)}`, 170, y);
      y += 10;
    });

    // Total amount line
    doc.setDrawColor("#003366");
    doc.line(14, y + 4, 196, y + 4);
    doc.setFontSize(14);
    doc.setTextColor("#003366");
    doc.text(`Total Amount: ${order.amount?.toFixed(2) || "0.00"}`, 14, y + 14);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor("#555");
    doc.text("Thank you for shopping with Q-Mart! Visit us again.", 14, y + 30);

    // Save file
    doc.save(`invoice_${order._id}.pdf`);

    toast.info("📄 Invoice downloaded!");
  };

  const handleReturnOrder = async (orderId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this order?"
    );
    if (!confirmReturn) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/orders/return/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      toast.success("✅ Order returned successfully!");
      // Update order status locally
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "Returned" } : o))
      );
    } catch (err) {
      console.error("Error returning order:", err);
      toast.error("❌ Failed to return order.");
    }
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
                  Payment Mode:{" "}
                  <span className="font-medium text-gray-700">
                    {order.paymentMode || "N/A"}
                  </span>
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

              <div className="flex gap-2 mt-4 justify-end">
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  disabled={order.status === "Delivered"}
                  className={`px-2 py-1 rounded text-white text-md ${
                    order.status === "Delivered"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-800"
                  }`}
                >
                  Delete
                </button>

                <button
                  onClick={() => handleDownloadInvoice(order)}
                  className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-md"
                >
                  Invoice
                </button>

                {order.status === "Delivered" && (
                  <button
                    onClick={() => handleReturnOrder(order._id)}
                    className="px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-700 text-white text-md"
                  >
                    Return Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
