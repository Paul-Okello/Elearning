"use client";

import { api } from "@/_generated/api";
import type { Id } from "@/_generated/dataModel";
import Banner from "@/components/banner";
import {
	ChapterAccessForm,
	ChapterActions,
	ChapterDescriptionForm,
	ChapterTitleForm,
	ChapterVideoForm,
} from "@/components/chapters";
import { IconBadge } from "@/components/icon-badge";
import { CardTitle } from "@/components/ui/card";
import { TypographyH2 } from "@/components/ui/typography";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowLeft, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";

type Props = {
	courseId: Id<"course">;
	chapterId: Id<"chapter">;
	preloadedChapter: Preloaded<typeof api.chapter.chapter.getChapter>;
};

const EditChapter = (props: Props) => {
	const { courseId, chapterId } = props;
	const chapter = usePreloadedQuery(props.preloadedChapter);

	const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `${completedFields}/${totalFields}`;
	const isComplete = requiredFields.every(Boolean);
	return (
		<div className="p-6">
			<div className="flex items-center justify-between">
				<div className="w-full">
					<Link
						href={`/teacher/courses/${props.courseId}`}
						className="flex items-center text-sm hover:opacity-75 transition mb-6"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to course setup
					</Link>
					<div className="flex items-center justify-between w-full">
						<div className="flex flex-col gap-y-2">
							<TypographyH2 className="border-none">
								Chapter Creation
							</TypographyH2>
							<span className="text-sm text-stone-700">
								Complete all fields {completionText}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-between items-center gap-4">
				{chapter.isPublished ? (
					<Banner label="This chapter is published" variant="success" />
				) : (
					<Banner label="This chapter is not published" variant="warning" />
				)}
				<ChapterActions
					disabled={!isComplete}
					courseId={courseId}
					chapterId={chapterId}
					isPublished={chapter.isPublished}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-4 md:col-span-2">
					<div className="">
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard} />
							<CardTitle className="text-xl capitalize">
								Customize Your Chapter
							</CardTitle>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-2">
					<ChapterTitleForm
						initialData={{ title: chapter.title ?? "" }}
						chapterId={chapterId}
					/>
					<ChapterAccessForm
						initialData={{ isFree: chapter.isFree }}
						chapterId={chapterId}
					/>
					<ChapterDescriptionForm
						initialData={{
							description: chapter.description || "Chapter Description",
						}}
						chapterId={chapterId}
					/>
				</div>
				<div className="space-y-4">
					<div className="flex items-center gap-x-2">
						<IconBadge icon={Video} />
						<CardTitle className="text-xl capitalize">Add a video</CardTitle>
					</div>
					<div className="grid grid-cols-1 gap-2">
						<ChapterVideoForm initialData={chapter} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditChapter;