import express from "express"
import dotenv from "dotenv";
import db_connect from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

console.log("AuthRoutes imported:", authRoutes);

const app = express();
dotenv.config();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug: Log route registration
console.log("Registering auth routes...");
console.log("AuthRoutes type:", typeof authRoutes);
console.log("AuthRoutes methods:", Object.getOwnPropertyNames(authRoutes));

app.use("/api/auth", authRoutes);
console.log("Auth routes registered successfully");

// Add a test route to verify server is working
app.get("/", (req, res) => {
    res.json({ message: "Server is running!", timestamp: new Date().toISOString() });
});

// Debug: Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

db_connect();


const PORT = 3000; // Using port 3000 as specified in .env


app.listen(PORT , ()=>{
    console.log(`server is running on the port - ${PORT}`);

})






