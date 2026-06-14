import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import http from "http";
import { Server } from "socket.io";



dotenv.config();

const app = express();

//Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/workers", workerRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/notifications", notificationRoutes);

app.set("trust proxy", 1);

//Test Route
app.get("/", (req, res) => {
  res.json({ message: "Workly API running 🚀" });
});

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
      },
    });

    // attach io to app
    app.set("io", io);

    io.on("connection", (socket) => {
      console.log("🔌 New client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

  }) // ✅ THIS WAS MISSING
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err);
  });
  