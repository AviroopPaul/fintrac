import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { sign } from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      email,
      password,
    });

    // Create JWT token
    const token = sign(
      { userId: user._id },
      process.env.NEXT_PUBLIC_JWT_SECRET || 'tracker_secret_key',
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 