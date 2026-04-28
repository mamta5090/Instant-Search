import { useState } from "react";
import axios from "axios";
import { Upload, Package, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import home from "../assets/home.webp";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sales: "",
    default_image: "",
  });

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5020/api/v1/products/manual",
        form
      );

      setMessage(res.data.message);

      setForm({
        name: "",
        slug: "",
        sales: "",
        default_image: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please choose a JSON or CSV file");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5020/api/v1/products/import",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(`${res.data.message} (${res.data.count} records)`);
      setFile(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Import failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={home}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Main Content */}
<div className="relative z-10 min-h-screen px-6 py-10 flex items-center justify-center">
       <div className="w-full max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="text-white text-2xl mb-8 hover:scale-110 transition"
          >
            <FaArrowLeftLong />
          </button>

          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Product Management 📦
            </h1>

            <p className="text-gray-300 text-lg">
              Add products manually or import bulk data easily
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Manual Product Form */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-500/20 p-3 rounded-2xl">
                  <Package className="text-blue-400" />
                </div>

                <h2 className="text-2xl font-semibold text-white">
                  Add Product
                </h2>
              </div>

              <form
                onSubmit={handleManualSubmit}
                className="space-y-5"
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="Product Slug"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  name="sales"
                  value={form.sales}
                  onChange={handleChange}
                  placeholder="Sales Count"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  name="default_image"
                  value={form.default_image}
                  onChange={handleChange}
                  placeholder="Product Image URL"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-4 rounded-2xl text-white font-semibold text-lg hover:scale-[1.02] transition"
                >
                  Save Product
                </button>
              </form>
            </div>

            {/* File Upload */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-emerald-500/20 p-3 rounded-2xl">
                  <FileUp className="text-emerald-400" />
                </div>

                <h2 className="text-2xl font-semibold text-white">
                  Bulk Import
                </h2>
              </div>

              <form
                onSubmit={handleUpload}
                className="space-y-6"
              >
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-3xl p-14 cursor-pointer hover:border-emerald-400 transition">
                  <Upload
                    className="text-gray-300 mb-4"
                    size={40}
                  />

                  <p className="text-white text-lg font-medium">
                    Upload JSON / CSV File
                  </p>

                  <p className="text-gray-400 text-sm mt-2">
                    Drag & drop or click to browse
                  </p>

                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>

                {file && (
                  <div className="bg-white/10 rounded-2xl px-4 py-3 text-gray-300">
                    Selected: {file.name}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 py-4 rounded-2xl text-white font-semibold text-lg hover:scale-[1.02] transition"
                >
                  Upload File
                </button>
              </form>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 text-center text-white font-medium">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}