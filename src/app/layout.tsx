import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import RootProvider from "@/components/providers/root-provider";

const openSans = Open_Sans({
	variable: "--font-open-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Edu Learn",
	description:
		"Edu Learn is a platform for creating and sharing educational content",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<html lang="en">
				<body className={`${openSans.className}  antialiased`}>
					<RootProvider>{children}</RootProvider>
				</body>
			</html>
		</AuthProvider>
	);
}
