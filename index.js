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
  "https://office-management-system-lnqn84qu4.vercel.app",
  "https://office-management-system-rho.vercel.app",
  "https://office-management-system-e3e3eju1v.vercel.app",
  "http://localhost:5173"
];

// ✅ CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ JSON parsing
app.use(express.json());

// ✅ MongoDB connection
const mongoURI = process.env.MONGO_URL;
if (!mongoURI) {
  console.error("❌ MONGO_URL not found in .env");
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
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
