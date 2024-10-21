import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';
import { clerkClient } from '@clerk/nextjs/server';  // Updated import path for clerkClient
import { NextResponse } from 'next/server';

export async function POST(req) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get headers properly as `headers()` returns an immutable object
    const headerPayload = Object.fromEntries(headers());
    const svix_id = headerPayload['svix-id'];
    const svix_timestamp = headerPayload['svix-timestamp'];
    const svix_signature = headerPayload['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', {
            status: 400,
        });
    }

    // Get the body payload
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Verify the payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', { status: 400 });
    }

    // Process the event based on its type
    const eventType = evt.type;

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
            await clerkClient.users.updateUserMetadata(id, { publicMetadata: { userId: newUser._id } });
        }

        return NextResponse.json({ message: "OK", user: newUser });
    }

    if (eventType === 'user.updated') {
        const { id, image_url, first_name, last_name, username } = evt.data;

        const user = {
            firstName: first_name,
            lastName: last_name,
            username,
            photo: image_url,
        };

        const updatedUser = await updateUser(id, user);

        return NextResponse.json({ message: 'OK', user: updatedUser });
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        const deletedUser = await deleteUser(id);

        return NextResponse.json({ message: 'OK', user: deletedUser });
    }

    return new Response('', { status: 200 });
}
