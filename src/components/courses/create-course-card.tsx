import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CourseCreateDialog from "./create-course-dialog";

const CreateCourseCard = async () => {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");
	return (
		<Card className="max-w-[200px] my-4">
			<CardHeader className="flex flex-row justify-between items-center gap-3">
				<CardTitle>New Course</CardTitle>
				<CourseCreateDialog userId={userId} />
			</CardHeader>
		</Card>
	);
};

export default CreateCourseCard;