import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";


dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/workers", workerRoutes);

app.use("/api/jobs", jobRoutes);

//Test Route
app.get("/", (req, res) => {
  res.json({ message: "Workly API running 🚀" });
});

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅" );

    app.listen(process.env.PORT, () => {
      console.log(`Server running on PORT ${process.env.PORT} `);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed ❌", err);
  });