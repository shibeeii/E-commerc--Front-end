import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ImgMobile from "../../assets/product/12.png";
import ImgLaptop from "../../assets/product/laptop.png";
import ImgElectronics from "../../assets/product/Home-Appliance-PNG-Image.png";
import ImgFashion from "../../assets/product/shop.png";
import ImgBooks from "../../assets/product/book.png";

const Products = () => {
  const categories = [
    {
      id: 1,
      img: ImgMobile,
      title: "Mobile",
      link: "/mobiles",
      desc: "Latest smartphones & gadgets",
    },
    {
      id: 2,
      img: ImgLaptop,
      title: "Laptop",
      link: "/laptop",
      desc: "Powerful laptops for work & play",
    },
    {
      id: 3,
      img: ImgElectronics,
      title: "Electronics",
      link: "/electronics",
      desc: "Smart tech for your modern life",
    },
    {
      id: 4,
      img: ImgFashion,
      title: "Fashion",
      link: "/fashions",
      desc: "Trendy outfits & accessories",
    },
    {
      id: 5,
      img: ImgBooks,
      title: "Books",
      link: "/books",
      desc: "Stories & knowledge to inspire",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, centerMode: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, centerMode: true } },
      { breakpoint: 480, settings: { slidesToShow: 1, centerMode: true } },
    ],
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary font-medium">
            Top Selling Products for you
          </p>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-xs text-gray-500">
            Discover our most popular picks loved by customers worldwide. From
            the latest tech to everyday essentials, shop the products everyone’s
            talking about!
          </p>
        </div>

        {/* Carousel */}
        <Slider {...settings}>
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="flex justify-center">
                <Link to={cat.link}>
                  <div className="mb-10 relative group w-[250px] h-[340px] rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:rotate-1 hover:scale-[1.05] bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 mx-auto">
                    {/* Glowing Background Orb */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 blur-3xl opacity-70 group-hover:scale-125 transition-transform duration-500"></div>
                    </div>

                    {/* Floating PNG Image */}
                    <div className="relative z-10 h-[200px] flex justify-center items-center animate-[float_3s_ease-in-out_infinite]">
                      <img
                        src={cat.img}
                        alt={cat.title}
                        className="h-[180px] object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Text Contents - No background */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-center w-[85%] transition-all duration-500 group-hover:text-primary">
                      <p className="font-semibold text-lg">{cat.title}</p>
                      <p className="text-xs text-gray-700 mt-1">
                        {cat.desc}
                      </p>
                      <div className="mt-2 text-xs font-medium text-primary group-hover:translate-x-1 transition-transform duration-300 flex items-center justify-center gap-1">
                        Explore Now <span className="text-base">→</span>
                      </div>
                    </div>

                    {/* Hover Glow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Products;
