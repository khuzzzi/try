<<<<<<< HEAD
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient } from '@clerk/nextjs/server';
import { createUser } from '@/lib/actions/user.action';
import { NextResponse } from 'next/server';
import Order from '@/lib/mongodb/database/models/order.model';
import Event from '@/lib/mongodb/database/models/event.model';
import User from '@/lib/mongodb/database/models/user.model';

export async function POST(req) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Log the event details
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle 'user.created' event
  if (eventType === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
    
    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username,
      firstName: first_name,
      lastName: last_name,
      photo: image_url,
    };

    const newUser = await createUser(user);

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });

      return NextResponse.json({ message: 'OK', user: newUser });
    }
  }

  return new Response('', { status: 200 });
}

// Export additional utility functions

export async function getUserById(userId) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId, user) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });

    if (!updatedUser) throw new Error('User update failed');
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(clerkId) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ]);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    // Optionally, revalidate paths (depends on your setup)
    // await revalidatePath('/');

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.log(error);
  }
}
=======

>>>>>>> d070736a81ca8efc32c11a12adc30890a0c3bced
