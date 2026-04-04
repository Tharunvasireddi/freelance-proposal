import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGO_URL;

if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URI");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;

  return cached.conn;
}
