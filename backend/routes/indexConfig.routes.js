import express from "express";
import { configureIndex } from "../controllers/indexConfig.controller.js";

const router = express.Router();

// POST /api/indexes/:indexId/configure
router.post("/:indexId/configure", configureIndex);

export default router;