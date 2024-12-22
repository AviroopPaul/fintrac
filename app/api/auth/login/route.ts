import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password, provider } = body;

    // If using NextAuth provider (like Google)
    if (provider) {
      let user = await User.findOne({ email });

      if (user && user.provider !== provider) {
        const errorUrl = `/login?error=OAuthAccountNotLinked&callbackUrl=${encodeURIComponent(
          "/tracker"
        )}`;
        return NextResponse.redirect(new URL(errorUrl, req.url));
      }

      if (!user) {
        // Create new user for OAuth providers
        user = await User.create({
          email,
          // Set a random password for OAuth users
          password: Math.random().toString(36).slice(-8),
          provider,
        });
      }

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.NEXT_PUBLIC_JWT_SECRET || "tracker_secret_key",
        { expiresIn: "7d" }
      );

      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return NextResponse.json(
        {
          message: "Login successful",
          userId: user._id.toString(),
          token: token,
        },
        { status: 200 }
      );
    }

    // Regular email/password login
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.NEXT_PUBLIC_JWT_SECRET || "tracker_secret_key",
      { expiresIn: "7d" }
    );

    console.log("JWT created with userId:", user._id.toString());

    // Return token in response body instead of setting a cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login successful",
        userId: user._id.toString(),
        token: token, // Include the token in the response
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
