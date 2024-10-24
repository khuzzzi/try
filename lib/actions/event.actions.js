"use server"

import { connectToDatabase } from "../mongodb/database"
import Event from "../mongodb/database/models/event.model"
import User from "../mongodb/database/models/user.model"

export const createEvent = async({event,userId,path})=>{
    try {
        await connectToDatabase()
        const organizer = await User.findById(userId);
        if(!organizer){
            throw new Error("organizer not found");
        }
        const newEvent = await Event.create({...event, category : event.categoryId, organizer : userId})
        return JSON.parse(JSON.parse(newEvent))   
    } catch (error) {
        console.log(error)
    }
}