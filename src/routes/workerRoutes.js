import express from "express";
import Worker from "../models/workerModel.js";
import { protect } from "../middleware/authMiddleware.js";

import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create Worker Profile (only worker role)
router.post(
  "/create",
  protect,
  authorizeRoles("worker"),
  async (req, res) => {
    try {
      const { skills, experience, location, hourlyRate } = req.body;

      // Check if worker profile already exists
      const existingProfile = await Worker.findOne({ user: req.user._id });

      if (existingProfile) {
        return res.status(400).json({
          message: "Worker profile already exists",
        });
      }

      if (!skills || !experience || !location || !hourlyRate) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const worker = await Worker.create({
        user: req.user._id,
        skills,
        experience,
        location,
        hourlyRate,
      });

      res.status(201).json({
        message: "Worker profile created successfully",
        worker,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get all workers (only client can see)
router.get(
  "/all",
  protect,
  authorizeRoles("client"),
  async (req, res) => {
    const workers = await Worker.find().populate("user", "name phone");
    res.json(workers);
  }
);

export default router;
