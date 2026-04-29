import db from "../config/db.js";

export const saveSearchHistory = async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) {
      return res.status(400).json({
        message: "Search term required",
      });
    }
    await db.execute(
      "INSERT INTO search_history (search_term) VALUES (?)",
      [term]
    );
    res.status(201).json({
      message: "Search saved",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSearchHistory = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM search_history ORDER BY created_at DESC LIMIT 8"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};