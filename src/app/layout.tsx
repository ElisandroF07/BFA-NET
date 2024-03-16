"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="pt-PT">
			<head>
				<link rel="manifest" href="/manifest.json" />
				<meta name="description" content="Internet Banking Plataform" />
				<title>BFA NET</title>
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
				<link rel="apple-touch-icon" href="/icon.png" />
				<meta name="theme-color" content="#fff" />
			</head>
			<body>
				<NextTopLoader
					color="orange"
					initialPosition={0.08}
					crawlSpeed={1500}
					height={3}
					crawl={false}
					showSpinner={false}
					easing="ease"
					speed={200}
					shadow="0 0 10px orange,0 0 5px orange"
				/>
				<NextUIProvider>
					<NextAuthSessionProvider>{children}</NextAuthSessionProvider>
					</NextUIProvider>
				<Analytics />
				<SpeedInsights />
				<Toaster
					toastOptions={{
						className: "toaster_error",
					}}
					position="top-right"
					closeButton
					duration={3500}
					richColors
					expand={true}
				/>
			</body>
		</html>
	);
}
