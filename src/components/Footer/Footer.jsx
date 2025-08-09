import React, { useState } from "react";
import { Link } from "react-router-dom";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footter-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const FooterLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Contact", link: "/contact" },
  { title: "Blog", link: "/blog" },
];

const Footer = () => {
  const [name, setName] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!testimonial.trim()) {
      toast.warn("Please write your testimonial.");
      return;
    }

    // Check submission limit
    let submissionCount = parseInt(localStorage.getItem("testimonialCount") || "0");
    if (submissionCount >= 2) {
      toast.error("You can only submit 2 testimonials.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/testimonials`, {
        name: name.trim() || "Anonymous",
        text: testimonial.trim(),
      });

      submissionCount += 1;
      localStorage.setItem("testimonialCount", submissionCount.toString());

      toast.success("Thanks for your feedback!");
      setName("");
      setTestimonial("");
    } catch (err) {
      console.error("Error adding testimonial:", err);
      toast.error("Failed to submit testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={BannerImg} className="text-white">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & description */}
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold mb-3">
              <img src={footerLogo} alt="logo" className="max-w-[50px]" />
              Q-Mart
            </h1>
            <p className="text-gray-300 text-sm">
              Innovating shopping experiences one product at a time.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="hover:scale-110 transition-transform">
                <FaInstagram className="text-2xl hover:text-primary transition" />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <FaFacebook className="text-2xl hover:text-primary transition" />
              </a>
              <a href="#" className="hover:scale-110 transition-transform">
                <FaLinkedin className="text-2xl hover:text-primary transition" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2">
              {FooterLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.link}
                    className="text-gray-300 hover:text-primary transition"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Get in Touch</h2>
            <div className="flex items-center gap-3 mb-2">
              <FaLocationArrow />
              <p>Kerala, India</p>
            </div>
            <div className="flex items-center gap-3">
              <FaMobileAlt />
              <p>+91 123456789</p>
            </div>
          </div>

          {/* Testimonial Form */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Leave a Testimonial</h2>
            <p className="text-gray-300 text-sm mb-3">
              Share your experience with us.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="p-2 rounded text-black"
              />
              <textarea
                rows="3"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
                placeholder="Write your feedback..."
                className="p-2 rounded text-black resize-none"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/20 pt-4 flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Q-Mart. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-primary">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-primary">
              Terms of Service
            </span>
            <span className="cursor-pointer hover:text-primary">Cookies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
