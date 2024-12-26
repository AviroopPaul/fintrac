import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Subscription from "@/models/subscription";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("GET: No session found");
      return NextResponse.json([], { status: 401 });
    }

    console.log("GET: Fetching subscriptions for user:", session.user.id);

    const subscriptions = await Subscription.find({
      userId: session.user.id,
      active: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    const subscriptionsArray = Array.isArray(subscriptions)
      ? subscriptions.map((sub) => ({
          _id: sub._id.toString(),
          userId: sub.userId.toString(),
          service: sub.service,
          amount: sub.amount,
          billingCycle: sub.billingCycle,
          nextBillingDate: sub.nextBillingDate,
          imageUrl: sub.imageUrl,
          active: sub.active,
          createdAt: sub.createdAt,
        }))
      : [];

    console.log("GET: Found subscriptions:", subscriptionsArray);

    return NextResponse.json(subscriptionsArray);
  } catch (error) {
    console.error("Detailed error in fetching subscriptions:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("No session found");
      return NextResponse.json([], { status: 401 });
    }

    const data = await request.json();
    console.log("Received subscription data:", data);
    console.log("User ID:", session.user.id);

    const subscription = await Subscription.create({
      ...data,
      userId: session.user.id,
      createdAt: new Date(),
      active: true,
    });

    const formattedSubscription = {
      _id: subscription._id.toString(),
      userId: subscription.userId.toString(),
      service: subscription.service,
      amount: subscription.amount,
      billingCycle: subscription.billingCycle,
      nextBillingDate: subscription.nextBillingDate,
      imageUrl: subscription.imageUrl,
      active: subscription.active,
      createdAt: subscription.createdAt,
    };

    console.log("Created subscription:", formattedSubscription);
    return NextResponse.json([formattedSubscription]);
  } catch (error) {
    console.error("Detailed error in subscription creation:", error);
    return NextResponse.json([], { status: 500 });
  }
}
