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
    const userId = new mongoose.Types.ObjectId(auth.userId);
    const transactionId = new mongoose.Types.ObjectId(params.id);

    const transaction = await Transaction.findOneAndUpdate(
      { 
        _id: transactionId, 
        userId 
      },
      {
        ...body,
        date: new Date(body.date), // Ensure date is properly formatted
        userId // Ensure userId stays the same
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

    // Convert string IDs to ObjectId
    const userId = new mongoose.Types.ObjectId(auth.userId);
    const transactionId = new mongoose.Types.ObjectId(params.id);

    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId
    });

    if (!transaction) {
      console.log(`Transaction ${params.id} not found for user ${auth.userId}`);
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 }
      );
    }

    console.log(`Deleted transaction ${params.id} for user ${auth.userId}`);
    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
