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
      console.log("🔍 SignIn callback:", { user: user?.email, provider: account?.provider });

      if (account?.provider === "google") {
        console.log("🔑 Google認証開始:", user?.email);

        const { data: existingUser, error } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email || "")
          .single();

        console.log("📊 DB検索結果:", { existingUser, error: error?.code });

        // DBエラーがある場合（PGRST116以外）
        if (error && error.code !== "PGRST116") {
          console.log("❌ DB接続エラー:", error);
          return false;
        }

        // ユーザーが見つからない場合（PGRST116エラーまたはdata null）
        if (!existingUser) {
          console.log("❌ ユーザー未登録:", user?.email);
          return false;
        }

        console.log("✅ 認証成功:", user?.email);
        return true;
      }

      console.log("❌ Google以外のプロバイダー:", account?.provider);
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("🎫 JWT callback - ユーザー情報取得:", user?.email);

        const { data: dbUser, error } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email || "")
          .single();

        console.log("🎫 JWT - DB検索結果:", { dbUser, error: error?.code });

        // DBエラーがある場合（PGRST116以外）
        if (error && error.code !== "PGRST116") {
          console.log("❌ JWT - DB接続エラー:", error);
          return token;
        }

        if (dbUser) {
          token.id = dbUser.id.toString();
          console.log("✅ JWT - トークンにID追加:", dbUser.id);
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔐 Session callback:", {
        user: session.user?.email,
        tokenId: token.id,
      });

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
  logger: {
    error(code, metadata) {
      console.error("🔥 NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("⚠️ NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("🐛 NextAuth Debug:", code, metadata);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
