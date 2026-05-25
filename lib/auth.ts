import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export type UserRole = "customer" | "admin";

const demoAccounts: Record<UserRole, { email: string; password: string; name: string }> = {
  customer: {
    email: "customer@wildflower.co",
    password: "guest123",
    name: "Guest Planner",
  },
  admin: {
    email: "admin@wildflower.co",
    password: "admin123",
    name: "Wildflower Admin",
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Demo credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "customer@wildflower.co" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text", placeholder: "customer" },
      },
      async authorize(credentials) {
        const role = (credentials?.role === "admin" ? "admin" : "customer") as UserRole;
        const account = demoAccounts[role];

        if (
          credentials?.email === account.email &&
          credentials?.password === account.password
        ) {
          return {
            id: role,
            name: account.name,
            email: account.email,
            role,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};