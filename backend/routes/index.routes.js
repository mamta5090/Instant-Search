import express from "express";
import { createIndex, getIndexes, deleteIndex } from "../controllers/index.controller.js";

const router = express.Router();

router.post("/", createIndex);
router.get("/", getIndexes);
router.delete("/:id", deleteIndex);

export default router;