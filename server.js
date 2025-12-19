import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db_connect from "./config/db.js";

// Routes imports
import authRoutes from "./routes/auth.routes.js";
import clubRoutes from "./routes/club.routes.js";
import bookRoutes from "./routes/book.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import readingProgressRoutes from "./routes/readingProgress.routes.js";
import quoteRoutes from "./routes/quote.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Route Registration
app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/meetings", meetingRoutes); // Spec says meetings, ensure route matches
app.use("/api/votes", voteRoutes); // Spec says /api/votes
app.use("/api/reading-progress", readingProgressRoutes);
app.use("/api/quotes", quoteRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({ success: true, message: "BookCircle API is running" });
});

// Database Connection
db_connect();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







