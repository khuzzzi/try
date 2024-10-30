import { model, Schema, models } from "mongoose";
import mongoose from "mongoose";

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDateTime: {
        type: Date,
        default: Date.now,
    },
    price: {
        type: String,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    url: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId, // Use String if you're not using ObjectId
        ref: "User",
        required: true, 
    },
}, { timestamps: true });

const Event = models.Event || model('Event', eventSchema);
export default Event;
