import Review from "../models/reviewsModel.js";
import Place from "../models/placesModel.js";

async function syncPlaceReviewCount(placeId) {
  const count = await Review.countDocuments({ placeId });
  await Place.findByIdAndUpdate(placeId, { reviewCount: count }, { new: true });
  return count;
}

export const getReviews = async (req, res) => {
  try {
    const filter = req.query.placeId ? { placeId: req.query.placeId } : {};
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "name")
      .populate("placeId", "title reviewCount");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "name")
      .populate("placeId", "title reviewCount");
    if (!review) return res.status(404).json({ message: "Review not found." });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { placeId, rating, comment } = req.body;
    const userId = req.user.id;
    if (!placeId || !userId || rating === undefined) {
      return res.status(400).json({
        message: "Place ID, User ID, and Rating are required.",
      });
    }
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5." });
    }

    const review = await Review.create({ placeId, userId, rating, comment });
    const reviewCount = await syncPlaceReviewCount(placeId);
    const populated = await Review.findById(review._id).populate("userId", "name").populate("placeId", "title reviewCount");
    res.status(201).json({ review: populated, reviewCount });
  } catch (error) {
    res.status(400).json({ message: "Error creating review", error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updateData = {};
    if (rating !== undefined) {
      if (rating < 0 || rating > 5) return res.status(400).json({ message: "Rating must be between 0 and 5." });
      updateData.rating = rating;
    }
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true, runValidators: true },
    ).populate("userId", "name").populate("placeId", "title reviewCount");

    if (!updatedReview) return res.status(404).json({ message: "Review not found or not yours." });
    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    res.status(400).json({ message: "Error updating review", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedReview) return res.status(404).json({ message: "Review not found or not yours." });
    const reviewCount = await syncPlaceReviewCount(deletedReview.placeId);
    res.json({ message: "Review deleted successfully.", review: deletedReview, reviewCount });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};
