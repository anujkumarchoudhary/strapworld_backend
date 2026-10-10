import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  // Reuse an existing connection.
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Wait if a connection is already being established.
  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}