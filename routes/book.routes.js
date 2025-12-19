import express from "express";
import { getBooks, createBook, getBookById, rateBook } from "../controllers/book.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.post("/", protect, createBook); // Assuming creating books requires auth
router.get("/:id", getBookById);
router.post("/:id/rate", protect, rateBook);

export default router;
