import clientPromise from "./mongodb";
import { Db } from "mongodb";

export async function connectToDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export default connectToDatabase; 