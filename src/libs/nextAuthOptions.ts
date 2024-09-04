import api from "@/services/api"
import axios from "axios"
import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const nextAuthOptions: NextAuthOptions = {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				OTP: { label: 'text', type: 'text' }
			},
			async authorize(credentials) {
				const body = JSON.stringify({email: credentials?.email, OTP: credentials?.OTP})
					const response = await axios.post('https://environmental-kristina-franco07-98c1a6b0.koyeb.app//verifyOTP', body, {headers: {'Content-type': 'application/json'}
				})
				if (response.data?.success) {
					api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
					return response.data.user
				}
				return null
			},
		})
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
		maxAge: 1 * 24 * 60 * 60, 
	},
	pages: {
		signIn: '/login'
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
			}
      return token;
		},
		async session({ session, token }){
			if (token?.id) {
				session.user = {email: token.email || "", biNumber: token.biNumber as string}
			}
			return session
			// session = token.user as UserSession
			// const biNumber = token.user.user.biNumber as string
			// const response = await  api.get(`/getUserData/${biNumber}`)
			// session = {user: response.data.client, token: token.token}
      // return session
		}
	}
}
export default nextAuthOptions