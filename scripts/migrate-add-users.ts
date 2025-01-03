import { connectToDatabase } from "../lib/mongodb";
import { COLLECTION_NAME } from "../models/Transaction";

const USERS_COLLECTION_NAME = "users";

async function migrate() {
  const db = await connectToDatabase();

  // Create users collection and add Aviroop
  const result = await db.collection(USERS_COLLECTION_NAME).insertOne({
    name: "Aviroop",
    created_at: new Date(),
  });

  const aviroop_id = result.insertedId.toString();

  // Update all existing transactions with Aviroop's user_id
  await db
    .collection(COLLECTION_NAME)
    .updateMany(
      { user_id: { $exists: false } },
      { $set: { user_id: aviroop_id } }
    );

  console.log("Migration completed successfully");
  process.exit(0);
}

migrate().catch(console.error);
