import pool from "../config/db.js";
import { client } from "../config/typesense.js";

// Create Index
export const createIndex = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?.id || 1; // TEMP: replace with auth later

    if (!name) {
      return res.status(400).json({ error: "Index name is required" });
    }

    // generate collection_name
    const collectionName = `user_${userId}_${name
      .toLowerCase()
      .replace(/\s+/g, "_")}`;

    const result = await pool.query(
      `INSERT INTO indexes (user_id, name, collection_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, name, collectionName]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Indexes
export const getIndexes = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // TEMP: replace with auth later
    const result = await pool.query(
      `SELECT * FROM indexes WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Index
export const deleteIndex = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 1; // TEMP: replace with auth later

    // Get index to find collection name
    const result = await pool.query(
      `SELECT collection_name FROM indexes WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Index not found or unauthorized" });
    }

    const collectionName = result.rows[0].collection_name;

    // Delete from Typesense
    try {
      await client.collections(collectionName).delete();
    } catch (tsErr) {
      console.warn("Typesense collection not found, ignoring:", tsErr.message);
    }

    // Delete documents from DB
    await pool.query(`DELETE FROM documents WHERE index_id = $1`, [id]);

    // Delete index from DB
    await pool.query(`DELETE FROM indexes WHERE id = $1`, [id]);

    res.json({ message: "Index deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};