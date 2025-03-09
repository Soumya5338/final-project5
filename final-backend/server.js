import express from "express";
import api from "./routes/index.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Load environment variables
dotenv.config();

// ✅ MongoDB connection setup using Mongoose
const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_PATH, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit process if DB connection fails
    }
};

// ✅ Connect to MongoDB
connectToDB();

// ✅ Server Configuration
const PORT = process.env.SERVER_PORT || 9004;
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

const app = express();

// ✅ CORS Setup (Allow All Origins for Debugging)
app.use(cors({ origin: "*", credentials: true }));

// ✅ Middleware for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root Route (For health check)
app.get("/", (req, res) => {
    console.log("📡 Received request at /");
    res.send("🚀 Welcome to the Project Management API!");
});

// ✅ Test API Route to Verify Backend Connection
app.get("/api/test", (req, res) => {
    console.log("📡 Received request at /api/test");
    res.json({ message: "✅ Backend is working!" });
});

// ✅ API Routes
app.use("/api", api);

// ✅ Handle 404 Errors (Unknown Routes)
app.use((req, res) => {
    console.log(`❌ Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: "❌ Route not found" });
});

// ✅ Start the Express Server
app.listen(PORT, () => {
    console.log(`🚀 Your app is running at http://localhost:${PORT}`);
});
