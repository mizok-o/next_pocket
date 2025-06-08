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
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null
				}

				const { data: user, error } = await supabase
					.from("users")
					.select("id, email, password")
					.eq("email", credentials.email)
					.single()

				if (error || !user) {
					return null
				}

				const isValidPassword = await bcrypt.compare(
					credentials.password,
					user.password
				)

				if (!isValidPassword) {
					return null
				}

				return {
					id: user.id.toString(),
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