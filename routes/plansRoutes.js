import express from "express";
import {
  getUserPlans,
  createPlan,
  addPlaceToPlan,
  removePlaceFromPlan,
  deletePlan,
} from "../controllers/plansController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getUserPlans);
router.post("/", authenticateUser, createPlan);
router.post("/plan/:planId", authenticateUser, addPlaceToPlan);
router.delete("/plan/:planId", authenticateUser, removePlaceFromPlan);
router.delete("/plan/:planId", authenticateUser, deletePlan);

export default router;
