"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "../mongodb/database"
import Category from "../mongodb/database/models/category.model"
import Event from "../mongodb/database/models/event.model"
import User from "../mongodb/database/models/user.model"



const populateEvent = (query) => {
    return query
        .populate({ path: 'organizer', model: User, select: '_id firstName lastName clerkId' })
        .populate({ path: 'category', model: Category, select: '_id name' })
}

export const createEvent = async ({ event, userId, path }) => {
    try {
        await connectToDatabase()
        const organizer = await User.findById(userId);
        if (!organizer) {
            throw new Error("organizer not found");
        }

        const newEvent = await Event.create({ ...event, category: event.category, organizer: userId })
        return JSON.parse(JSON.stringify(newEvent))


    } catch (error) {
        console.log(error)
    }
}

export const getEventById = async (eventId) => {
    try {
        const event = await Event.findById(eventId)
            .populate({
                path: "organizer",
                select: "_id firstName"
            })
            .populate({
                path: "category",
                select: "_id name"
            })
        if (!event) {
            throw new Error("event not found")
        }
        return JSON.parse(JSON.stringify(event))


    } catch (error) {
        console.log(error)
    }
}

export const getAllEvents = async ({ query, limit = 6, page, category }) => {
    await connectToDatabase();

    const conditions = {};
    const eventsQuery = Event.find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(0)
        .limit(limit);

    const events = await populateEvent(eventsQuery);
    // Return only the events array
    return JSON.parse(JSON.stringify(events));
};

export const deleteEvent = async ({ eventId, path }) => {
    await connectToDatabase()

    const eventDeletion = await Event.findByIdAndDelete(eventId)

    if (eventDeletion) revalidatePath(path)
}


export const updateEvent = async ({ userId, event, path }) => {
    try {
        await connectToDatabase()
        const eventToUpdate = await Event.findById(event._id)
        if (!eventToUpdate || eventToUpdate.organizer.toHexString() !== userId) {
            throw new Error('Unauthorized or event not found')
        }
        const eventUpdation = await Event.findByIdAndUpdate(event._id, { ...event, category: event.category }, { new: true })
        revalidatePath(path)

        return JSON.parse(JSON.stringify(eventUpdation))
    } catch (error) {
        console.log(error)
    }
}

export const getRelatedEventsByCategory = async ({ categoryId, eventId, limit = 3, page = 1 }) => {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        const data =  JSON.parse(JSON.stringify(events))
        console.log(data)
        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }

        
    } catch (error) {
        console.log(error)

    }
}

export const getUserEvents = async ({ organizer }) => {
    try {
        const eventsData = await Event.find({organizer})
        return JSON.parse(JSON.stringify(eventsData))

    } catch (error) {
        console.log(error);
    }
};




