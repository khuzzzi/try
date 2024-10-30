import EventForm from '@/components/shared/EventForm';
import User from '@/lib/mongodb/database/models/user.model';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const CreateEvent = async () => {
  const { userId: clerkId } = auth(); // Destructure and rename to clerkId
  
  let realUserId = null;
  if (clerkId) {
    try {
      // Query for the user using the Clerk ID
      const user = await User.findOne({ clerkId }); // Assuming you have a clerkId field in your User model
      // console.log(user); // Log the user object
      realUserId = user ? user._id.toString() : null;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  return (
    <>
      <section className='bg-gray-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <h3 className='wrapper h3-bold text-center sm:text-left'>Create Event</h3>
      </section>
      <div className='wrapper my-8'>
        {realUserId && <EventForm userId={realUserId} type="Create" />}
      </div>
    </>
  );
};

// Don't forget to export the component
export default CreateEvent;
