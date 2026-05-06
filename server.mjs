import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database.js";
import placeRoutes from './routes/placesRoutes.js';
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewsRoutes.js";
import favouritesRoutes from "./routes/favouritesRoutes.js";
import tripsRoutes from "./routes/tripsRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// allow frontend requests
// app.use(cors({
//   origin: 'http://localhost:5173',
// }));
app.use(cors());
// middleware
app.use(express.json());
// app.use(logger);

// routes
app.get("/", (req, res) => {
  res.send("Welcome to the Travel Planner API");
});
app.use("/places", placeRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);
app.use("/favourites", favouritesRoutes);
app.use("/trips", tripsRoutes);
app.use("/plans", tripsRoutes); //
try {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`server connecting to ${PORT}`);
  });
} catch (error) {
  console.error("failed to connect to db ", error);
  process.exit(1);
}
