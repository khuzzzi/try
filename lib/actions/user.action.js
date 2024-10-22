'use server'

import { connectToDatabase } from "../mongodb/database/index"
import User from "../mongodb/database/models/user.model.js"

export const createUser = async(user)=>{
    try {
        await connectToDatabase()
        const newUser = await User.create(user)

        return JSON.parse(JSON.stringify(newUser))
    } catch (error) {
        console.log(error)
    }
}