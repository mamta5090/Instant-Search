import React from "react";
import { Search, ArrowRight } from "lucide-react";
import home from "../assets/home.webp";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert(res.data.message || "Logout successful");

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background Image */}
      <img
        src={home}
        alt="Home"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 md:px-16 py-6">
          <div className="flex items-center gap-12">
            <h1 className="text-3xl font-bold tracking-wide">
              Instant<span className="text-blue-400">Search</span>
            </h1>

            <div className="hidden md:flex gap-8 text-lg text-gray-200">
              <a href="/search" className="hover:text-blue-400 transition">
                Products
              </a>
              <a href="/add" className="hover:text-blue-400 transition">
                Add Products
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-white/40 rounded-xl hover:bg-white hover:text-black transition"
            >
              Logout
            </button>

            <button className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-lg">
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 grid md:grid-cols-2 items-center px-8 md:px-20 py-10 gap-10">
          {/* Left Side */}
          <div className="max-w-xl">
            <p className="text-blue-300 uppercase tracking-[4px] mb-4">
              AI Powered Search Platform
            </p>

            <h2 className="text-5xl md:text-7xl font-bold leading-tight">
              Find Products <br />
              Faster with <br />
              Smart Search
            </h2>

            <p className="text-lg text-gray-300 mt-6 leading-relaxed">
              Search smarter, discover faster. Experience real-time instant
              results with AI-powered product discovery.
            </p>

            {/* Search Box */}
            <div className="mt-8 flex items-center bg-white/15 backdrop-blur-xl border border-white/20 rounded-2xl p-2 max-w-lg shadow-xl">
              <Search className="ml-4 text-gray-300" />

              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-gray-300"
              />

              <button className="bg-blue-600 px-5 py-3 rounded-xl hover:bg-blue-700 transition">
                <ArrowRight />
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center md:justify-end">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-[420px] shadow-2xl">
              <h3 className="text-3xl font-semibold mb-6 text-blue-300">
                Trending Searches 🔥
              </h3>

              <div className="space-y-4">
                {["Sofa Set", "Dining Table", "Modern Lamp", "Wooden Chair"].map(
                  (item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition cursor-pointer"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}