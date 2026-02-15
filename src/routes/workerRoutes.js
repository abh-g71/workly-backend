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

      const worker = await Worker.create({
        user: req.user._id,
        skills,
        experience,
        location,
        hourlyRate,
      });

      res.status(201).json(worker);
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
