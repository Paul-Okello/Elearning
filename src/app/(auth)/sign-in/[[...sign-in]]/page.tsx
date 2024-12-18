
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Sign In",
	description: "Sign in to your account",
};

export default function SignInPage() {
	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
			<div className="h-full flex flex-col items-center justify-center px-4 relative">
				<div className="absolute left-2 top-2 md:top-3 md:left-5">
					<Link href="/">
						<Image src="/logo.webp" width={80} height={80} alt="logo" />
					</Link>
				</div>
				<div className="text-center space-y-4 pt-4">
					<TypographyH1>Welcome Back!</TypographyH1>
					<TypographyP>Log in or create account!</TypographyP>
				</div>
				<div className="flex items-center justify-center mt-8">
					<ClerkLoaded>
						<SignIn signUpUrl="" path="/sign-in" afterSignOutUrl="/" />
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