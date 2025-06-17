import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "../app/supabaseClient";
// import bcrypt from "bcryptjs"

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
    // CredentialsProvider({
    // 	name: "Credentials",
    // 	credentials: {
    // 		email: { label: "Email", type: "email" },
    // 		password: { label: "Password", type: "password" },
    // 	},
    // 	async authorize(credentials: Credentials | undefined) {
    // 		if (!credentials?.email || !credentials?.password) {
    // 			console.log("❌ 認証失敗: 認証情報が不足")
    // 			return null
    // 		}

    // 		console.log("🔍 ユーザー検索:", credentials.email)

    // 		const { data: user, error } = await supabase
    // 			.from("users")
    // 			.select("id, email, password")
    // 			.eq("email", credentials.email)
    // 			.single()

    // 		if (error) {
    // 			console.log("❌ データベースエラー:", error)
    // 			return null
    // 		}

    // 		if (!user) {
    // 			console.log("❌ ユーザーが見つかりません:", credentials.email)
    // 			return null
    // 		}

    // 		console.log("✅ ユーザー発見:", user.email)

    // 		const isValidPassword = await bcrypt.compare(
    // 			credentials.password,
    // 			user.password
    // 		)

    // 		if (!isValidPassword) {
    // 			console.log("❌ パスワード不一致")
    // 			return null
    // 		}

    // 		console.log("✅ 認証成功:", user.email)

    // 		return {
    // 			id: user.id,
    // 			email: user.email,
    // 		}
    // 	},
    // }),
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
    error: "/login", // 認証エラー時もログインページへ
  },
  events: {
    async signIn() {
      // SignIn event
    },
    async signOut() {
      // SignOut event
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
