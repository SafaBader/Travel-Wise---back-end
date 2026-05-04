import express from "express";
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../controllers/favouritesController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authenticateUser);

router.get("/", authenticateUser, getFavourites);
router.post("/", authenticateUser, addFavourite);
router.delete("/", authenticateUser, removeFavourite);

export default router;
