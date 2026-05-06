import express from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getReviewById);
router.post("/", authenticateUser, createReview);
router.put("/:id", authenticateUser, updateReview);
router.delete("/:id", authenticateUser, deleteReview);

export default router;
