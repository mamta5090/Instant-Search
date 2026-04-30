import express from "express";
import { client } from "../config/typesense.js";
import { importProduct, saveProduct } from "../controllers/searchHistory.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    const results = await client
      .collections("products")
      .documents()
      .search({
        q: q || "*",
        query_by: "name,slug",
        prefix: true,
        num_typos: 2,
        prioritize_exact_match: true,
        sort_by: "_text_match:desc,sales:desc",
        per_page: 10,
      });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/manual",saveProduct);
router.post("/import",importProduct);
export default router;
