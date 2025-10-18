/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type AuthOptions, type User } from "next-auth";
import { type JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const INVALID_CREDENTIALS = "Invalid email or password";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Basic input validation to avoid undefined/null comparisons
        const email = (credentials?.email ?? "")
          .toString()
          .trim()
          .toLowerCase();
        const password = (credentials?.password ?? "").toString();

        if (!email || !password) {
          throw new Error(INVALID_CREDENTIALS);
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // Do not reveal which check failed (prevents user enumeration)
        if (!user || !user.hashedPassword) {
          throw new Error(INVALID_CREDENTIALS);
        }

        // Compare password
        const ok = await bcrypt.compare(password, user.hashedPassword);
        if (!ok) {
          throw new Error(INVALID_CREDENTIALS);
        }

        // Return only minimal fields here (NextAuth will merge into `user` for jwt callback)
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: (user as any).image ?? undefined, // if your User has `image`
        } as User;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  callbacks: {
    // Put only whitelisted fields into the token
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: (user as any).image,
        } as any;
      }
      return token;
    },

    // Mirror the same safe fields to the client session
    async session({ session, token }: { session: any; token: JWT }) {
      if (token?.user) {
        session.user = {
          id: (token.user as any).id,
          email: (token.user as any).email,
          name: (token.user as any).name,
          image: (token.user as any).image,
        };
      }
      return session;
    },
  },

  // Optional: keep helpful logs during development
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
