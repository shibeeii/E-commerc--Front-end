import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      { breakpoint: 10000, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, initialSlide: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/testimonials`);
        setTestimonials(res.data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div className="py-10 mb-10">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">What our customers are saying</p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">Testimonials</h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Real feedback from our happy customers
          </p>
        </div>

        {/* Cards */}
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {testimonials.length > 0 ? (
              testimonials.map((data) => (
                <div key={data._id} className="my-6">
                  <div className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-primary/10 relative">
                    {/* Common Cartoon Image */}
                    <div className="mb-4 flex justify-center">
                      <img
                        src={data.img || "https://cdn-icons-png.flaticon.com/512/1995/1995574.png"}
                        alt="User"
                        className="rounded-full w-20 h-20 object-cover"
                      />
                    </div>

                    {/* Name & Text */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="space-y-3 text-center">
                        <p className="text-xs text-gray-500">{data.text}</p>
                        <h1 className="text-xl font-bold text-black/80 dark:text-light">
                          {data.name || "Anonymous"}
                        </h1>
                      </div>
                    </div>

                    {/* Quote Mark */}
                    <p className="text-primary text-9xl font-serif absolute top-0 right-0">
                      ,,
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                No testimonials yet. Be the first to add one!
              </p>
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
