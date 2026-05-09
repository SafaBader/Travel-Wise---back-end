import express from "express";
import {
  getUsers,
  getCurrentUser,
  updateCurrentUser,
  userLogin,
  createUser,
} from "../controllers/userController.js";
import { authenticateUser, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, authorize("user", "readAny"), getUsers);
router.get("/me", authenticateUser, getCurrentUser);
router.patch("/me", authenticateUser, updateCurrentUser);
router.post("/login", userLogin);
router.post("/register", createUser);

export default router;
