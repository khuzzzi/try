import Collections from '@/components/shared/Collections';
import { Button } from '@/components/ui/button';
import {getUserEvents } from '@/lib/actions/event.actions';
import User from '@/lib/mongodb/database/models/user.model';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

const Page = async () => { // Make this function async
    const { userId: clerkId } = auth(); // Destructure and rename to clerkId
    
   
        const user = await User.findOne({ clerkId })
        const organizer = user._id
        

        const organizerData = await getUserEvents({organizer})
        console.log(organizerData.length)
  

    return (
        <>
            {/* My Tickets */}
            <section className='bg-gray-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between '>
                    <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
                    <Button className='cursor-pointer button hidden sm:flex' asChild>
                        <Link href="/#events">Explore More Events</Link>
                    </Button>
                </div>
            </section>

            {/* Events Organized */}
            <section className='bg-gray-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
                <div className='wrapper flex items-center justify-center sm:justify-between '>
                    <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
                    <Button className='cursor-pointer button hidden sm:flex' asChild>
                        <Link href="/events/create">Create New Event</Link>
                    </Button>
                </div>
            </section>

            {/* Passing eventsOrganizedData to Collections */}
            {/* Uncomment when using Collections */}
            <section className="wrapper my-8">
                <Collections
                    data={organizerData}
                    emptyTitle="No Events Tickets Purchased Yet"
                    emptyStateSubText="No Worries! Plenty Of Exciting Events To Explore"
                    collectionType="My_Tickets"
                    limit={3}
                    page={1}
                    urlParamName="ordersPage"
                    totalPages={2}
                />
            </section>
        </>
    );
};

export default Page;
