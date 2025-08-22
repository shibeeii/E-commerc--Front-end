import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa6";
import { IoIosEye } from "react-icons/io";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [returnItem, setReturnItem] = useState(null);
  const [reason, setReason] = useState("");
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
      toast.error(" Failed to load orders.");
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      " Are you sure you want to delete this order?"
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
      toast.success(" Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order", err);
      toast.error(" Failed to delete order.");
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
    doc.text(
      `Total Amount: ₹${order.amount?.toFixed(2) || "0.00"}`,
      14,
      y + 14
    );

    doc.setFontSize(10);
    doc.setTextColor("#555");
    doc.text("Thank you for shopping with Q-Mart! Visit us again.", 14, y + 30);

    doc.save(`invoice_${order._id}.pdf`);

    toast.info("📄 Invoice downloaded!");
  };

  const handleReturnProduct = async (orderId, itemId, reason) => {
    if (!reason) {
      toast.error("Please select a reason for return.");
      return;
    }

    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_SERVER_URL
        }/orders/${orderId}/items/${itemId}/return`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const updatedOrder = res.data.order;
      toast.success(" Product return requested successfully!");

      // Update orders state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );
      setSelectedOrder((prev) =>
        prev && prev._id === orderId ? updatedOrder : prev
      );

      setReturnItem(null);
      setReason("");
    } catch (error) {
      console.error("Error returning product:", error);
      toast.error(" Failed to return product.");
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
              <div className="flex gap-3 mt-4 justify-end">
                {/* Cancel (Trash Icon) */}
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  disabled={order.status === "Delivered"}
                  className={`p-2 rounded-full text-white flex items-center justify-center ${
                    order.status === "Delivered"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  title="Cancel Order"
                >
                  <FaTrash size={16} />
                </button>

                {/* Invoice (Invoice Icon) */}
                <button
                  onClick={() => handleDownloadInvoice(order)}
                  className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
                  title="Download Invoice"
                >
                  <FaFileInvoice size={16} />
                </button>

                {/* View (Eye Icon) */}
                <button
                  onClick={() => {
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
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                  title="View Order"
                >
                  <IoIosEye size={18} />
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
                <div key={item._id} className="flex flex-col border-b py-3">
                  <div className="flex items-center justify-between gap-4">
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
                          onClick={() => setReturnItem(item)}
                          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded"
                        >
                          Return
                        </button>
                      )}
                  </div>

{/* Reason form */}
{returnItem?._id === item._id && (
  <div className="mt-4 pl-20 border-t pt-4">
    <h3 className="font-medium text-sm mb-3 text-gray-700">
      Select Return Reason
    </h3>

    {/* Styled radio options */}
    <div className="space-y-3">
      {[
        "Wrong item delivered",
        "Damaged/Defective",
        "Not as described",
        "Other",
      ].map((r) => (
        <label
          key={r}
          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition 
            ${
              reason === r
                ? "border-yellow-600 bg-yellow-50 shadow-sm"
                : "border-gray-300 hover:border-yellow-400"
            }`}
        >
          <input
            type="radio"
            name="reason"
            value={r}
            checked={reason === r}
            onChange={(e) => setReason(e.target.value)}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
          />
          <span className="text-sm text-gray-700">{r}</span>
        </label>
      ))}
    </div>

    {/* Selected reason preview */}
    {reason && (
      <div className="mt-4">
        <label className="block text-xs text-gray-500 mb-1">
          Selected Reason
        </label>
        <input
          type="text"
          value={reason}
          readOnly
          className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed text-gray-700"
        />
      </div>
    )}

    {/* Action buttons */}
    <div className="flex gap-2 mt-4">
      <button
        onClick={() =>
          handleReturnProduct(selectedOrder._id, item._id, reason)
        }
        disabled={!reason}
        className={`px-4 py-2 rounded text-white transition 
          ${
            reason
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
      >
        Submit Return
      </button>
      <button
        onClick={() => {
          setReturnItem(null);
          setReason("");
        }}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Cancel
      </button>
    </div>
  </div>
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
