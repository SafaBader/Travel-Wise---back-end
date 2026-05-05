import express from "express";
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placesController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPlaces);
router.get("/:id", getPlaceById);
router.post("/", authenticateUser, createPlace); // protected
router.put("/:id", authenticateUser, updatePlace); // protected
router.delete("/:id", authenticateUser, deletePlace); // protected

export default router;
