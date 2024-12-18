import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL as string),
	title: "Sign Up",
	description: "Sign up for an account",
};

export default function SignUpPage() {
	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
			<div className="h-full flex flex-col items-center justify-center px-4 relative">
				<div className="absolute left-2 top-2 md:top-3 md:left-5">
					<Link href="/">
						<Image src="/logo.webp" width={60} height={60} alt="logo" />
					</Link>
				</div>
				<div className="text-center space-y-4 pt-4">
					<TypographyH1>Welcome Back!</TypographyH1>
					<TypographyP>Log in or create account!</TypographyP>
				</div>
				<div className="flex items-center justify-center mt-8">
					<ClerkLoaded>
						<SignUp afterSignOutUrl="/" path="/sign-up" />
					</ClerkLoaded>
					<ClerkLoading>
						<Loader className="size-16 animate-spin text-muted-foreground" />
					</ClerkLoading>
				</div>
			</div>
			<div className="h-full  hidden lg:flex items-center justify-center relative">
				<Image src="/auth-layout.webp" fill alt="logo" />
			</div>
		</div>
	);
}