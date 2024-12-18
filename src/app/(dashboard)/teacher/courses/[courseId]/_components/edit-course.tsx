"use client";

import { api } from "@/_generated/api";
import Banner from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { CardDescription } from "@/components/ui/card";
import { TypographyH2, TypographyH3 } from "@/components/ui/typography";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import {
	CircleDollarSign,
	File,
	LayoutDashboard,
	ListCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

import {
	CourseActions,
	CourseAttachmentForm,
	CourseCategoryForm,
	CourseChaptersForm,
	CourseDescriptionForm,
	CourseImageForm,
	CoursePriceForm,
	CourseTitleForm,
} from "@/components/courses/edit-course";

type Props = {
	userId: string;
	preloadedCourse: Preloaded<typeof api.course.course.getCourse>;
};

function EditCourse({ userId, preloadedCourse }: Props) {
	const course = usePreloadedQuery(preloadedCourse);
	if (!course) redirect("/teacher/courses");

	const requiredFields = [
		course.title,
		course.description,
		course.images.length > 0,
		course.price,
		course.category,
		course.chapters.some((chapter) => chapter.isPublished),
	];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `(${completedFields}/${totalFields})`;
	const isComplete = requiredFields.every(Boolean);
	return (
		<div className="flex flex-col min-h-screen">
			{!course.isPublished && (
				<Banner label="This course is unpublished. It will not be visible to the learners" />
			)}
			<div className="flex-1 p-6">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-x-4">
					<div className="flex flex-col gap-y-2 flex-1 ">
						<TypographyH2 className="text-3xl capitalize">
							Course Setup
						</TypographyH2>
						<CardDescription>
							Complete all fields {completionText}
						</CardDescription>
					</div>
					<CourseActions
						disabled={!isComplete}
						courseId={course._id}
						isPublished={course.isPublished}
						userId={userId}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
					<div className="space-y-6">
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard} />
							<TypographyH3 className="text-xl">
								Customize your course
							</TypographyH3>
						</div>
						<CourseTitleForm initialData={course} />
						<CourseDescriptionForm initialData={course} />
						<CourseImageForm initialData={course} />

						<CourseCategoryForm initialData={course} />
					</div>
					<div className="space-y-6">
						<div className="space-y-6">
							<div className="flex items-center gap-x-2">
								<IconBadge icon={ListCheck} />
								<TypographyH3 className="text-xl capitalize">
									Course Chapters
								</TypographyH3>
							</div>
							<div className="">
								<CourseChaptersForm initialData={course} />
							</div>
						</div>
						<div className="space-y-6">
							<div className="flex items-center gap-x-2">
								<IconBadge icon={CircleDollarSign} />
								<TypographyH3 className="text-xl capitalize">
									Sell Your Course
								</TypographyH3>
							</div>
							<CoursePriceForm initialData={course} />
						</div>
						<div className="space-y-6">
							<div className="flex items-center gap-x-2">
								<IconBadge icon={File} />
								<TypographyH3 className="text-xl capitalize">
									Resources & Attachments
								</TypographyH3>
							</div>
							<CourseAttachmentForm initialData={course} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditCourse;