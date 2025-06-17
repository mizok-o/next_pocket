import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "../app/supabaseClient";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { data: existingUser, error } = await supabase
            .from("users")
            .select("id, email")
            .eq("email", user.email || "")
            .single();

          // DBエラーがある場合（PGRST116以外）
          if (error && error.code !== "PGRST116") {
            return false;
          }

          // ユーザーが見つからない場合（PGRST116エラーまたはdata null）
          if (!existingUser) {
            return false;
          }

          return true;
        } catch {
          return false;
        }
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        const { data: dbUser, error } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email || "")
          .single();

        if (error && error.code !== "PGRST116") {
          return token;
        }

        if (dbUser) {
          token.id = dbUser.id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
