import api from "@/services/api"
import axios from "axios"
import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { Session } from 'next-auth';

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
					const response = await axios.post('https://bfa-nodejs-api.onrender.com/verifyOTP', body, {
					headers: {
						'Content-type': 'application/json',
						Authorization: "Bearer fregr554ytg5e"
					}
				})

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
			if (user) {
				token.user = user	
			}
      return token;
		},
		async session({ session, token }){
			session = token.user as Session
			if (typeof token.user === 'object' && token.user !== null && 'biNumber' in token.user && typeof token.user.biNumber === 'string') {
				const biNumber = token.user.biNumber;
				const response = await  api.get(`/getUserData/${biNumber}`)

				session = {user: response.data.client, expires: "1h"}
			}
      return session
		}
	}
}

export default nextAuthOptions
