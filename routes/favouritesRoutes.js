import express from "express";
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/favouritesController.js";
import { authenticateUser, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  authorize("favourite", "readOwn"),
  getFavourites,
);
router.post(
  "/",
  authenticateUser,
  authorize("favourite", "createOwn"),
  addFavourite,
);
router.delete(
  "/",
  authenticateUser,
  authorize("favourite", "deleteOwn"),
  removeFavourite,
);

export default router;
