import { createOrder } from '@/lib/actions/order.actions'
import { NextResponse } from 'next/server'
import stripe from 'stripe'


export async function POST(request) {
  const body = await request.text()

  const sig = request.headers.get('stripe-signature') 
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.log(err)
  }
  console.log(event)
  // Get the ID and type
  const eventType = event.type

  // CREATE
  if (eventType === 'checkout.session.completed') {
    const { id, amount_total, metadata } = event.data.object

    const order = {
      stripeId: id,
      eventId: metadata?.eventId || '',
      buyerId: metadata?.buyerId || '',
      totalAmount: amount_total ? (amount_total / 100).toString() : '0',
      createdAt: new Date(),
    }

    const newOrder = await createOrder(order)
    console.log("order created")
    return NextResponse.json({ message: 'OK', order: newOrder })
  }

  return new Response('', { status: 200 })
}