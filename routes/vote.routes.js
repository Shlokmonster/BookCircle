import express from "express";
import { getVotes, createVote, castVote, getVoteResults } from "../controllers/vote.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVotes); // Maybe protected or public?
router.post("/", protect, createVote);
router.post("/:id/vote", protect, castVote);
router.get("/:id/results", getVoteResults);

export default router;
