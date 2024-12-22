import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";
import { verifyAuth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    const auth = await verifyAuth();

    if (!auth?.userId) {
      console.log("Auth verification failed or no userId present");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("Auth successful, userId:", auth.userId);

    await dbConnect();
    console.log("Database connected");

    // Change back to user_id to match schema
    const user_id = auth.userId;
    console.log("Using user_id:", user_id);

    console.log("Executing query with filter:", { user_id });

    const transactions = await Transaction.find({ user_id })
      .sort({ date: -1 })
      .lean();

    console.log(
      "Raw transactions result:",
      JSON.stringify(transactions, null, 2)
    );
    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Detailed error in GET /api/transactions:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth();

    if (!auth?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    // Use user_id to match schema
    const user_id = auth.userId;
    console.log("Using user_id:", user_id);
    console.log("Body:", body);
    
    const transaction = await Transaction.create({
      ...body,
      user_id,
    });

    console.log(`Created transaction for user ${user_id}:`, transaction);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
