import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadAndExtractFields } from "../controllers/upload.controller.js";

const router = express.Router();

// POST /api/indexes/:indexId/upload
router.post("/:indexId/upload", upload.single("file"), uploadAndExtractFields);

export default router;