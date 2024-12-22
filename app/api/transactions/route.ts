import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { COLLECTION_NAME } from '@/models/Transaction';
import { verify } from 'jsonwebtoken';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

// Helper function to get token from either cookies or Authorization header
async function getToken() {
  const headersList = await headers();
  const cookieStore = await cookies();
  
  const authHeader = headersList.get('Authorization');
  const headerToken = authHeader?.replace('Bearer ', '');
  
  const cookieToken = cookieStore.get('token')?.value;
  
  return headerToken || cookieToken;
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const data = await request.json();
    
    const token = await getToken();
    
    // Debug logging
    console.log('Token found:', {
      exists: !!token,
      value: token ? `${token.substring(0, 10)}...` : 'none'
    });

    // Get user_id from token or use guest mode
    let user_id: string;
    
    if (data.mode === 'guest' || !token) {
      console.log('Using guest mode');
      user_id = '-1';
    } else {
      try {
        const decoded = verify(
          token,
          process.env.NEXT_PUBLIC_JWT_SECRET || 'tracker_secret_key'
        ) as { userId: string };
        user_id = decoded.userId;
        console.log('Successfully authenticated user:', user_id);
      } catch (tokenError) {
        console.error('Token verification failed:', tokenError);
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    }

    const transaction = {
      ...data,
      user_id,
      date: new Date(data.date)
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(transaction);
    return NextResponse.json({ 
      ...transaction, 
      _id: result.insertedId.toString() 
    });
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('transactions');
    
    // Get the URL to check for guest mode
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');
    
    const token = await getToken();
    
    // Enhanced debug logging
    console.log('Token check:', {
      exists: !!token,
      mode: mode,
      value: token ? `${token.substring(0, 10)}...` : 'none',
    });

    // Get user_id from token or use guest mode
    let user_id: string;
    
    if (mode === 'guest' || !token) {
      console.log('Using guest mode');
      user_id = '-1';
    } else {
      try {
        // Verify and decode token
        const decoded = verify(
          token,
          process.env.NEXT_PUBLIC_JWT_SECRET || 'tracker_secret_key'
        ) as { userId: string };
        
        user_id = decoded.userId;
        console.log('Successfully authenticated user:', user_id);
      } catch (tokenError) {
        console.error('Token verification failed:', {
          error: tokenError instanceof Error ? tokenError.message : 'Unknown error',
          tokenPreview: token.substring(0, 10) + '...'
        });
        
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
    }

    const transactions = await collection
      .find({ user_id })
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
} 