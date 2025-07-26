import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employee.js";
import taskRoutes from "./routes/task.js";
import leaveRoutes from "./routes/leaveRoutes.js";

dotenv.config();

const app = express();

// ✅ Allow only your hosted frontend (no local/dev URLs)
const allowedOrigin = "https://office-management-system-lnqn84qu4.vercel.app";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
    process.exit(1); // Exit to avoid running server without DB
  });

// ✅ Routes
app.use("/api/auth", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leaveRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🚀 Office Management System Backend is Running");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
