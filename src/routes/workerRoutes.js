import express from "express";
import Worker from "../models/workerModel.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create Worker Profile
router.post(
  "/create",
  protect,
  authorizeRoles("worker"),
  async (req, res) => {
    try {
      const { skills, experience, location, hourlyRate } = req.body;

      const existingProfile = await Worker.findOne({
        user: req.user._id,
      });

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

      if (hourlyRate <= 0) {
        return res.status(400).json({
          message: "Hourly rate must be greater than 0",
        });
      }

      const worker = await Worker.create({
        user: req.user._id,
        skills: skills.map((s) => s.toLowerCase().trim()),
        experience,
        location,
        hourlyRate,
      });

      res.status(201).json({
        message: "Worker profile created successfully",
        worker,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Get All Workers (Client Only)
router.get(
  "/all",
  protect,
  authorizeRoles("client"),
  async (req, res) => {
    try {
      const workers = await Worker.find().populate(
        "user",
        "name phone"
      );

      res.json(workers);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Get My Worker Profile
router.get(
  "/me",
  protect,
  authorizeRoles("worker"),
  async (req, res) => {
    try {
      const profile = await Worker.findOne({
        user: req.user._id,
      }).populate("user", "name phone");

      res.json({
        hasProfile: !!profile,
        profile,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Update Worker Profile
router.put(
  "/update",
  protect,
  authorizeRoles("worker"),
  async (req, res) => {
    try {
      const { skills, experience, location, hourlyRate } = req.body;

      const profile = await Worker.findOne({
        user: req.user._id,
      });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      if (skills) {
        profile.skills = skills.map((s) =>
          s.toLowerCase().trim()
        );
      }

      if (experience !== undefined) {
        profile.experience = experience;
      }

      if (location !== undefined) {
        profile.location = location;
      }

      if (hourlyRate !== undefined) {
        if (hourlyRate <= 0) {
          return res.status(400).json({
            message: "Hourly rate must be greater than 0",
          });
        }

        profile.hourlyRate = hourlyRate;
      }

      await profile.save();

      res.json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

export default router;