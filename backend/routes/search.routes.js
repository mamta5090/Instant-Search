import express from "express";
import db from "../config/db.js";
import { client } from "../config/typesense.js";

const router = express.Router();

router.get("/:indexId", async (req, res) => {
  try {
    const { indexId } = req.params;
    const q = (req.query.q || "").trim();

    // 🔹 Get index config from DB
    const result = await db.query(
      `SELECT collection_name, searchable_fields, main_field FROM indexes WHERE id = $1`,
      [indexId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Index not found" });
    }

    const { collection_name, searchable_fields, main_field } = result.rows[0];

    // 🔹 Parse searchable_fields if it's a string (stored as JSONB)
    const fieldsArray = typeof searchable_fields === 'string' 
      ? JSON.parse(searchable_fields) 
      : searchable_fields;

    // 🔹 Convert array to comma string
    const queryBy = fieldsArray.join(",");

    // 🔹 Search Typesense
    const searchResults = await client
      .collections(collection_name)
      .documents()
      .search({
        q: q || "*",
        query_by: queryBy,
        prefix: true,
        num_typos: 1,
        prioritize_exact_match: true,
        sort_by: "_text_match:desc",
        per_page: 10,
      });

    res.json({
      hits: searchResults.hits || [],
      mainField: main_field,
      found: searchResults.found,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;