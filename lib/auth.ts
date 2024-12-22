import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

export interface JWTPayload {
  userId: string;
  iat: number;
  exp: number;
}

export async function verifyAuth() {
  try {
    // First check NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      console.log("Found NextAuth session with userId:", session.user.id);
      return { userId: session.user.id };
    }

    // If no NextAuth session, check JWT
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      console.log("No token found in cookies");
      return null;
    }

    const decoded = jwt.verify(
      token.value,
      process.env.NEXT_PUBLIC_JWT_SECRET || "tracker_secret_key"
    ) as JWTPayload;

    console.log("Decoded JWT token userId:", decoded.userId);
    return decoded;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session;
  }

  // Check JWT token as fallback
  const auth = await verifyAuth();
  if (auth?.userId) {
    return {
      user: {
        id: auth.userId
      }
    };
  }

  return null;
}
