import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";


const AllProducts = ({ category }) => {

  const [products, setProducts] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [sort, setsort] = useState("default");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 8;
  const offset = (page - 1) * limit;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/products?limit=${limit}&offset=${offset}&category=${category}`
        );

        setProducts(res.data.products);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [category, page]);

  const filteredProducts = products
    ?.filter((product) =>
      product.productname.toLowerCase().includes(searchItem.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "lowToHigh") return a.price - b.price;
      if (sort === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container mt-10 mb-12">
      <h2 className="text-3xl font-bold text-center">{category} Products</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 mx-4 my-10 sm:mx-20 mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <label htmlFor="price-sort" className="text-black font-medium">
            Sort by:
          </label>
          <select
            value={sort}
            onChange={(e) => setsort(e.target.value)}
            id="price-sort"
            className="rounded-xl border border-gray-300 px-3 py-1 bg-white text-black hover:border-orange-500 focus:ring-orange-500 focus:border-orange-500 w-full sm:w-auto"
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
            className="w-full sm:w-[200px] group-hover:sm:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-3 py-1 focus:outline-none focus:border-orange-500 dark:border-gray-500 dark:bg-gray-800"
          />
          <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-4" />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
        {filteredProducts.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">
            No products found.
          </p>
        ) : (
          filteredProducts.map((product, index) => (
            <div
              key={product._id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="w-[260px] h-[400px] rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-primary dark:hover:bg-primary hover:text-white shadow-xl duration-300 group flex flex-col justify-between items-center p-4 text-center"
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
                  ₹{product.price}
                </p>
              
              <div className="flex justify-center mt-5">
                <button className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white  py-1 px-4 rounded-full flex items-center gap-3 group">Buy Now</button>
              </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-primary hover:text-white disabled:opacity-50"
        >
          Previous
        </button>

        <span className="font-medium text-gray-700">
          Page {page} of {Math.ceil(total / limit)}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page * limit >= total}
          className="bg-gray-200 text-black px-4 py-2 rounded-full hover:bg-primary hover:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllProducts;
