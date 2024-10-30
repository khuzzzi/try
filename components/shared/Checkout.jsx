import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { loadStripe } from '@stripe/stripe-js';
import { checkoutOrder, createOrder } from '@/lib/actions/order.actions';

const Checkout = ({ event, userId }) => {
  console.log("event",event)
    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            console.log('Order placed! You will receive an email confirmation.');
        }

        if (query.get('canceled')) {
            console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
    }, []);

    const onCheckout = async () => {
        const order = {
            eventTitle: event.title,
            eventId: event._id,
            price: event.price,
            isFree: event.isFree,
            buyerId: userId
        };
        
        try {
            const checkoutUrl = await checkoutOrder( order );
            if (checkoutUrl) {
                window.location.href = checkoutUrl; // Redirect on the client side
            }
        } catch (error) {
            console.error("Checkout failed", error);
        }
    };

    return (
        <Button onClick={onCheckout} role="link" size="lg" className="button sm:w-fit">
            {event.isFree ? "Get Ticket" : "Buy Ticket"}
        </Button>
    );
};

export default Checkout;
