import express from "express";
import {
  getUsers,
  getCurrentUser,
  updateCurrentUser,
  userLogin,
  createUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", authenticateUser, getCurrentUser);
router.patch("/me", authenticateUser, updateCurrentUser);
router.post("/login", userLogin);
router.post("/register", createUser);

export default router;
