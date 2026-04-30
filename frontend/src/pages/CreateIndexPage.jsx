import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Database, ArrowRight, Sparkles } from "lucide-react";
import { serverUrl } from "../App.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";

const CreateIndexPage = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) return alert("Enter index name");

    try {
      setLoading(true);

      const res = await axios.post(`${serverUrl}/api/indexes`, { name });
      const index = res.data;

      // navigate to upload page with indexId
      navigate(`/upload/${index.id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Error creating index");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 flex items-center justify-center p-4 relative">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-white/70 hover:text-white text-2xl cursor-pointer hover:scale-110 transition flex items-center gap-3 font-semibold"
      >
        <FaArrowLeftLong />
      </button>

      {/* Decorative blobs */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-500/30">
              <Database className="text-blue-400" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Create Index
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Give your new search index a unique name to get started.
          </p>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., products, movies, users..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="w-full pl-6 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all font-medium text-lg"
              />
            </div>

            <button 
              onClick={handleCreate} 
              disabled={loading || !name.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Sparkles size={20} />
                  Create Index
                  <ArrowRight size={20} className="ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIndexPage;