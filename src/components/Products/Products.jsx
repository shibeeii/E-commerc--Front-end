import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ImgMobile from "../../assets/product/12.png";
import ImgLaptop from "../../assets/product/laptop.png";
import ImgElectronics from "../../assets/product/Home-Appliance-Background-PNG.png";
import ImgFashion from "../../assets/product/fashion.png";
import ImgBooks from "../../assets/product/book.png";

const Products = () => {
  const categories = [
    { id: 1, img: ImgMobile, title: "Mobile", link: "/mobiles" },
    { id: 2, img: ImgLaptop, title: "Laptop", link: "/laptop" },
    { id: 3, img: ImgElectronics, title: "Electronics", link: "/electronics" },
    { id: 4, img: ImgFashion, title: "Fashion", link: "/fashions" },
    { id: 5, img: ImgBooks, title: "Books", link: "/books" },
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
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary">Top Selling Products for you</p>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-xs text-gray-400">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit asperiores modi
          </p>
        </div>

        {/* Carousel Section */}
        <Slider {...settings}>
          {categories.map((cat) => (
            <div key={cat.id} className="px-2">
              <Link to={cat.link}>
                <div className="group my-10 w-[260px] h-[300px] rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-xl hover:bg-primary hover:text-white duration-300 flex flex-col items-center justify-between p-4 mx-auto transition-transform hover:scale-105">
                  {/* Image */}
                  <div className="h-[250px] w-[200px] flex items-center justify-center">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Title inside the card */}
                  <h3 className="font-semibold text-center group-hover:text-white">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Products;
