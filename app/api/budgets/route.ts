import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Budget from "@/models/Budget";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    await dbConnect();
    const budgets = await Budget.find({
      user_id: session.user.email,
      month: month,
    });

    return NextResponse.json(budgets);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const budget = await Budget.create({
      ...body,
      user_id: session.user.email,
    });

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get("id");

    if (!budgetId) {
      return NextResponse.json({ error: "Budget ID is required" }, { status: 400 });
    }

    await dbConnect();
    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      user_id: session.user.email,
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get("id");
    const body = await request.json();

    if (!budgetId) {
      return NextResponse.json({ error: "Budget ID is required" }, { status: 400 });
    }

    await dbConnect();
    const budget = await Budget.findOneAndUpdate(
      {
        _id: budgetId,
        user_id: session.user.email,
      },
      body,
      { new: true }
    );

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
