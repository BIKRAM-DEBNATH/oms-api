import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employee.js";
import taskRoutes from "./routes/task.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import settingsRoutes from "./routes/settings.js"; // ✅ Settings route

dotenv.config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "https://office-management-system-nm7ffebhv.vercel.app",   // Production
  "https://office-management-system-980wqmcx8.vercel.app",  // Current preview
  "https://office-managem-git-41ceee-bikramdebnath907yt-gmailcoms-projects.vercel.app/",
  "https://office-management-system-hqnmb9c7h.vercel.app ",
  "http://localhost:5173"
];

// ✅ Log request origins for debugging
app.use((req, res, next) => {
  console.log("🌐 Request Origin:", req.headers.origin || "No Origin (maybe server-side or Postman)");
  next();
});

// ✅ CORS configuration with debug logging
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests globally
app.options("*", cors());

// ✅ JSON parsing
app.use(express.json());

// ✅ MongoDB connection
const mongoURI = process.env.MONGO_URL;
if (!mongoURI) {
  console.error("❌ MONGO_URL not found in .env");
  process.exit(1);
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// ✅ API Routes
app.use("/api/auth", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/admin", settingsRoutes); // ✅ Mounts routes for /api/admin/settings

// ✅ Root health check
app.get("/", (req, res) => {
  res.send("🚀 Office Management System Backend is Running");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
