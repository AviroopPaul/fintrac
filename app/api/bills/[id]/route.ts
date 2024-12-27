import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Bill from "@/models/bill";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid bill ID" }, { status: 400 });
    }

    const bill = await Bill.findByIdAndDelete(params.id);

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Error deleting bill:", error);
    return NextResponse.json({ error: "Error deleting bill" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid bill ID" }, { status: 400 });
    }

    const body = await request.json();

    if (!body.name || !body.amount || !body.dueDate || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bill = await Bill.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        amount: body.amount,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl,
        paid: body.paid ?? false,
      },
      { new: true }
    );

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error("Error updating bill:", error);
    return NextResponse.json({ error: "Error updating bill" }, { status: 500 });
  }
}
