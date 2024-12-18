import { api } from "@/_generated/api";
import CoursesTable from "@/app/(dashboard)/teacher/courses/_components/courses-table";
import CreateCourseCard from "@/components/courses/create-course-card";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default async function TeacherCourses() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");
	const preloadedCourses = await preloadQuery(
		api.course.course.getCoursesByUser,
		{
			clerkId: userId,
		},
	);
	return (
		<div className="p-6 space-y-4">
			<CreateCourseCard />
			<CoursesTable preloadedCourses={preloadedCourses} />
		</div>
	);
}
