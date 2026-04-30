import React, { useEffect, useState } from 'react';
import { Search, ArrowRight, Database, Plus, Play, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App.jsx';

export default function Home() {
  const navigate = useNavigate();
  const [indexes, setIndexes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/indexes`);
        setIndexes(res.data);
      } catch (err) {
        console.error("Error fetching indexes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIndexes();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the index "${name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await axios.delete(`${serverUrl}/api/indexes/${id}`);
      setIndexes(indexes.filter((idx) => idx.id !== id));
    } catch (err) {
      console.error("Error deleting index:", err);
      alert(err.response?.data?.error || "Error deleting index");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Instant-Search
          </h1>
          <div className="hidden md:flex gap-8 text-lg text-gray-300 font-medium">
            <a href="#" className="hover:text-white transition">Dashboard</a>
            <a href="#" className="hover:text-white transition">Documentation</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 border border-white/20 rounded-xl hover:bg-white/10 transition backdrop-blur-md">
            Logout
          </button>
          <button 
            onClick={() => navigate('/create-index')}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl hover:bg-blue-500 transition font-semibold shadow-lg shadow-blue-500/30"
          >
            <Plus size={18} />
            New Index
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Agentic. Generative. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Search Engine</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Instantly create, configure, and query dynamic search indexes. Upload your JSON data and get a fully typed, ultra-fast search API in seconds.
          </p>
          <button 
            onClick={() => navigate('/create-index')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl text-lg font-bold hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/10"
          >
            Get Started
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Indexes Dashboard */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Database className="text-blue-400" />
              Your Indexes
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : indexes.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-md">
              <Database size={48} className="mx-auto text-gray-500 mb-4" />
              <h4 className="text-xl font-semibold mb-2">No indexes found</h4>
              <p className="text-gray-400 mb-6">Create your first index to start searching your data.</p>
              <button 
                onClick={() => navigate('/create-index')}
                className="px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition"
              >
                Create Index
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {indexes.map((idx) => (
                <div key={idx.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition group backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold capitalize mb-1">{idx.name}</h4>
                      <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        ID: {idx.id}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDelete(idx.id, idx.name)}
                      className="text-gray-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 p-2 rounded-lg"
                      title="Delete Index"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-6 font-mono truncate">
                    Collection: {idx.collection_name}
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/search/${idx.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl transition"
                    >
                      <Search size={16} /> Search
                    </button>
                    {!idx.main_field && (
                      <button 
                        onClick={() => navigate(`/upload/${idx.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl transition"
                      >
                        <Play size={16} /> Configure
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
