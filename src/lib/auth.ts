import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "../app/supabaseClient"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: Credentials | undefined) {
				if (!credentials?.email || !credentials?.password) {
					console.log("❌ 認証失敗: 認証情報が不足")
					return null
				}

				console.log("🔍 ユーザー検索:", credentials.email)

				const { data: user, error } = await supabase
					.from("users")
					.select("id, email, password")
					.eq("email", credentials.email)
					.single()

				if (error) {
					console.log("❌ データベースエラー:", error)
					return null
				}

				if (!user) {
					console.log("❌ ユーザーが見つかりません:", credentials.email)
					return null
				}

				console.log("✅ ユーザー発見:", user.email)

				const isValidPassword = await bcrypt.compare(
					credentials.password,
					user.password
				)

				if (!isValidPassword) {
					console.log("❌ パスワード不一致")
					return null
				}

				console.log("✅ 認証成功:", user.email)

				return {
					id: user.id,
					email: user.email,
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string
			}
			return session
		},
	},
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
}