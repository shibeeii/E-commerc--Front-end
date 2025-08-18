import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import img1 from "../assets/checkout/A-pay.png";
import img2 from "../assets/checkout/G-pay.png";
import img3 from "../assets/checkout/Paypal.png";
import img4 from "../assets/checkout/Upi.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");
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
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchCart = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/cart/${user._id}`
      );
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
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/address/${user._id}`
      );
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
          `${import.meta.env.VITE_SERVER_URL}/address/edit/${user._id}/${
            address._id
          }`,
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
        `${
          import.meta.env.VITE_SERVER_URL
        }/address/delete/${userId}/${addressId}`
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
      // 🔹 Step 1: Create Razorpay Order
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
            // In handlePayment verify
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
                paymentMode: "UPI", // 👈 Add this
              }
            );

            if (verify.data.success) {
              toast.success(
                verify.data.message || "Payment successful & order placed!"
              );

              setTimeout(() => navigate("/my-orders"), 1500);

              // 🔹 Step 3: Clear Cart (non-blocking)
              axios
                .delete(
                  `${import.meta.env.VITE_SERVER_URL}/cart/clear/${user._id}`
                )
                .then(() => {
                  setCart([]);
                  setTotal(0);
                })
                .catch((err) => console.error("🛒 Error clearing cart:", err));
            } else {
              toast.error(
                verify.data.message || "Payment verification failed."
              );
            }
          } catch (err) {
            console.error(
              " Verification Error:",
              err.response?.data || err.message
            );
            toast.error(
              err.response?.data?.message || "Payment verification failed."
            );
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
      console.error(
        " Order Creation Error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Payment initiation failed. Try again."
      );
    }
  };

  const handleCOD = async () => {
    if (!selectedAddress) {
      toast.warn("Please select a shipping address.");
      return;
    }

    try {
      // In handleCOD
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/payment/cod`,
        {
          userId: user._id,
          amount: total,
          items: cart.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: selectedAddress,
          paymentMode: "Cash on Delivery", // 👈 Add this
        }
      );

      if (data.success) {
        toast.success("COD order placed successfully!");

        setTimeout(() => navigate("/my-orders"), 1500);

        await axios.delete(
          `${import.meta.env.VITE_SERVER_URL}/cart/clear/${user._id}`
        );
        setCart([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("COD Order Error:", err);
      toast.error("Failed to place COD order.");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} theme="light" />
      <div className="flex flex-col lg:flex-row max-w-6xl mx-auto p-6 gap-10 mt-12">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 space-y-10">
          {/* Saved Addresses */}
          <div className="border p-6 rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-bold text-black mb-4">
              Saved Addresses
            </h3>
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
                      setAddress(addr);
                      setAddressConfirmed(true);
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

          {/* Shipping Form */}
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
                {addressConfirmed || address._id
                  ? "Confirm Address"
                  : "Save Address"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 border p-6 rounded-lg shadow-md bg-white h-fit space-y-6">
          {cart.length > 0 && (
            <>
              <h3 className="text-xl font-bold text-black">🛒 Order Summary</h3>

              {selectedAddress && (
                <div className="border border-gray-200 p-4 rounded text-sm bg-gray-50">
                  <h4 className="font-semibold text-black mb-1">📦 Ship To:</h4>
                  <p className="text-black">{selectedAddress.fullName}</p>
                  <p>
                    {selectedAddress.addressLine}, {selectedAddress.city},{" "}
                    {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                  <p>📞 {selectedAddress.phone}</p>
                </div>
              )}

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
                    {(() => {
                      const originalPrice = item.productId.price;
                      const offer = item.productId.offer || 0;
                      const discountedPrice =
                        originalPrice - (originalPrice * offer) / 100;

                      return (
                        <div className="text-right">
                          <div className="text-green-600 font-semibold">
                            ₹{(discountedPrice * item.quantity).toFixed(2)}
                          </div>
                          {offer > 0 && (
                            <div className="text-xs text-gray-500 line-through">
                              ₹{(originalPrice * item.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      );
                    })()}

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
            </>
          )}
          <div className="border p-4 rounded bg-gray-50 space-y-2">
            <h4 className="font-semibold text-black">💳 Payment Method</h4>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Online Payment (Razorpay)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>

          <button
            onClick={() => {
              if (paymentMethod === "online") {
                handlePayment();
              } else {
                handleCOD();
              }
            }}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-lg font-semibold shadow"
          >
            {paymentMethod === "online" ? "Confirm & Pay" : "Place Order (COD)"}
          </button>

          <div className="flex justify-center flex-wrap gap-3 mt-4">
            <img src={img1} alt="Visa" className="h-6" />
            <img src={img2} alt="GPay" className="h-6" />
            <img src={img3} alt="PayPal" className="h-6" />
            <img src={img4} alt="UPI" className="h-6" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
