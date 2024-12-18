"use client";

import { api } from "@/_generated/api";
import { DataTable } from "@/components/ui/data-table";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";
import { coursesColumns } from "./courses-columns";

type Props = {
	preloadedCourses: Preloaded<typeof api.course.course.getCoursesByUser>;
};

export default function CoursesTable({ preloadedCourses }: Props) {
	const data = usePreloadedQuery(preloadedCourses);
	return (
		<DataTable
			data={data}
			columns={coursesColumns}
			displaySearch
			tableTitle="Your Courses"
			columnFilterName="title"
		/>
	);
}