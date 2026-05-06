import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  places: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true }],
  dateAdded: { type: Date, default: Date.now },
});

const Plan = mongoose.model("Plan", planSchema);
export default Plan;
