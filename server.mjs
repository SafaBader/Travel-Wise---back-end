import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from "./config/database.js";
import placeRoutes from './routes/placesRoutes.js';
import cors from 'cors';

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
app.use("/places", placeRoutes);
// app.use("/places", autenticateUser, placeRoutes);

try {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`server connecting to ${PORT}`);
    });
} catch (error) {
    console.error("failed to connect to db ", error);
    process.exit(1);
}
