import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Transaction } from "@/models/Transaction";
import { verifyAuth } from "@/lib/auth";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth();
    
    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await req.json();

    // Convert string IDs to ObjectId
    const user_id = new mongoose.Types.ObjectId(auth.userId);
    const transactionId = new mongoose.Types.ObjectId(params.id);

    const transaction = await Transaction.findOneAndUpdate(
      { 
        _id: transactionId, 
        user_id 
      },
      {
        ...body,
        date: new Date(body.date), // Ensure date is properly formatted
        user_id // Ensure user_id stays the same
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!transaction) {
      console.log(`Transaction ${params.id} not found for user ${auth.userId}`);
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    console.log(`Updated transaction ${params.id} for user ${auth.userId}`);
    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const auth = await verifyAuth();
    
    if (!auth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Convert string IDs to ObjectId
    const user_id = new mongoose.Types.ObjectId(auth.userId);
    const transactionId = new mongoose.Types.ObjectId(context.params.id);

    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user_id
    });

    if (!transaction) {
      console.log(`Transaction ${context.params.id} not found for user ${auth.userId}`);
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    console.log(`Deleted transaction ${context.params.id} for user ${auth.userId}`);
    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
