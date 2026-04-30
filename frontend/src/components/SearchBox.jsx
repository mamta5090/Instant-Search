import { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { Search } from "lucide-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      fetchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${serverUrl}/api/search?q=${query}`
      );
      setResults(res.data.hits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 py-20 px-4 relative">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-white text-2xl cursor-pointer hover:scale-110 transition"
      >
        <FaArrowLeftLong />
      </button>

      <div className="w-full max-w-2xl mx-auto">
        
        {/* Heading */}
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Search Products 🔍
        </h1>

        {/* Search Box */}
        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-300 mb-4">
            Loading...
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {results.map((item) => (
            <div
              key={item.document.id}
              className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex gap-4 hover:scale-[1.02] transition duration-300"
            >
              <img
                src={item.document.default_image}
                alt={item.document.name}
                className="w-20 h-20 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h2 className="text-white text-lg font-semibold">
                  {item.document.name}
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Sales: {item.document.sales}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && query && results.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No products found 😕
          </div>
        )}
      </div>
    </div>
  );
}