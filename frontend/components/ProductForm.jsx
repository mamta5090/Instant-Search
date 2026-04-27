import { useState } from "react";
import axios from "axios";
import { Upload, Package, FileUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    sales: "",
    default_image: "",
  });
  const navigate=useNavigate()

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
      setMessage(
        error.response?.data?.message || "Failed to save product"
      );
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

      setMessage(
        `${res.data.message} (${res.data.count} records)`
      );

      setFile(null);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Import failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 flex justify-center items-start">
      <div className="w-full max-w-5xl space-y-2">

        {/* Heading */}
        <div className="text-center">
          <div onClick={()=>navigate(-1)} className="flex cursor-pointer text-white"><FaArrowLeftLong /></div>
          <h1 className="text-xl font-bold text-white">
            Product Management 📦
          </h1>
          <p className="text-gray-400 ">
            Add products manually or import bulk data
          </p>
        </div>

        {/* Manual Product Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl px-8 py-2">
          <div className="flex items-center gap-3 mb-6">
            <Package className="text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              Add Product Manually
            </h2>
          </div>

          <form
            onSubmit={handleManualSubmit}
            className="grid md:grid-cols-2 gap-2"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 md:col-span-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="Slug"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="sales"
              value={form.sales}
              onChange={handleChange}
              placeholder="Sales"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="default_image"
              value={form.default_image}
              onChange={handleChange}
              placeholder="Image URL"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 md:col-span-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="md:col-span-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:scale-[1.02] transition"
            >
              Save Product
            </button>
          </form>
        </div>

        {/* File Upload */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl px-4 py-2">
          <div className="flex items-center gap-3 mb-8">
            <FileUp className="text-emerald-400" />
            <h2 className="text-xl font-semibold text-white">
              Import JSON / CSV
            </h2>
          </div>

          <form
            onSubmit={handleUpload}
            className="space-y-4"
          >
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-2xl p-10 cursor-pointer hover:border-emerald-400 transition">
              <Upload className="text-gray-400 mb-3" size={32} />

              <p className="text-gray-300">
                Click to upload JSON or CSV
              </p>

              <input
                type="file"
                accept=".json,.csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            {file && (
              <p className="text-sm text-gray-300">
                Selected: {file.name}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:scale-[1.02] transition"
            >
              Upload File
            </button>
          </form>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-2xl p-4 text-center font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}