import express from "express";
import { login, register } from "../controllers/auth.controller.js";

const router = express.Router();

// Debug: Log route creation
console.log("Creating auth routes...");

// Add a simple test route first
router.get("/test", (req, res) => {
    console.log("GET /api/auth/test - Request received");
    res.json({ message: "Auth routes are working!" });
});

// Register a new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

console.log("Auth routes created successfully");
export default router;
