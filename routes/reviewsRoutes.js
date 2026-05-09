import express from "express";
import {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewsController.js";
import { authenticateUser, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/:id", getReviewById);
router.post(
  "/",
  authenticateUser,
  authorize("review", "createOwn"),
  createReview,
);
router.put(
  "/:id",
  authenticateUser,
  authorize("review", "updateOwn"),
  updateReview,
);
router.delete(
  "/:id",
  authenticateUser,
  authorize("review", "deleteOwn"),
  deleteReview,
);

export default router;
