import stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.actions'

export async function POST(request) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.log('Webhook signature verification failed:', err);
      return NextResponse.json({ message: 'Webhook error', error: err });
    }
  
    const eventType = event.type;
    console.log('Received webhook event type:', eventType);
  
    if (eventType === 'checkout.session.completed') {
      const { id, amount_total, metadata } = event.data.object;
      
      const order = {
        stripeId: id,
        eventId: metadata?.eventId || '',
        buyerId: metadata?.buyerId || '',
        totalAmount: amount_total ? (amount_total / 100).toString() : '0',
        createdAt: new Date(),
      };
  
      console.log('Order data to save:', order); // Debug log before saving
  
      const newOrder = await createOrder(order);
      console.log('Order saved:', newOrder); // Confirm if save was successful
      return NextResponse.json({ message: 'OK', order: newOrder });
    }
  
    return new Response('', { status: 200 });
  }
  