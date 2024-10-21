'use server';
import { connectToDatabase } from "../mongodb/database";
import Event from "../mongodb/database/models/event.model.js";
import Order from "../mongodb/database/models/order.model.js";
import User from "../mongodb/database/models/user.model.js";

// Create a user in the database
export const createUser = async (user) => {
    try {
        await connectToDatabase();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
        return null; // Handle error gracefully
    }
};

// Fetch a user by their ID
export async function getUserById(userId) {
    try {
        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) throw new Error('User not found');
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log(error); // Added logging for better error tracing
    }
}

// Update user details in the database using Clerk ID
export async function updateUser(clerkId, user) {
    try {
        await connectToDatabase();
        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });

        if (!updatedUser) throw new Error('User update failed');
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.log(error); // Added error logging
    }
}

// Delete a user from the database using Clerk ID and remove references
export async function deleteUser(clerkId) {
    try {
        await connectToDatabase();

        const userToDelete = await User.findOne({ clerkId });
        if (!userToDelete) throw new Error('User not found');

        // Unlink relationships in related collections
        await Promise.all([
            Event.updateMany(
                { _id: { $in: userToDelete.events } },
                { $pull: { organizer: userToDelete._id } }
            ),
            Order.updateMany(
                { _id: { $in: userToDelete.orders } },
                { $unset: { buyer: 1 } }
            ),
        ]);

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);

        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        console.log(error); // Log error details
    }
}
