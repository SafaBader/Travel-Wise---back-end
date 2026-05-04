import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: [true, "Place ID is required."],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required."],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: [true, "Rating is required."],
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
