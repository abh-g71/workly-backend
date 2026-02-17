import express from "express";
import Job from "../models/jobModel.js";
import { protect } from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Create Job (Client only)
router.post(
  "/create",
  protect,
  authorizeRoles("client"),
  async (req, res) => {
    try {
      const { title, description, requiredSkills, location, budget } = req.body;

      const job = await Job.create({
        client: req.user._id,
        title,
        description,
        requiredSkills,
        location,
        budget,
      });

      res.status(201).json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Get All Open Jobs (Worker only)
router.get(
  "/open",
  protect,
  authorizeRoles("worker"),
  async (req, res) => {
    const jobs = await Job.find({ status: "OPEN" }).populate(
      "client",
      "name phone"
    );

    res.json(jobs);
  }
);

// Worker Apply to Job
router.post(
  "/apply/:jobId",
  protect,
  authorizeRoles("worker"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.status !== "OPEN") {
        return res.status(400).json({ message: "Job is not open" });
      }

      // Ensure applications array exists (important for old jobs)
      if (!job.applications) {
  job.applications = [];
}

const alreadyApplied = job.applications.find(
  (app) => app.worker.equals(req.user._id)
);

if (alreadyApplied) {
  return res.status(400).json({ message: "Already applied to this job" });
}

      job.applications.push({
        worker: req.user._id,
      });

      await job.save();

      res.json({ message: "Application submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/:jobId/accept/:workerId",
  protect,
  authorizeRoles("client"),
  async (req, res) => {
    try {
      const { jobId, workerId } = req.params;

      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Only job owner can accept
      if (!job.client.equals(req.user.id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Job must be OPEN
      if (job.status !== "OPEN") {
        return res.status(400).json({ message: "Job is not open" });
      }

      // Check if worker applied
      const hasApplied = job.applications.some(app =>
        app.worker.equals(workerId)
      );

      if (!hasApplied) {
        return res.status(400).json({ message: "Worker did not apply" });
      }
      job.applications = job.applications.filter(
        (app) => app.worker.equals(workerId)
      );

      job.status = "IN_PROGRESS";
      job.assignedWorker = workerId;

      await job.save();

      res.json({
        message: "Worker accepted successfully",
        job,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/:jobId/complete",
  protect,
  authorizeRoles("client"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Only job owner can complete
      if (!job.client.equals(req.user._id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (job.status !== "IN_PROGRESS") {
        return res.status(400).json({
          message: "Only in-progress jobs can be completed",
        });
      }

      job.status = "COMPLETED";
      await job.save();

      res.json({
        message: "Job marked as completed",
        job,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/my-jobs",
  protect,
  authorizeRoles("worker"),
  async (req, res) => {
    try {
      const filter = {
        assignedWorker: req.user._id,
      };

      if (req.query.status) {
        filter.status = req.query.status;
      }

      const jobs = await Job.find(filter);

      res.json({
        count: jobs.length,
        jobs,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.put(
  "/:jobId/rate",
  protect,
  authorizeRoles("client"),
  async (req, res) => {
    try {
      const { rating } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }

      const job = await Job.findById(req.params.jobId);

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Only job owner can rate
      if (!job.client.equals(req.user._id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Job must be completed
      if (job.status !== "COMPLETED") {
        return res.status(400).json({ message: "Job not completed yet" });
      }

      // Prevent double rating
      if (job.isRated) {
        return res.status(400).json({ message: "Job already rated" });
      }

      // Update worker rating
      const worker = await User.findById(job.assignedWorker);

      worker.totalRating += rating;
      worker.ratingCount += 1;
      worker.rating = worker.totalRating / worker.ratingCount;

      await worker.save();

      job.isRated = true;
      await job.save();

      res.json({ message: "Worker rated successfully", worker });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);



export default router;
