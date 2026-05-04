import Review from "../models/reviewsModel.js";

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("userId", "name")
      .populate("placeId", "title");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "name")
      .populate("placeId", "title");
    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching review",
      error: error.message,
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { placeId, userId, rating, comment } = req.body;
    if (!placeId || !userId || rating === undefined) {
      return res.status(400).json({
        message: "Place ID, User ID, and Rating are required.",
      });
    }
    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 0 and 5.",
      });
    }
    const existingReview = await Review.findOne({ placeId, userId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this place.",
      });
    }
    const newReview = new Review({ placeId, userId, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({
      message: "Error creating review",
      error: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );
    if (!updatedReview) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }
    res.json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating review",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }
    res.json({
      message: "Review deleted successfully.",
      review: deletedReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting review",
      error: error.message,
    });
  }
};
