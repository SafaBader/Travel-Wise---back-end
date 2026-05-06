import Trip from "../models/tripsModel.js";

const toDateOnly = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const daysBetweenInclusive = (start, end) => {
  const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const normalizeActivity = (activity, index) => ({
  _id: activity._id || activity.id,
  place: activity.place?._id || activity.place?.id || activity.place_id || activity.place,
  orderIndex: activity.orderIndex ?? activity.order_index ?? index,
  notes: activity.notes || "",
});

const normalizeDay = (day, index, startDate) => ({
  _id: day._id || day.id,
  dayNumber: day.dayNumber ?? day.day_number ?? index + 1,
  date: toDateOnly(day.date) || (startDate ? addDays(startDate, index) : undefined),
  startHour: Number(day.startHour ?? day.start_hour ?? 8),
  endHour: Number(day.endHour ?? day.end_hour ?? 20),
  activities: (day.activities || [])
    .filter((activity) => activity.place || activity.place_id)
    .map(normalizeActivity),
});

const buildDefaultDays = (startDate, endDate) => {
  const count = daysBetweenInclusive(startDate, endDate);
  return Array.from({ length: count }, (_, index) => ({
    dayNumber: index + 1,
    date: addDays(startDate, index),
    startHour: 8,
    endHour: 20,
    activities: [],
  }));
};

const buildTripPayload = (body, existingTrip = null) => {
  const startDate = toDateOnly(body.startDate || body.start_date) || existingTrip?.startDate;
  const endDate = toDateOnly(body.endDate || body.end_date) || existingTrip?.endDate;

  const payload = {
    title: body.title,
    destination: body.destination,
    destinationCity: body.destinationCity ?? body.destination_city,
    destinationCountry: body.destinationCountry ?? body.destination_country,
    description: body.description,
    startDate,
    endDate,
    coverImage: body.coverImage ?? body.cover_image,
    status: body.status,
  };

  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

  if (Array.isArray(body.days)) {
    payload.days = body.days.map((day, index) => normalizeDay(day, index, startDate));
  } else if (!existingTrip && startDate && endDate) {
    payload.days = buildDefaultDays(startDate, endDate);
  }

  return payload;
};

const populateTrip = (query) => query.populate({ path: "days.activities.place", model: "Place" });

export const getUserTrips = async (req, res) => {
  try {
    const trips = await populateTrip(Trip.find({ user: req.user.id }).sort({ createdAt: -1 }));
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips", error: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await populateTrip(Trip.findOne({ _id: req.params.id, user: req.user.id }));
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trip", error: error.message });
  }
};

export const createTrip = async (req, res) => {
  try {
    const payload = buildTripPayload(req.body);
    if (!payload.destination || !payload.startDate || !payload.endDate) {
      return res.status(400).json({ message: "Destination, start date, and end date are required." });
    }
    if (!payload.title) payload.title = `${payload.destination} Trip`;
    if (payload.endDate < payload.startDate) {
      return res.status(400).json({ message: "End date must be after start date." });
    }
    const trip = await Trip.create({ ...payload, user: req.user.id });
    const populated = await populateTrip(Trip.findById(trip._id));
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: "Error creating trip", error: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const existingTrip = await Trip.findOne({ _id: req.params.id, user: req.user.id });
    if (!existingTrip) return res.status(404).json({ message: "Trip not found" });

    const payload = buildTripPayload(req.body, existingTrip);
    if (payload.startDate && payload.endDate && payload.endDate < payload.startDate) {
      return res.status(400).json({ message: "End date must be after start date." });
    }

    Object.assign(existingTrip, payload);
    await existingTrip.save();
    const updated = await populateTrip(Trip.findById(existingTrip._id));
    res.json({ message: "Trip updated successfully", trip: updated });
  } catch (error) {
    res.status(400).json({ message: "Error updating trip", error: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedTrip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted successfully", trip: deletedTrip });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trip", error: error.message });
  }
};
