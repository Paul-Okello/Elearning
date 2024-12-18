import { api } from "@/_generated/api";
import CourseList from "@/components/courses/course-list";
import { preloadQuery } from "convex/nextjs";
import React from "react";

export default async function StudentPage() {
	const preloadCourses = await preloadQuery(api.course.course.getAllCourses);
	return (
		<div className="p-4">
			<CourseList preloadCourses={preloadCourses} />
		</div>
	);
}
