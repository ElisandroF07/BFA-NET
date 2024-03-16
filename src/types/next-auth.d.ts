import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			personalData: {
				name: [string],
				gender: string,
				birthDate: string
			},
			address: {
				country: string,
				full_address: string
			},
			biNumber: string,
			email: string,
			pictureProfilePath: string
		}
	}
}