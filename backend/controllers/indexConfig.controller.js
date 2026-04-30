import db from "../config/db.js";
import { client } from "../config/typesense.js";

export const configureIndex = async (req, res) => {
  try {
    const { indexId } = req.params;
    const { searchable_fields, main_field, data } = req.body;

    // 🔴 Validate input
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    // 🟢 Update DB
    const result = await db.query(
      `UPDATE indexes
       SET searchable_fields = $1::jsonb,
           main_field = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [JSON.stringify(searchable_fields), main_field, indexId],
    );
    const index = result.rows[0];

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Index not found" });
    }

    const collectionName = index.collection_name;

    // 🟢 Generate schema
    const sample = data[0];

    const fields = Object.keys(sample).map((key) => {
      const value = sample[key];

      let type = "string";
      if (typeof value === "number") type = "float";
      if (typeof value === "boolean") type = "bool";

      // Typesense requires fields in query_by to be strings.
      if (searchable_fields.includes(key)) {
        type = "string";
      }

      return { name: key, type };
    });

    // ensure id field exists
    fields.push({ name: "id", type: "string" });

    // 🟢 Create collection (delete if exists for now)
    try {
      await client.collections(collectionName).delete();
    } catch {}

    await client.collections().create({
      name: collectionName,
      fields,
    });

    // 🟢 Format data
    const formatted = data.map((item, index) => {
      const formattedItem = { ...item, id: String(item.id || index + 1) };

      // Ensure searchable fields are cast to strings for Typesense
      for (const field of searchable_fields) {
        if (
          formattedItem[field] !== undefined &&
          formattedItem[field] !== null
        ) {
          formattedItem[field] = String(formattedItem[field]);
        }
      }

      return formattedItem;
    });

    // 🟢 Insert documents
    await client
      .collections(collectionName)
      .documents()
      .import(formatted, { action: "upsert" });

    // 🟢 Save raw documents in DB
    for (const item of data) {
      try {
        await db.query(
          `INSERT INTO documents (index_id, user_id, data)
       VALUES ($1, $2, $3::jsonb)`,
          [indexId, index.user_id, JSON.stringify(item)],
        );
      } catch (docErr) {
        console.error("Error inserting document:", docErr.message);
        // Continue with next document instead of failing entire operation
      }
    }

    res.json({
      message: "Index configured successfully",
      index,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
