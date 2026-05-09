import express from "express";
import {
  getUserPlans,
  createPlan,
  addPlaceToPlan,
  removePlaceFromPlan,
  deletePlan,
} from "../controllers/plansController.js";
import {
  authenticateUser,
  authorize,
  authorizeOwn,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, authorize("plan", "readOwn"), getUserPlans);
router.post("/", authenticateUser, authorize("plan", "createOwn"), createPlan);
router.post(
  "/plan/:planId",
  authenticateUser,
  authorize("plan", "updateOwn"),
  addPlaceToPlan,
);
router.delete(
  "/plan/:planId",
  authenticateUser,
  authorize("plan", "deleteOwn"),
  removePlaceFromPlan,
);
router.delete(
  "/plan/:planId",
  authenticateUser,
  authorize("plan", "deleteOwn"),
  deletePlan,
);

export default router;
