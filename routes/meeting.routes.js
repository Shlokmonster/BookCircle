import express from "express";
import { getMeetings, createMeeting, rsvpMeeting } from "../controllers/meeting.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getMeetings);
router.post("/", protect, createMeeting);
router.post("/:id/rsvp", protect, rsvpMeeting);

export default router;
