"use client";

import { api } from "@/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";
import CourseCard from "./course-card";

type Props = {
	preloadCourses: Preloaded<typeof api.course.course.getAllCourses>;
};

export default function CourseList(props: Props) {
	const data = usePreloadedQuery(props.preloadCourses);
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{data.length > 0 ? (
				data.map((course) => <CourseCard key={course._id} course={course} />)
			) : (
				<div className="min-h-screen text-center md:col-span-2 lg:col-span-3">
					No courses found
				</div>
			)}
		</div>
	);
}
