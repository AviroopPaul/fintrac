import { TRANSACTIONS_COLLECTION } from "../models/constants.js";

export const up = async (db) => {
  // Update transactions with the new user_id
  await db.collection(TRANSACTIONS_COLLECTION).updateMany(
    { user_id: "6766ef001b17c58a1b91cdd5" },
    { $set: { user_id: "6767e2ac4eb9d1e51cebe3d3" } }
  );
};

export const down = async (db) => {
  // Revert changes if needed
  await db.collection(TRANSACTIONS_COLLECTION).updateMany(
    { user_id: "6767e2ac4eb9d1e51cebe3d3" },
    { $set: { user_id: "6766ef001b17c58a1b91cdd5" } }
  );
}; 