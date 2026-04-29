import { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { Search } from "lucide-react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const HISTORY_KEY = "search_history";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const navigate = useNavigate();

  // Load history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    setRecentSearches(saved);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const term = query.trim();

      if (!term) {
        setResults([]);
        return;
      }

      fetchResults(term);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const saveSearchTerm = (term) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    const updated = [
      cleanTerm,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== cleanTerm.toLowerCase()
      ),
    ].slice(0, 8);

    setRecentSearches(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const fetchResults = async (term) => {
    setLoading(true);

    try {
      const res = await axios.get(`${serverUrl}/api/search?q=${term}`);
      setResults(res.data.hits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (term) => {
    setQuery(term);
    fetchResults(term);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;

    saveSearchTerm(term);
    fetchResults(term);
  };

  const filteredHistory = recentSearches.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  // const saveSearchTerm=async(term)=>{
  //   try{
  //     await axios.post(`${serverUrl}/api/history/save-history`,{term});
  //   }catch(err){
  //     console.error("Failed to save search history:",err);
  //   }
  // }

  return (
     <div className="min-h-screen bg-gradient-to-br from-[#553e2f] via-[#696660] to-[#79726a] py-20 px-4 relative">
        {/* <div className="min-h-screen bg-gray-200 py-20 px-4 relative"> */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 text-white text-2xl cursor-pointer hover:scale-110 transition"
      >
        <FaArrowLeftLong />
      </button>

      <div className="w-full  mx-auto">
        <h1 className="text-4xl  font-bold text-white text-center mb-8">
          Search Products 🔍
        </h1>

<form onSubmit={handleSearch} className="relative mb-8 max-w-xl mx-auto">
   <div className="relative w-full max-w-xl  mx-auto">
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 "
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

  {/* Small history dropdown */}
  {query.trim() && filteredHistory.length > 0 && (
<div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border overflow-hidden z-30">
      
      <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b">
        Recent Searches
      </div>

      <div className="max-h-52 overflow-y-auto">
        {filteredHistory.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleSuggestionClick(item)}
            className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )}
</form>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-300 mb-4">Loading...</div>
        )}

        {/* Results */}
        <div className="space-y-4 ">
          {results.map((item) => (
            <div
              key={item.document.id}
              className="bg-white/10  backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex gap-4 hover:scale-[1.02] transition duration-300"
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

        {!loading && query && results.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No products found 😕
          </div>
        )}
      </div>
    </div>
  );
}