import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"] // name, email, image を保持
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
} 