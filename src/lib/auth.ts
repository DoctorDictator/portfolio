import type { AuthOptions, User } from "next-auth";
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
        const email = (credentials?.email ?? "")
          .toString()
          .trim()
          .toLowerCase();
        const password = (credentials?.password ?? "").toString();
        if (!email || !password) throw new Error(INVALID_CREDENTIALS);

        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (!dbUser || !dbUser.hashedPassword)
          throw new Error(INVALID_CREDENTIALS);

        const ok = await bcrypt.compare(password, dbUser.hashedPassword);
        if (!ok) throw new Error(INVALID_CREDENTIALS);

        // Only return fields that actually exist in your Prisma model
        const nextUser: User = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name ?? undefined,
          // no image field in your Prisma model -> omit it
        };
        return nextUser;
      },
    }),
  ],

  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id!,
          email: user.email ?? null,
          name: user.name ?? null,
          // keep the key for UI compatibility; value is null since DB has no image
          image: null,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email ?? null,
          name: token.user.name ?? null,
          image: token.user.image ?? null,
        };
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};
