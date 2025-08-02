import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from "./Pages/Home";
import Allproducts from "./Pages/Allproducts";
import Order from "./Pages/Order";
import CartPage from "./Pages/CartPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CheckoutPage from "./Pages/CheckoutPage";
import Wishlist from "./Pages/Wishlist";
import MyOrders from "./Pages/MyOrders";

const App = () => {
  const [loginPopup, setloginPopup] = React.useState(false);
  const location = useLocation();

  const handleloginPopup = () => {
    setloginPopup(!loginPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Determine whether to show Navbar/Footer
  const hideNavAndFooter = location.pathname === "/login" || location.pathname === "/register";
  const hideOnlyFoot = location.pathname === '/cart' || location.pathname === '/checkout' || location.pathname === '/wishlist';

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      {!hideNavAndFooter && <Navbar handleloginPopup={handleloginPopup} />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home handleOrderPopup={handleloginPopup} />} />
        <Route path="/mobiles" element={<Allproducts category="Mobile" />} />
        <Route path="/laptop" element={<Allproducts category="Laptop" />} />
        <Route path="/electronics" element={<Allproducts category="Electronics" />} />
        <Route path="/fashions" element={<Allproducts category="Fashion" />} />
        <Route path="/books" element={<Allproducts category="Books" />} />
        <Route path="/product/:id" element={<Order />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<Wishlist/>} />
        <Route path="/my-orders" element={<MyOrders/>} />



      </Routes>

      {!hideNavAndFooter && !hideOnlyFoot && <Footer />}
      <Popup loginPopup={loginPopup} setloginPopup={setloginPopup} />
    </div>
  );
};

export default App;
