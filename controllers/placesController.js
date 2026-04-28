import Place from '../models/placesModel.js';

export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find({});
    res.json(places);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching places",
      error: error.message
    });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({
        message: 'Place not found.'
      });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching place",
      error: error.message
    });
  }
};


export const createPlace = async (req, res) => {
  try {
    const data = req.body;

    // --------------------------------------------------
    // Helper function:
    // This function checks if one place has all required fields
    // --------------------------------------------------
    const validatePlace = (place) => {
      const {
        title,
        city,
        country,
        category,
        rating,
        description,
        image,
        openingHours,
        location,
      } = place;

      if (
        !title ||
        !city ||
        !country ||
        !category ||
        rating === undefined ||
        !description ||
        !image ||
        !openingHours ||
        !location
      ) {
        return false;
      }

      return true;
    };

    // --------------------------------------------------
    // Helper function:
    // This builds the duplicate-check query
    // We consider a place duplicate if it has the same:
    // title + city + country + location
    // --------------------------------------------------
    const buildDuplicateQuery = (place) => {
      return {
        title: place.title,
        city: place.city,
        country: place.country,
        location: place.location,
      };
    };

    // ==================================================
    // CASE 1: Create many places
    // Body example:
    // [
    //   { title: "Central Park", city: "New York", ... },
    //   { title: "Halal Guys", city: "New York", ... }
    // ]
    // ==================================================
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(400).json({
          message: "You must send at least one place.",
        });
      }

      // Validate every place in the array
      const invalidPlace = data.find((place) => !validatePlace(place));

      if (invalidPlace) {
        return res.status(400).json({
          message: "All required fields must be provided for every place.",
          invalidPlace,
        });
      }

      // We will store only the places that do not already exist
      const placesToInsert = [];

      // We will store duplicates here, so we can tell the user what was skipped
      const skippedPlaces = [];

      // Check each place one by one
      for (const place of data) {
        const existingPlace = await Place.findOne(buildDuplicateQuery(place));

        if (existingPlace) {
          // If it already exists, do not add it to placesToInsert
          skippedPlaces.push({
            reason: "Place already exists",
            place,
          });
        } else {
          // If it does not exist, prepare it for insertMany
          placesToInsert.push(place);
        }
      }

      // If all places already exist, do not call insertMany
      if (placesToInsert.length === 0) {
        return res.status(409).json({
          message: "No new places were created. All places already exist.",
          insertedCount: 0,
          skippedCount: skippedPlaces.length,
          skippedPlaces,
        });
      }

      // Insert only the new places
      const createdPlaces = await Place.insertMany(placesToInsert);

      return res.status(201).json({
        message: "Places created successfully.",
        insertedCount: createdPlaces.length,
        skippedCount: skippedPlaces.length,
        places: createdPlaces,
        skippedPlaces,
      });
    }

    // ==================================================
    // CASE 2: Create one place
    // Body example:
    // { title: "Halal Guys", city: "New York", ... }
    // ==================================================

    if (!validatePlace(data)) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const existingPlace = await Place.findOne(buildDuplicateQuery(data));

    if (existingPlace) {
      return res.status(409).json({
        message: "This place already exists.",
        place: existingPlace,
      });
    }

    const place = await Place.create(data);

    return res.status(201).json({
      message: "Place created successfully.",
      place,
    });
  } catch (error) {
    // Duplicate key error from MongoDB unique index
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate place detected.",
        error: error.message,
      });
    }

    return res.status(400).json({
      message: "Error creating place.",
      error: error.message,
    });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const placeId = req.params.id;
    const { title, city, country, category, rating, description, image, openingHours, location, reviewCount, estimatedVisitTime, tags } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (category !== undefined) updateData.category = category;
    if (rating !== undefined) updateData.rating = rating;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (openingHours !== undefined) updateData.openingHours = openingHours;
    if (location !== undefined) updateData.location = location;
    if (reviewCount !== undefined) updateData.reviewCount = reviewCount;
    if (estimatedVisitTime !== undefined) updateData.estimatedVisitTime = estimatedVisitTime;
    if (tags !== undefined) updateData.tags = tags;

    const updatedPlace = await Place.findByIdAndUpdate(
      placeId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPlace) {
      return res.status(404).json({
        message: 'Place not found.'
      });
    }
    res.json({
      message: "Place updated successfully",
      place: updatedPlace
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating place",
      error: error.message
    });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) {
      return res.status(404).json({
        message: 'Place not found.'
      });
    }
    res.json({
      message: 'Place deleted successfully.',
      place: deletedPlace
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting place",
      error: error.message
    });
  }
};

