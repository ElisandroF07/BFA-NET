import nextAuthOptions from "@/libs/nextAuthOptions"
import NextAuth, { NextAuthOptions } from "next-auth"

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }