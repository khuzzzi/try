// lib/actions/order.actions.js

"use server"

import Stripe from "stripe"
import { connectToDatabase } from "../mongodb/database"
import Order from "../mongodb/database/models/order.model"
import User from "../mongodb/database/models/user.model"

export const checkoutOrder = async ( order ) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const price = order.isFree ? 0 : Number(order.price) * 100

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: price,
                        product_data: {
                            name: order.eventTitle,
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                eventId: order.eventId,
                buyerId: order.buyerId,
            },
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
        })
        return session.url  // Return session URL instead of redirecting
    } catch (error) {
        console.log(error)
        throw new Error("Failed to create checkout session")
    }
}

export const createOrder = async({order})=>{
    try {
        await connectToDatabase()

        const newOrder = await Order.create({...order,event:order.eventId , buyer : order.buyerId})

        return JSON.parse(JSON.stringify(newOrder))
    } catch (error) {
        console.log(error)
    }
}

export async function getOrdersByEvent({ searchString, eventId }) {
    try {
      await connectToDatabase()
  
      if (!eventId) throw new Error('Event ID is required')
      const eventObjectId = new ObjectId(eventId)
  
      const orders = await Order.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'buyer',
            foreignField: '_id',
            as: 'buyer',
          },
        },
        {
          $unwind: '$buyer',
        },
        {
          $lookup: {
            from: 'events',
            localField: 'event',
            foreignField: '_id',
            as: 'event',
          },
        },
        {
          $unwind: '$event',
        },
        {
          $project: {
            _id: 1,
            totalAmount: 1,
            createdAt: 1,
            eventTitle: '$event.title',
            eventId: '$event._id',
            buyer: {
              $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
            },
          },
        },
        {
          $match: {
            $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
          },
        },
      ])
  
      return JSON.parse(JSON.stringify(orders))
    } catch (error) {
      console.log(error)
    }
  }
  
  // GET ORDERS BY USER
  export async function getOrdersByUser({ userId, limit = 3, page }) {
    try {
      await connectToDatabase()
  
      const skipAmount = (Number(page) - 1) * limit
      const conditions = { buyer: userId }
  
      const orders = await Order.distinct('event._id')
        .find(conditions)
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(limit)
        .populate({
          path: 'event',
          model: Event,
          populate: {
            path: 'organizer',
            model: User,
            select: '_id firstName lastName',
          },
        })
  
      const ordersCount = await Order.distinct('event._id').countDocuments(conditions)
  
      return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }
    } catch (error) {
      handleError(error)
    }
  }