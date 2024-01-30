"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const router = useRouter();

	if (isAuthenticated) {
		return (
			<h1>
				Bem Vindo
			</h1>
		)
	}
	router.replace('/auth/sign-in')
}
