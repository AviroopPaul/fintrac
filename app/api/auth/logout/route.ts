import { NextResponse } from 'next/server';

export async function POST() {
  // Delete the token cookie with proper settings
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // Set cookie with expires in the past to ensure deletion
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  });

  return response;
} 