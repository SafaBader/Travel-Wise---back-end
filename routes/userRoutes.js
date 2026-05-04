import express from "express";
import {
  getUsers,
  userLogin,
  createUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/login", userLogin);
router.post("/register", createUser);

export default router;
