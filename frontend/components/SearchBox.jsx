import { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App.jsx";

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query) return setResults([]);

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
    }
    setLoading(false);
  };

  return (
    <div style={{ width: "400px", margin: "50px auto" }}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      {loading && <p>Loading...</p>}

      <div>
        {results.map((item) => (
          <div
            key={item.document.id}
            style={{
              display: "flex",
              gap: "10px",
              margin: "10px 0",
              borderBottom: "1px solid #ddd",
            }}
          >
            <img
              src={item.document.default_image}
              width="50"
            />
            <div>
              <p>{item.document.name}</p>
              <small>Sales: {item.document.sales}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
