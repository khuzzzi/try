import CheckoutButton from '@/components/shared/CheckoutButton'
import Collections from '@/components/shared/Collections'
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions'
import Image from 'next/image'
import React from 'react'
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/mongodb/database/models/user.model'

// import { formatDate } from 'react-datepicker/dist/date_utils'

const EventDetails = async ({params : {id} , searchParams}) => {
  const event = await getEventById(id)
  const imageUrl = event.imageUrl
  const relatedEvents = getRelatedEventsByCategory({
    categoryId : event.category._id,
    eventId : event._id,
    page: searchParams.page
  })

  const { userId: clerkId } = auth(); // Destructure and rename to clerkId
  
  let realUserId = null;
  
    try {
      // Query for the user using the Clerk ID
      const user = await User.findOne({ clerkId }); // Assuming you have a clerkId field in your User model
      // console.log(user); // Log the user object
      realUserId = user ? user._id.toString() : null;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  
  return (
    <>
    <section className='flex justify-center bg-gray-50 bg-dotted-pattern lg:mt-2 items-center'>
        <div className = "grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image src={imageUrl} alt="hero image" width={1000} height={1000} className='h-full min-h-[300px] object-cover object-center'/>

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className='flex flex-col gap-6'>
              <h2 className="h2-bold">{event.title}</h2>

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center '>
                <div className="flex gap-3">
                  <p className='p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700'>
                    {event.isFree ? 'FREE' : `$ ${event.price}`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-gray-500/10 px-4 py-2.5 text-gray-500">
                    {event.category.name}
                  </p>
                  <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                    by{' '}
                    <span className="text-blue-500">{event.organizer.firstName} {event.organizer.lastName | ""}</span>
                  </p>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}

              <CheckoutButton userId={realUserId} event={event}/>

              <div className="flex flex-col gap-5">
                <div className='flex gap-2 md:gap-3'>
                  <Image src="/assets/icons/calendar.svg" alt="calender" width={32} height={32}/>
                  <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                    <p>time : {event.endDateTime}</p>
                    <p>time : {event.endDateTime}</p>
                  </div>
                </div>
                <div className="p-regular-20 flex items-center gap-3">
                  <Image src="/assets/icons/location-grey.svg" alt="calender" width={32} height={32}/>
                  <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="p-bold-20 text-gray-500">What You'll Learn : </p>
                <p className='p-medium-16 lg:p-regular-18'>{event.description}</p>
                <p className='p-medium-16 lg:p-regular-18 truncate text-blue-600 underline'>{event.url}</p>
              </div>
            </div>
          </div>
        </div>
    </section>

    {/* EVENTS FROM THE SAME ORGANIZER */}
    <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
      <h2 className='h2-bold'>Related Events</h2>
    
      {/* <Collections 
          data={relatedEvents?.data}
          emptyTitle = "No Events Found"
          emptyStateSubText = "ComeBack Later"
          collectionType = "All_Events"
          limit={6}
          page={1}
          totalPages={2}
        /> */}

    </section>

    </>
        
  )
}

export default EventDetails

