"use server"

import { connectToDatabase } from "../mongodb/database"
import Category from "../mongodb/database/models/category.model";

export const createCategory = async({categoryName}={})=>{
    try {
        await connectToDatabase();

        const newCategory = await Category.create({name : categoryName})

        return JSON.parse(JSON.stringify(newCategory))
    } catch (error) {
        console.log(error)
    }
}

export const getAllCategories = async({categoryName}={})=>{
    try {
        await connectToDatabase();

        const fetchAllCategory = await Category.find()

        return JSON.parse(JSON.stringify(fetchAllCategory))
    } catch (error) {
        console.log(error)
    }
}