import express from "express";
import {
  getClubs,
  getMyClubs,
  createClub,
  getClubById,
  updateClub,
  joinClub,
  leaveClub,
  updateCurrentBook
} from "../controllers/club.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getClubs);
router.get("/my-clubs", protect, getMyClubs);
router.post("/", protect, createClub);
router.get("/:id", getClubById); // Could be protected or public? Prompt doesn't specify auth for getById, but logically public.
router.put("/:id", protect, updateClub);
router.post("/:id/join", protect, joinClub);
router.post("/:id/leave", protect, leaveClub);
router.put("/:id/current-book", protect, updateCurrentBook);

export default router;
