import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { email, password } = await req.json();

    // Check if user is already logged in
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json(
        { message: 'Already authenticated' },
        { status: 400 }
      );
    }

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).select('_id');
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash the password with explicit string conversion
    const hashedPassword = await bcrypt.hash(String(password), 10);

    // Create new user with hashed password
    const user = await User.create({
      email,
      password: hashedPassword,
      provider: 'credentials'
    });

    // Clear any existing sessions before returning
    const response = NextResponse.json(
      {
        message: 'User created successfully',
        userId: user._id.toString(),
      },
      { status: 201 }
    );

    // Clear any existing authentication cookies
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('__Secure-next-auth.session-token');

    return response;

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 