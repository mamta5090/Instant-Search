import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { FaArrowLeftLong } from "react-icons/fa6";
import { UploadCloud, CheckCircle2, Settings, ArrowRight, FileJson } from "lucide-react";

const UploadPage = () => {
  const { indexId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [mainField, setMainField] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  // 📤 Upload file → get fields
  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(`${serverUrl}/api/indexes/${indexId}/upload`, formData);
      
      setFields(res.data.fields);
      // Auto-select all fields by default
      setSelectedFields(res.data.fields);
      
      // also read file locally to send later
      const text = await selectedFile.text();
      const json = JSON.parse(text);
      setData(json);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      handleUpload(file);
    }
  };

  // 🔘 Toggle field selection
  const toggleField = (field) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // ⚙ Configure index
  const handleConfigure = async () => {
    if (selectedFields.length === 0) {
      return alert("Select at least one searchable field");
    }
    if (!mainField) {
      return alert("Please select a main field");
    }

    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/indexes/${indexId}/configure`, {
        searchable_fields: selectedFields,
        main_field: mainField,
        data: data,
      });

      navigate(`/search/${indexId}`);
    } catch (err) {
      alert(err.response?.data?.error || "Configure failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-4 md:p-10 relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-white/70 hover:text-white text-2xl cursor-pointer hover:scale-110 transition flex items-center gap-3 z-20"
      >
        <FaArrowLeftLong />
      </button>

      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 pt-10">
        
        {/* Stepper Header */}
        <div className="flex items-center justify-between mb-12">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-xl font-bold border-2 ${step >= 1 ? 'border-blue-400 bg-blue-400/20' : 'border-gray-500 bg-transparent'}`}>
              <UploadCloud size={24} />
            </div>
            <span className="font-semibold text-sm">1. Upload JSON</span>
          </div>
          <div className={`flex-1 h-1 mx-4 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-xl font-bold border-2 ${step >= 2 ? 'border-blue-400 bg-blue-400/20' : 'border-gray-500 bg-transparent'}`}>
              <Settings size={24} />
            </div>
            <span className="font-semibold text-sm">2. Configure Schema</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl">
          
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Upload Data</h2>
              <p className="text-gray-400 mb-10">Upload a JSON array containing your dataset. We'll automatically detect the schema.</p>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-500/50 rounded-3xl p-16 hover:bg-blue-500/10 transition-colors cursor-pointer group"
              >
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
                    <p className="text-blue-400 font-semibold text-lg">Analyzing Data...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-500/20 p-6 rounded-full group-hover:scale-110 transition-transform mb-6">
                      <FileJson className="text-blue-400" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Click to browse</h3>
                    <p className="text-gray-400">or drag and drop your .json file here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Configure Schema</h2>
                  <p className="text-gray-400">Select fields to index and choose the main display field.</p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl border border-green-500/30">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold">{data.length} records parsed</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Searchable Fields */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Searchable Fields</h3>
                  <p className="text-sm text-gray-400 mb-6">Select which fields Typesense should index for searching.</p>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {fields.map((field) => (
                      <label 
                        key={field} 
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${
                          selectedFields.includes(field) 
                            ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field)}
                          onChange={() => toggleField(field)}
                          className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 bg-slate-800 border-gray-600"
                        />
                        <span className="text-white font-medium break-all">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Main Field */}
                <div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Primary Display Field</h3>
                    <p className="text-sm text-gray-400 mb-6">This field will be used as the main title for search results.</p>
                    
                    <div className="relative">
                      <select
                        value={mainField}
                        onChange={(e) => setMainField(e.target.value)}
                        className="w-full appearance-none bg-slate-800 border border-slate-600 text-white py-4 px-6 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-lg"
                      >
                        <option value="" disabled>Select a field...</option>
                        {fields.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfigure}
                    disabled={loading || selectedFields.length === 0 || !mainField}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Settings size={20} />
                        Configure & Index Data
                        <ArrowRight size={20} className="ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;