import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/dbConnect";
import { COLLECTION_NAME } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const data = await request.json();

    const session = await getServerSession(authOptions);
    
    // Get user_id from session or use guest mode
    let user_id: string;

    if (data.mode === "guest" || !session?.user) {
      console.log("Using guest mode");
      user_id = "-1";
    } else {
      user_id = session.user.id; // Assuming your session user object has an id field
      console.log("Successfully authenticated user:", user_id);
    }

    const transaction = {
      ...data,
      user_id,
      date: new Date(data.date),
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(transaction);
    return NextResponse.json({
      ...transaction,
      _id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("transactions");

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");

    const session = await getServerSession(authOptions);

    // Enhanced debug logging
    console.log("Session check:", {
      exists: !!session,
      mode: mode,
      user: session?.user?.email,
    });

    // Get user_id from session or use guest mode
    let user_id: string;

    if (mode === "guest" || !session?.user) {
      console.log("Using guest mode");
      user_id = "-1";
    } else {
      user_id = session.user.id;
      console.log("Successfully authenticated user:", user_id);
    }

    const transactions = await collection
      .find({ user_id })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
