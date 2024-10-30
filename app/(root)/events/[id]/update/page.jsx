import EventForm from "@/components/shared/EventForm"
import { getEventById } from "@/lib/actions/event.actions"
import Event from "@/lib/mongodb/database/models/event.model";
import User from "@/lib/mongodb/database/models/user.model";
import { auth } from '@clerk/nextjs/server';

const UpdateEvent = async ({ params }) => {
  // getting eventID
  const {id} = params
  
  const { userId: clerkId } = auth(); // Destructure and rename to clerkId
    
    let realUserId = null;
    if (clerkId) {
        try {
        // Query for the user using the Clerk ID
        const user = await User.findOne({ clerkId }); // Assuming you have a clerkId field in your User model
        realUserId = user ? user._id.toString() : null;
      } catch (error) {
          console.error('Error fetching user:', error);
      }
    }

    const event = await getEventById(id)
  
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
      </section>

      <div className="wrapper my-8">
        <EventForm 
          type="Update" 
          event={event} 
          eventId={event._id} 
          userId={realUserId} 
        />
      </div>
    </>
  )
}

export default UpdateEvent
