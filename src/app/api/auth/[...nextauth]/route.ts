import api from "@/services/api"
import axios from "axios"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const nextAuthOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'email', type: 'text' },
				OTP: { label: 'text', type: 'text' }
			},
			async authorize(credentials, req) {
				const body = JSON.stringify({
					email: credentials?.email,
					OTP: credentials?.OTP
				})
				
				const response = await axios.post('http://localhost:5000/verifyOTP', body, {
					headers: {
						'Content-type': 'application/json'
					}
				})

				if (response.data && response.status === 201) {
					// Seta o token de autorização no Axios para futuras requisições
					// biome-ignore lint/complexity/useLiteralKeys: <explanation>
					api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
					
					return response.data
				}
				return null
			},
		})
	],
	pages: {
		signIn: '/login'
	},
	callbacks: {
		async jwt({ token, user }) {
			// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		user && (token.user = user)
			return token
		},
		async session({ session, token }){
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			session  = token.user as any
			return session
		}
	}
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST, nextAuthOptions }