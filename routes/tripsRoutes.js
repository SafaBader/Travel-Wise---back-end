import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from "../controllers/tripsController.js";

const router = express.Router();
router.use(authenticateUser);

router.get("/", getUserTrips);
router.get("/:id", getTripById);
router.post("/", createTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
