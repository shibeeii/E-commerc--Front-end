import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import img1 from "../assets/checkout/A-pay.png";
import img2 from "../assets/checkout/G-pay.png";
import img3 from "../assets/checkout/Paypal.png";
import img4 from "../assets/checkout/Upi.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = () => {

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/cart/${user._id}`);
      setCart(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/address/${user._id}`);
      setAddresses(res.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchAddresses();
    }
  }, [user]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user?._id || !address.fullName) return;

    try {
      if (address._id) {
        await axios.put(
          `${import.meta.env.VITE_SERVER_URL}/address/edit/${user._id}/${address._id}`,
          address
        );
        toast.success("Address updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/address/add`, {
          ...address,
          userId: user._id,
        });
        toast.success("Address added successfully!");
      }

      setShowModal(false);
      setAddress({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      });
      fetchAddresses();
    } catch (err) {
      console.error("Failed to save address:", err);
      toast.error("Failed to save address");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/cart/remove`, {
        data: {
          userId: user._id,
          productId,
        },
      });
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item");
    }
  };

  const deleteAddress = async (userId, addressId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/address/delete/${userId}/${addressId}`
      );
      fetchAddresses();
      toast.success("Address deleted successfully");
    } catch (err) {
      console.error("Failed to delete address:", err);
      toast.error("Failed to delete address");
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      toast.warn("Please select a shipping address.");
      return;
    }

    try {
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/payment/create-order`,
        { amount: total }
      );

      const options = {
        key: "rzp_test_V2IgvO00CCx2sM",
        amount: order.amount,
        currency: order.currency,
        name: "Q Mart",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verify = await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user._id,
                amount: total,
                items: cart.map((item) => ({
                  productId: item.productId._id,
                  quantity: item.quantity,
                  price: item.price,
                })),
                shippingAddress: selectedAddress,
              }
            );

            if (verify.data.success) {
              toast.success("✅ Payment successful & order placed!");
            } else {
              toast.error("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            toast.error("❌ Something went wrong during payment verification.");
          }
        },

        prefill: {
          name: selectedAddress.fullName,
          email: user?.email,
          contact: selectedAddress.phone,
        },
        theme: { color: "#0e7490" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Payment initiation failed. Try again.");
    }
  };

  return (
    <>
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
        theme="light"
      />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold mb-4 text-black">
              {address._id ? "Edit Address" : "Add New Address"}
            </h2>
            <form
              onSubmit={submit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
                placeholder="Full Name"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                placeholder="Phone"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="addressLine"
                value={address.addressLine}
                onChange={handleAddressChange}
                placeholder="Address Line"
                className="border p-2 rounded col-span-full"
              />
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="State"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                placeholder="Pincode"
                className="border p-2 rounded"
              />
              <div className="col-span-full flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setAddress({
                      fullName: "",
                      phone: "",
                      addressLine: "",
                      city: "",
                      state: "",
                      pincode: "",
                    });
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded"
                >
                  {address._id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto p-6 gap-10 mt-12">
        {/* Modal remains unchanged */}

        <div className="w-full lg:w-1/2 space-y-10">
          {/* Saved Addresses as Radio Options */}
          <div className="border p-6 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">Saved Addresses</h3>
              <button
                onClick={() => {
                  setAddress({
                    fullName: "",
                    phone: "",
                    addressLine: "",
                    city: "",
                    state: "",
                    pincode: "",
                  });
                  setShowModal(true);
                }}
                className="text-sm bg-gray-800 p-2 rounded text-white"
              >
                + Add New Address
              </button>
            </div>

            <div className="space-y-4">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 border p-4 rounded-md cursor-pointer ${
                    selectedAddress?._id === addr._id
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddress?._id === addr._id}
                    onChange={() => {
                      setSelectedAddress(addr);
                      setAddress(addr); // fill form
                    }}
                    className="mt-1 accent-blue-600"
                  />
                  <div className="flex-1 text-sm text-gray-700">
                    <div className="font-semibold text-black">
                      {addr.fullName}
                    </div>
                    <div>
                      {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                      {addr.pincode}
                    </div>
                    <div>📞 {addr.phone}</div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddress(addr);
                      }}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAddress(user._id, addr._id);
                      }}
                      className="text-red-600 text-xs hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {/* Editable Shipping Address Form */}
          <div className="border p-6 rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-black">
              Shipping Details
            </h3>
            <form
              onSubmit={submit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
                placeholder="Full Name"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                placeholder="Phone"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="addressLine"
                value={address.addressLine}
                onChange={handleAddressChange}
                placeholder="Address Line"
                className="border p-2 rounded col-span-full"
              />
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="State"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                placeholder="Pincode"
                className="border p-2 rounded"
              />
              <button
                type="submit"
                className="col-span-full bg-primary text-white py-2 rounded"
              >
                {address._id ? "Update Address" : "Save Address"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section - Order Summary + Cart Products */}
        <div className="w-full lg:w-1/2 border p-6 rounded-lg shadow-md bg-white h-fit space-y-6">
          {/* Shipping To */}
          {selectedAddress && (
            <div className="p-4 border rounded bg-white shadow text-sm">
              <h4 className="text-black font-semibold mb-2">Shipping To:</h4>
              <p>{selectedAddress.fullName}</p>
              <p>
                {selectedAddress.addressLine}, {selectedAddress.city},{" "}
                {selectedAddress.state} - {selectedAddress.pincode}
              </p>
              <p>📞 {selectedAddress.phone}</p>
            </div>
          )}

          {/* Cart Items in Order Summary */}
          {cart.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-black">🛒 Order Summary</h3>
              {cart.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex justify-between border-b pb-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.productId.image}
                      alt={item.productId.productname}
                      className="w-16 h-16 object-cover border rounded"
                    />
                    <div>
                      <h4 className="font-medium text-black">
                        {item.productId.productname}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-bold text-black">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <FaTrashAlt
                      onClick={() => handleRemove(item.productId._id)}
                      className="text-red-500 cursor-pointer mt-2"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-black">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black">
                <span>Delivery</span>
                <span className="text-sm text-gray-500">Free</span>
              </div>
            </div>
          )}

          {/* Payment CTA */}
          <button
            onClick={handlePayment}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold shadow"
          >
            Confirm & Pay
          </button>

          {/* Payment Logos */}
          <div className="flex justify-center flex-wrap gap-3 mt-4">
            <img src={img1} alt="Visa" className="h-6" />
            <img src={img2} alt="GPay" className="h-6" />
            <img src={img3} alt="PayPal" className="h-6" />
            <img src={img4} alt="UPI" className="h-6" />
          </div>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Got a discount code? Add it in the next step.
          </p>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
