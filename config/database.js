import mongoose from "mongoose";

export async function connectToDatabase() {
    try {
        const uri = process.env.MONGODB_URI;

        await mongoose.connect(uri);

        console.log("Connected to MongoDB");
        return mongoose.connection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

export async function getDatabase() {
    return mongoose.connection;
}