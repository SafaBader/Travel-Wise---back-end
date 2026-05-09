import Plan from "../models/plansModel.js";

export const getUserPlans = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const targetUser =
      req.user.role === "admin" && req.query.userId ? req.query.userId : userId;
    const plans = await Plan.find({ user: targetUser }).populate("places");
    if (!plans || plans.length === 0) {
      return res.status(404).json({ message: "No plans found." });
    }
    res.json(plans);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching plans",
      error: error.message,
    });
  }
};

export const createPlan = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const targetUser =
      req.user.role === "admin" && req.body.user ? req.body.user : userId;
    const plan = await Plan.create({ ...req.body, user: targetUser });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({
      message: "Error creating plan",
      error: error.message,
    });
  }
};

export const addPlaceToPlan = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { planId } = req.params;
    const { placeId } = req.body;
    const query = { _id: planId };
    if (req.user.role !== "admin") {
      query.user = userId;
    }
    const plan = await Plan.findOne(query);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    if (plan.places.includes(placeId)) {
      return res.status(400).json({ message: "Place already in plan" });
    }
    plan.places.push(placeId);
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message: "Error adding place to plan",
      error: error.message,
    });
  }
};

export const removePlaceFromPlan = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const { planId } = req.params;
    const { placeId } = req.body;
    const query = { _id: planId };
    if (req.user.role !== "admin") {
      query.user = userId;
    }
    const plan = await Plan.findOne(query);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    plan.places = plan.places.filter(
      (id) => id.toString() !== placeId.toString(),
    );
    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({
      message: "Error removing place from plan",
      error: error.message,
    });
  }
};

export const deletePlan = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const query = { _id: req.params.planId };
    if (req.user.role !== "admin") {
      query.user = userId;
    }
    const deletedPlan = await Plan.findOneAndDelete(query);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({
      message: "Plan deleted successfully",
      plan: deletedPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting plan",
      error: error.message,
    });
  }
};
