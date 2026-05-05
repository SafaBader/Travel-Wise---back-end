import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database.js";
import placeRoutes from "./routes/placesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewsRoutes.js";
import favouritesRoutes from "./routes/favouritesRoutes.js";
import plansRoutes from "./routes/plansRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
// app.use(logger);

// routes
app.use("/places", placeRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/favourites", favouritesRoutes);
app.use("/plans", plansRoutes);

try {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`server connecting to ${PORT}`);
  });
} catch (error) {
  console.error("failed to connect to db ", error);
  process.exit(1);
}
