export const uploadAndExtractFields = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jsonString = req.file.buffer.toString("utf-8");
    const data = JSON.parse(jsonString);

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    const firstObject = data[0];
    const fields = Object.keys(firstObject);

    res.json({ fields });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};