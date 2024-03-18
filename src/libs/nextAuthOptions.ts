import api from "@/services/api"
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
				const body = JSON.stringify({
					email: credentials?.email,
					OTP: credentials?.OTP
				})
				try {
					const response = await api.post('/verifyOTP', body)

				if (response.data && response.status === 201) {
					api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
					return response.data
				}
				return null
				}
				catch(err){
					console.log(err);
				}
			},
		})
	],
	pages: {
		signIn: '/login'
	},
	callbacks: {
		async jwt({ token, user }) {
			user && (token.user = user)
            return token;
		},
		async session({ session, token }){
			session = token.user as any
            return session
		}
	}
}

export default nextAuthOptions