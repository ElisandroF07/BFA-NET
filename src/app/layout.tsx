import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
	title: "BFA Net",
	description: "Internet Banking Plataform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-PT">
			<body>{children}</body>
		</html>
	);
}
