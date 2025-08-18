import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success("✅ Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order", err);
      toast.error("❌ Failed to delete order.");
    }
  };

  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor("#003366");
    doc.text("Q-Mart", 14, 20);
    doc.setLineWidth(0.5);
    doc.setDrawColor("#003366");
    doc.line(14, 24, 196, 24);

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Order ID: ${order._id}`, 14, 34);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      14,
      42
    );

    doc.setFontSize(14);
    doc.setTextColor("#003366");
    doc.text("Shipping Information", 14, 58);
    doc.setLineWidth(0.3);
    doc.line(14, 60, 196, 60);

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

    doc.setFontSize(14);
    doc.setTextColor("#003366");
    doc.text("Products", 14, 102);
    doc.line(14, 104, 196, 104);

    doc.setFontSize(12);
    doc.setTextColor("#000");
    const startY = 112;
    doc.text("No.", 14, startY);
    doc.text("Product Name", 24, startY);
    doc.text("Quantity", 140, startY);
    doc.text("Price (inr)", 170, startY);

    doc.line(14, startY + 2, 196, startY + 2);

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

    doc.setDrawColor("#003366");
    doc.line(14, y + 4, 196, y + 4);
    doc.setFontSize(14);
    doc.setTextColor("#003366");
    doc.text(`Total Amount: ₹${order.amount?.toFixed(2) || "0.00"}`, 14, y + 14);

    doc.setFontSize(10);
    doc.setTextColor("#555");
    doc.text("Thank you for shopping with Q-Mart! Visit us again.", 14, y + 30);

    doc.save(`invoice_${order._id}.pdf`);

    toast.info("📄 Invoice downloaded!");
  };

  const handleReturnProduct = async (orderId, itemId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to return this product?"
    );
    if (!confirmReturn) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/orders/${orderId}/items/${itemId}/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      toast.success("✅ Product return requested successfully!");

      // Update orders state
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            const updatedItems = order.items.map((item) =>
              item._id === itemId ? { ...item, status: "Returned" } : item
            );
            return { ...order, items: updatedItems };
          }
          return order;
        })
      );

      // Update modal order if open
      setSelectedOrder((prev) => {
        if (!prev) return prev;
        const updatedItems = prev.items.map((item) =>
          item._id === itemId ? { ...item, status: "Returned" } : item
        );
        return { ...prev, items: updatedItems };
      });
    } catch (error) {
      console.error("Error returning product:", error);
      toast.error("❌ Failed to return product.");
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
              <div className="mb-3 flex justify-between items-center">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "Returned"
                      ? "bg-red-200 text-red-700"
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

              {/* Products (brief) */}
              <div className="border-t border-b py-3 mb-3">
                {order.items.map((item) => (
                  <div
                    key={item._id}
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
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">₹{item.price}</p>
                    {item.status === "Returned" && (
                      <span className="text-red-600 font-semibold px-2 py-1">
                        Returned
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between font-semibold border-t pt-2 text-sm">
                <span>Total</span>
                <span>₹{order.amount}</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  disabled={order.status === "Delivered"}
                  className={`px-2 py-1 rounded text-white ${
                    order.status === "Delivered"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-800"
                  }`}
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDownloadInvoice(order)}
                  className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Invoice
                </button>

                <button
                  onClick={() => {
                    // Only show returnable products in modal if delivered
                    if (order.status === "Delivered") {
                      const filtered = {
                        ...order,
                        items: order.items.filter(
                          (i) => i.status !== "Returned"
                        ),
                      };
                      setSelectedOrder(filtered);
                    } else {
                      setSelectedOrder(order);
                    }
                    setShowModal(true);
                  }}
                  className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            {selectedOrder.items.length === 0 ? (
              <p>No returnable products available.</p>
            ) : (
              selectedOrder.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b py-3"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productId?.image || ""}
                      alt={item.productId?.productname || "Product"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">
                        {item.productId?.productname}
                      </p>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.price}</p>
                      <p>Status: {item.status}</p>
                    </div>
                  </div>
                  {item.status !== "Returned" &&
                    selectedOrder.status === "Delivered" && (
                      <button
                        onClick={() =>
                          handleReturnProduct(selectedOrder._id, item._id)
                        }
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                      >
                        Return
                      </button>
                    )}
                </div>
              ))
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
