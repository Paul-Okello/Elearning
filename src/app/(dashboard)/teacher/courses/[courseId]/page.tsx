import { api } from "@/_generated/api";
import { Id } from "@/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import EditCourse from "./_components/edit-course";

type Props = {
	params: Promise<{
		courseId: Id<"course">;
	}>;
};

export default async function SingleCoursePage({ params }: Props) {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");

	const { courseId } = await params;
	const preloadCourse = await preloadQuery(api.course.course.getCourse, {
		courseId,
	});

	return <EditCourse userId={userId} preloadedCourse={preloadCourse} />;
}
