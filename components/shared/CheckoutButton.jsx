"use client"
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import Checkout from './Checkout'

const CheckoutButton = ({userId,event}) => {
//   console.log(userId)
//   const hasEventFinished = new Date(event.startDate) < new Date();

    // console.log(event)



    return (
    <div className='flex items-center gap-3'>
        <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
                <Link href="/sign-in">
                    Get Tickets
                </Link>
            </Button>
        </SignedOut>

        <SignedIn>
            <Checkout event={event} userId={userId}/>
        </SignedIn>
    </div>
  )
}

export default CheckoutButton