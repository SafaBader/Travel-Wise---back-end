import express from "express";
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/placesController.js";
import { authenticateUser, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPlaces);
router.get("/:id", getPlaceById);
router.post(
  "/",
  authenticateUser,
  authorize("place", "createAny"),
  createPlace,
);
router.put(
  "/:id",
  authenticateUser,
  authorize("place", "updateAny"),
  updatePlace,
);
router.delete(
  "/:id",
  authenticateUser,
  authorize("place", "deleteAny"),
  deletePlace,
);

export default router;
