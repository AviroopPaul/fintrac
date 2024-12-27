import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Bill from "@/models/bill";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json([], { status: 401 });
    }

    const bills = await Bill.find({ userId: session.user.id })
      .sort({ dueDate: 1 })
      .lean();

    const billsArray = bills.map((bill) => ({
      _id: bill._id.toString(),
      userId: bill.userId.toString(),
      name: bill.name,
      amount: bill.amount,
      category: bill.category,
      description: bill.description,
      imageUrl: bill.imageUrl,
      paid: bill.paid,
      createdAt: bill.createdAt,
    }));

    return NextResponse.json(billsArray);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const bill = await Bill.create({
      ...data,
      userId: session.user.id,
      amount: parseFloat(data.amount),
      paid: false,
      createdAt: new Date(),
    });

    const formattedBill = {
      _id: bill._id.toString(),
      userId: bill.userId.toString(),
      name: bill.name,
      amount: bill.amount,
      category: bill.category,
      description: bill.description,
      imageUrl: bill.imageUrl,
      paid: bill.paid,
      createdAt: bill.createdAt,
    };

    return NextResponse.json(formattedBill);
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json({ error: "Error creating bill" }, { status: 500 });
  }
}
