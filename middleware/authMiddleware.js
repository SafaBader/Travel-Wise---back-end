import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ac from "../config/rbac.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";
const JWT_EXPIRES_IN = "1h";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role || "user",
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
};

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { ...decoded, role: decoded.role || "user" };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const authorize = (resource, action) => {
  return (req, res, next) => {
    const role = req.user?.role || "user";
    const permission = ac.can(role)[action](resource);

    if (!permission.granted) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions.",
      });
    }

    req.permission = permission;
    next();
  };
};

export const authorizeOwn = (resource, action, getOwnerId) => {
  return (req, res, next) => {
    const role = req.user?.role || "user";
    const permission = ac.can(role)[action](resource);

    if (!permission.granted) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions.",
      });
    }

    // If admin, allow access to any resource
    if (role === "admin") {
      req.permission = permission;
      return next();
    }

    // For users, check ownership
    const resourceOwnerId = getOwnerId(req);
    if (resourceOwnerId !== req.user.id) {
      return res.status(403).json({
        message: "Access denied: you can only access your own resources.",
      });
    }

    req.permission = permission;
    next();
  };
};
