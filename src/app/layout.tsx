'use client'

import type { Metadata } from "next";
import "@/styles/globals.css";
import NextTopLoader from 'nextjs-toploader';


// export const metadata: Metadata = {
// 	title: "BFA Net",
// 	description: "Internet Banking Plataform",
// };

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode;}>) {
	return (
		<html lang="pt-PT">
			<body><NextTopLoader
          color="orange"
          initialPosition={0.08}
          crawlSpeed={1500}
          height={2}
          crawl={false}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />{children}</body>
		</html>
	);
}
