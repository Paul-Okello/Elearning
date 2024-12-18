import { api } from "@/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography";
import { currentUser } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export default async function Newuser() {
	const user = await currentUser();
	if (!user) redirect("/sign-in");
	const dbUser = await fetchQuery(api.user.user.getDbUser, {
		clerkId: user.id,
	});

	if (dbUser) {
		if (dbUser.role === "Student") {
			redirect("/index");
		}
		redirect("/teacher/courses");
	} else {
		await fetchMutation(api.user.user.createUser, {
			clerkId: user.id,
			firstName: user.firstName as string,
			lastName: user.lastName as string,
			email: user.emailAddresses[0].emailAddress,
			image: user.imageUrl,
		});

		redirect("/index");
	}

	return (
		<div className="min-h-screen w-full flex items-center justify-center">
			<Card className="max-w-xl mx-auto w-full shadow-xl">
				<CardContent className="p-6">
					<div className="space-y-6 flex items-center justify-center flex-col">
						<Image src="/loader.svg" width={150} height={150} alt="loader" />
						<TypographyH4 className="text-center animate-bounce">
							Checking Your Information 😇
						</TypographyH4>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
