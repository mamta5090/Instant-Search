import React from 'react';
import { Search, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020B4A] text-white overflow-hidden">
      {/* Top Banner */}
      <div className="w-full text-center py-3 text-sm border-b border-white/10 bg-[#040f63]">
        <span className="text-blue-400 font-medium">New Report</span>{' '}
        AI trends in B2B ecommerce search 2026
        <button className="ml-3 inline-flex items-center gap-2 text-white font-medium hover:text-blue-400 transition">
          Learn more <ArrowRight size={16} />
        </button>
      </div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-10">
          <h1 className="text-3xl font-bold">algolia</h1>
          <div className="hidden md:flex gap-8 text-lg text-gray-300">
            <a href="#">Products</a>
            <a href="#">Solutions</a>
            <a href="#">Pricing</a>
            <a href="#">Developers</a>
            <a href="#">Resources</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-white/10 px-4 py-3 rounded-full w-72">
            <Search size={18} className="text-gray-300" />
            <input
              type="text"
              placeholder="Search Algolia"
              className="bg-transparent outline-none px-3 w-full"
            />
          </div>

          <button className="px-6 py-3 border border-white rounded-xl hover:bg-white hover:text-black transition">
            Request demo
          </button>
          <button className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition">
            Get started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 items-center px-10 md:px-20 py-16 gap-10">
        {/* Left Content */}
        <div>
          <h2 className="text-6xl md:text-8xl font-bold leading-tight">
            Agentic.<br />
            Generative.<br />
            Search<span className="text-green-400">›_</span>
          </h2>

          <p className="text-xl text-gray-300 mt-8 max-w-lg">
            One AI retrieval platform to power them all
          </p>

          <button className="mt-10 px-8 py-4 bg-blue-600 rounded-2xl text-lg font-semibold hover:bg-blue-700 transition">
            Explore the platform
          </button>
        </div>

        {/* Right Content */}
        <div className="relative flex justify-center">
          {/* Glow Background */}
          <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full"></div>

          {/* Card UI */}
          <div className="relative bg-gradient-to-br from-blue-900 to-purple-900 border border-cyan-400/30 rounded-[40px] p-8 w-[520px] shadow-2xl">
            <h3 className="text-5xl font-light text-green-300 mb-8">
              Generative ✨
            </h3>

            <div className="bg-white rounded-full px-6 py-4 text-black text-lg mb-6">
              4 day family ski trip to Vermont 🎤
            </div>

            <div className="bg-blue-500 rounded-2xl p-5 text-sm leading-relaxed mb-6">
              Here’s a 3-bed rental on Stowe Mountain with lift tickets included.
              I know you like Mexican food so here’s a 5-star spot just a mile away.
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white/10 rounded-2xl h-32 backdrop-blur-md"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
