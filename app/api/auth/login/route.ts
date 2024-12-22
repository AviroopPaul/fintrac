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

      // Import bcrypt at the top level instead
      const bcrypt = require('bcryptjs');
      
      // Add more detailed debug logging
    
      
      // Hash the input password with the same salt used for stored password
      const hashedInputPassword = await bcrypt.hash(String(password), 10);
      
      // Compare the hashed input with stored hash
      const isMatch = hashedInputPassword === user.password;


      console.log('Attempting password comparison');
      console.log('Input password:', hashedInputPassword);
      console.log('Stored password hash:', user.password);
      console.log('Input password length:', password.length);
      console.log('Stored hash length:', user.password.length);
      
      console.log('Password match result:', isMatch);

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
