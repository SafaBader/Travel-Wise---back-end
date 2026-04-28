import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required."],
            trim: true
        },
        city: {
            type: String,
            required: [true, "City is required."],
            trim: true
        },
        country: {
            type: String,
            required: [true, "Country is required."],
            trim: true
        },
        category: {
            type: String,
            required: [true, "Category is required."],
            trim: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            required: [true, "Rating is required."],
        },
        reviewCount: {
            type: Number,
            min: 0,
            default: 0
        },
        description: {
            type: String,
            required: [true, "Description is required."],
            trim: true
        },
        image: {
            type: String,
            required: [true, "Image URL is required."],
        },
        openingHours: {
            type: String,
            required: [true, "Opening hours are required."],
            trim: true
        },
        location: {
            type: String,
            required: [true, "Location is required."],
            trim: true
        },
        estimatedVisitTime: {
            type: Number,
            default: 0
        },
        tags:
            [{ type: String }],
    },
    { timestamps: true },
);


const place = mongoose.model("Place", placeSchema);
export default place;
