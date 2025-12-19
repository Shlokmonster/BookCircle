import express from "express";
import { logProgress, getMyProgress, updateProgress, addNote } from "../controllers/readingProgress.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, logProgress);
router.get("/", protect, getMyProgress);
router.put("/:id/progress", protect, updateProgress);
router.post("/:id/notes", protect, addNote);

export default router;
