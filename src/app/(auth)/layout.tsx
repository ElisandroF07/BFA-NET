import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import nextAuthOptions from "@/libs/nextAuthOptions";

interface AuthLayoutProps {
	children: ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps){
	const session = await getServerSession(nextAuthOptions)

	if (session) {
		redirect('/dashboard')
	}

	return <>{children}</>
}