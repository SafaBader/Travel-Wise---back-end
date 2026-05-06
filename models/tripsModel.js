import mongoose from "mongoose";

const tripActivitySchema = new mongoose.Schema(
  {
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true
    },
    orderIndex: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true,
      default: ""
    },
  },
  { _id: true },
);

const tripDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true
    },
    date: {
      type: Date
    },
    startHour: {
      type: Number,
      min: 0,
      max: 23,
      default: 8
    },
    endHour: {
      type: Number,
      min: 1,
      max: 24,
      default: 20
    },
    activities: [tripActivitySchema],
  },
  { _id: true },
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    destinationCity: {
      type: String,
      trim: true,
      default: ""
    },
    destinationCountry: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    coverImage: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["planning", "upcoming", "ongoing", "completed"],
      default: "planning",
    },
    days: [tripDaySchema],
  },
  { timestamps: true },
);

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
