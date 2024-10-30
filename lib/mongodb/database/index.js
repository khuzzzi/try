import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI){
    console.log("mongodb uri missing")
  };

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'evently',
    bufferCommands: false,
  }).catch(err => {
    console.log('MongoDB connection error:', err);
    throw err; // Re-throw the error to handle it upstream
  });

  cached.conn = await cached.promise;

  // Log the connection object instead of just its name
  console.log('MongoDB connected:'); // Log connection URL for clarity
  // console.log('Connection object:', cached.conn); // Log the entire connection object

  return cached.conn;
};
