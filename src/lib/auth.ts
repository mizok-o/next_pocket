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

          // DBエラー（ユーザーが見つからない場合以外）
          if (error && error.code !== "PGRST116") {
            console.error("Error fetching user:", error);
            return false;
          }

          // ユーザーが存在しない場合は新規作成
          if (!existingUser) {
            const { data: newUser, error: insertError } = await supabase
              .from("users")
              .insert({
                email: user.email,
                // パスワードはGoogle認証なので不要ですが、not-null制約のためダミーを入れます
                password: "google-auth-no-password",
              })
              .select("id")
              .single();

            if (insertError) {
              console.error("Error creating user:", insertError);
              return false;
            }

            // 新規ユーザーのIDを後続の処理で使えるようにする
            user.id = newUser.id.toString();
          } else {
            // 既存ユーザーのIDを後続の処理で使えるようにする
            user.id = existingUser.id.toString();
          }

          return true;
        } catch (e) {
          console.error("SignIn catch error:", e);
          return false;
        }
      }

      return false;
    },
    async jwt({ token, user }) {
      // signInコールバックでuserオブジェクトにIDが設定されていれば、それをtokenに格納
      if (user?.id) {
        token.id = user.id;
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
