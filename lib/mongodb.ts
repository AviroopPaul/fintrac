import { MongoClient, Db } from "mongodb";

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error("MONGODB_URI not found. Please check your .env.local file");
}

const MONGODB_URI: string = process.env.NEXT_PUBLIC_MONGODB_URI;

interface GlobalMongoDB {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
  db: Db | null;
}

declare global {
  var mongodb: GlobalMongoDB;
}

// Initialize the cached object with a default value
const cached: GlobalMongoDB = global.mongodb || {
  client: null,
  promise: null,
  db: null,
};

if (!global.mongodb) {
  global.mongodb = cached;
}

export async function connectToDatabase() {
  if (cached.db) {
    console.log("Using existing database connection");
    return cached.db;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("Creating new database connection...");
    cached.promise = new MongoClient(MONGODB_URI, opts).connect();
  }

  try {
    cached.client = await cached.promise;
    cached.db = cached.client.db();
    console.log("Successfully connected to database");
  } catch (e) {
    console.error("Failed to connect to database:", e);
    cached.promise = null;
    throw e;
  }

  return cached.db;
}
