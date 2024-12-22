import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password, provider } = body;

    console.log('Login attempt for email:', email);

    // Regular email/password login
    if (provider === "credentials" || !provider) {
      if (!email || !password) {
        return NextResponse.json(
          { message: "Email and password are required" },
          { status: 400 }
        );
      }

      // Find user and explicitly select the password field
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        console.log('User not found:', email);
        return NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        );
      }

      try {
        // Use the model's comparePassword method
        const isMatch = await user.comparePassword(String(password));
        console.log('Password verification result:', isMatch);

        if (!isMatch) {
          console.log('Password verification failed');
          return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('Password comparison error:', error);
        return NextResponse.json(
          { message: "Error verifying credentials" },
          { status: 500 }
        );
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.NEXT_PUBLIC_JWT_SECRET || "tracker_secret_key",
        { expiresIn: "7d" }
      );

      // Fix the cookie setting
      const response = NextResponse.json(
        {
          message: "Login successful",
          userId: user._id.toString(),
          token: token,
        },
        { status: 200 }
      );

      // Set the cookie in the response
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
      });

      return response;
    }

    // Google OAuth login
    if (provider === "google") {
      let user = await User.findOne({ email });

      if (user && user.provider && user.provider !== provider) {
        return NextResponse.json(
          { message: "Account exists with different provider" },
          { status: 400 }
        );
      }

      if (!user) {
        // Create new user for OAuth providers
        user = await User.create({
          email,
          password: Math.random().toString(36).slice(-8),
          provider,
        });
      }

      const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.NEXT_PUBLIC_JWT_SECRET || "tracker_secret_key",
        { expiresIn: "7d" }
      );

      const response = NextResponse.json(
        {
          message: "Login successful",
          userId: user._id.toString(),
          token: token,
        },
        { status: 200 }
      );

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60
      });

      return response;
    }

    return NextResponse.json(
      { message: "Invalid provider" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
