import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { Search, Image as ImageIcon } from "lucide-react";
import { FaArrowLeftLong } from "react-icons/fa6";

const SearchPage = () => {
  const { indexId } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [mainField, setMainField] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      fetchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.get(
        `${serverUrl}/api/search/${indexId}?q=${query}`
      );

      setResults(res.data.hits || []);
      setMainField(res.data.mainField || "");
    } catch (err) {
      console.error(err);
      // alert(err.response?.data?.error || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Basic Image Detection Heuristic
  const isImageUrl = (url) => {
    if (typeof url !== 'string') return false;
    return url.match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) != null;
  };

  // Render a result card dynamically
  const renderCard = (doc) => {
    const keys = Object.keys(doc).filter(k => k !== 'id' && k !== mainField);
    
    // Find the first image field if one exists
    let imageField = null;
    for (const key of Object.keys(doc)) {
      if (isImageUrl(doc[key])) {
        imageField = key;
        break;
      }
    }

    const title = mainField && doc[mainField] ? doc[mainField] : (doc.name || doc.title || "Document " + doc.id);

    return (
      <div
        key={doc.id}
        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition duration-300 shadow-xl group flex gap-6"
      >
        {/* Image Section */}
        {imageField ? (
          <div className="shrink-0">
            <img 
              src={doc[imageField]} 
              alt={title} 
              className="w-24 h-24 object-cover rounded-xl border border-white/10 shadow-md group-hover:scale-105 transition-transform"
            />
          </div>
        ) : (
          <div className="shrink-0 w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <ImageIcon className="text-blue-400/50" size={32} />
          </div>
        )}

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-xl font-bold truncate mb-2 group-hover:text-blue-400 transition-colors">
            {title}
          </h2>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
            {keys.slice(0, 4).map((key) => {
              // Don't render the image URL as text if we already used it
              if (key === imageField) return null;
              
              const val = doc[key];
              const displayVal = typeof val === 'object' ? JSON.stringify(val) : String(val);

              return (
                <div key={key} className="truncate">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{key}</span>
                  <p className="text-gray-300 text-sm truncate" title={displayVal}>{displayVal}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 py-20 px-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-white/70 hover:text-white text-2xl cursor-pointer hover:scale-110 transition flex items-center gap-2"
      >
        <FaArrowLeftLong />
      </button>

      <div className="w-full max-w-3xl mx-auto relative z-10">
        
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-center mb-10 tracking-tight">
          Search Index
        </h1>

        {/* Search Box */}
        <div className="relative mb-8 group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors"
            size={24}
          />
          <input
            type="text"
            placeholder="Type to search your data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-lg placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/15 transition-all shadow-2xl"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {!loading && results.map((item) => renderCard(item.document))}
        </div>

        {/* Empty State */}
        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center mt-16 p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
            <p className="text-gray-400 text-lg">We couldn't find any matches for "{query}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;