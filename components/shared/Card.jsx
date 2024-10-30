import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/mongodb/database/models/user.model';
import DeleteConfirmation from './DeleteConfirmation';

const Card = ({ event, hasOrderLink, hidePrice }) => {
    const { userId } = auth(); 
    const isEventCreator = userId === event.organizer.clerkId
  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link 
        href={`/events/${event._id}`} 
        style={{ backgroundImage: `url(${event.imageUrl})` }} 
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500" 
      />
      
      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
              {event.isFree ? 'FREE' : `$${event.price}`}
            </span>
            <p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-500 line-clamp-1">
              {event.category.name}
            </p>
          </div>
        )}
        
        {isEventCreator && !hidePrice && (
            <div className='absolute right-2 top-2 flex flex-col gap-4 p-3 rounded-xl bg-white shadow-sm transition-all'>
                <Link href={`/events/${event._id}/update`}>
                    <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20}/>
                </Link>
                <DeleteConfirmation eventId={event._id}/>
            </div>
        )}
        
        

        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {event.title}
          </p>
          <div className="flex justify-between min-w-full ">
                <p className='p-medium-14 md:p-medium-16 text-gray-600'>
                    {event.organizer.firstName} 
                </p>

                {hasOrderLink && (
                    <Link href={`/orders?eventId=${event._id}`}>
                        <p className='text-blue-600'>Order Details</p>
                        <Image src="/assets/icons/arrow.svg" height={32} width={32}/>
                    </Link>
                )}
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Card
