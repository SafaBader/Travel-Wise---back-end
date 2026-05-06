import Favourite from "../models/favouritesModel.js";

export const addFavourite = async (req, res) => {
  const { placeId } = req.body;
  const userId = req.user.id;

  try {
    if (!placeId || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const existingFavourite = await Favourite.findOne({
      user: userId,
      place: placeId,
    });
    if (existingFavourite) {
      return res
        .status(400)
        .json({ message: "Place is already in favourites." });
    }
    const favourite = new Favourite({
      user: userId,
      place: placeId,
    });
    await favourite.save();
    res.status(201).json(favourite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removeFavourite = async (req, res) => {
  const { placeId } = req.body;
  const userId = req.user.id;

  try {
    if (!placeId || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const existingFavourite = await Favourite.findOne({
      user: userId,
      place: placeId,
    });
    if (!existingFavourite) {
      return res.status(400).json({ message: "Place is not in favourites." });
    }
    const favourite = await Favourite.findOneAndDelete({
      user: userId,
      place: placeId,
    });
    if (!favourite) {
      return res.status(404).json({ message: "Favourite not found." });
    }
    res.json({ message: "Favourite removed successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getFavourites = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "Missing required fields." });
  }
  try {
    const haveFavourites = await Favourite.find({ user: userId });
    if (haveFavourites.length === 0) {
      return res.json({ message: "No favourites found." });
    }
    const favourites = await Favourite.find({ user: userId }).populate("place");
    res.json(favourites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
