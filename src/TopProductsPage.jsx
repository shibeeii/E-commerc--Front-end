import React from "react";
import TopProducts from "./components/TopProducts/TopProducts";

const TopProductsPage = ({ handleOrderPopup }) => {
  return (
    <div className="py-10">
      <TopProducts handleOrderPopup={handleOrderPopup} />
    </div>
  );
};

export default TopProductsPage;
