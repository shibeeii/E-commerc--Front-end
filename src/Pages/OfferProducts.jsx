import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";

const OfferProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 8; // Products per page

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOfferProducts();
  }, [page, sort, searchItem]);

  const fetchOfferProducts = async () => {
    try {
      const offset = (page - 1) * limit;
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/products?limit=${limit}&offset=${offset}`
      );

      // filter for offer products only
      const offerProducts = res.data.products.filter(
        (p) => p.offer && p.offer > 0
      );

      // sort results
      let sorted = [...offerProducts];
      if (sort === "lowToHigh") sorted.sort((a, b) => a.price - b.price);
      if (sort === "highToLow") sorted.sort((a, b) => b.price - a.price);

      // filter search
      const filtered = sorted.filter((p) =>
        p.productname.toLowerCase().includes(searchItem.toLowerCase())
      );

      setProducts(filtered);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching offer products:", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mt-10 mb-12">
      <h2 className="text-3xl font-bold text-center">Offer Products</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 mx-4 my-10 sm:mx-20 mt-6">
        {/* Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <label htmlFor="price-sort" className="text-black font-medium">
            Sort by:
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            id="price-sort"
            className="rounded-xl border border-gray-300 px-3 py-1 bg-white text-black"
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative group w-full sm:w-auto">
          <input
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full sm:w-[200px] rounded-full border border-gray-300 px-3 py-1"
          />
          <IoMdSearch className="text-gray-500 absolute top-1/2 -translate-y-1/2 right-4" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
        {products.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">
            No offer products found.
          </p>
        ) : (
          products.map((product, index) => (
            <div
              key={product._id}
              className="w-[260px] h-[400px] rounded-2xl bg-gray-100 hover:bg-primary hover:text-white shadow-xl duration-300 group flex flex-col justify-between items-center p-4 text-center"
            >
              <Link to={`/product/${product._id}`} className="w-full">
                {/* Image */}
                <div className="h-[180px] w-[180px] flex justify-center items-center mb-4 mx-auto">
                  <img
                    src={product.image}
                    alt={product.productname}
                    className="h-full w-full object-contain group-hover:scale-105 duration-300"
                  />
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-lg mb-1">{product.productname}</h3>
                <p className="text-sm text-gray-500 group-hover:text-white duration-300 mb-1 line-clamp-2">
                  {product.description.slice(0, 50)}...
                </p>
                <p className="text-md font-medium text-primary group-hover:text-white duration-300">
                  ₹{product.price}{" "}
                  <span className="text-red-500 text-sm ml-2">
                    {product.offer}% OFF
                  </span>
                </p>

                <div className="flex justify-center mt-5">
                  <button className="bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full">
                    View Details
                  </button>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded ${
                page === i + 1 ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OfferProducts;
