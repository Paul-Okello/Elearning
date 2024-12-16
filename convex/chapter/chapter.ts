import { internal } from "@/_generated/api";
import { mutation, query } from "@/_generated/server";
import { deleteChapterAttachments } from "@/attachments";
import { getChapterById } from "@/chapter/chapterUtils";
import { getMuxDataByChapterId } from "@/mux/mux";
import { defineTable } from "convex/server";
import { ConvexError, v } from "convex/values";
import { getChapterAttachments } from "../attachments";

export const chapterFields = defineTable({
	courseId: v.id("course"),
	title: v.optional(v.string()),
	description: v.optional(v.string()),
	videoUrl: v.optional(v.string()),
	position: v.number(),
	isPublished: v.boolean(),
	isFree: v.boolean(),
})
	.index("by_courseId", ["courseId"])
	.index("by_title", ["title"]);

export const getAllChaptersByCourse = query({
	args: {
		courseId: v.id("course"),
	},
	handler: async (ctx, { courseId }) => {
		const chapters = await ctx.db
			.query("chapter")
			.withIndex("by_courseId", (q) => q.eq("courseId", courseId))
			.collect();

		const data = await Promise.all(
			chapters.map(async (chapter) => {
				const muxData = await getMuxDataByChapterId(ctx, {
					chapterId: chapter._id,
				});

				const chapterAttachments = await getChapterAttachments(ctx, {
					chapterId: chapter._id,
				});

				return {
					...chapter,
					...{
						muxDataId: muxData?._id,
						muxAssetId: muxData?.assetId,
						playbackId: muxData?.playbackId,
						attachments: chapterAttachments,
					},
				};
			}),
		);

		return data.sort((a, b) => a.position - b.position);
	},
});

export const createChapter = mutation({
	args: {
		title: v.string(),
		courseId: v.id("course"),
	},
	handler: async (ctx, args) => {
		const chapters = await getAllChaptersByCourse(ctx, {
			courseId: args.courseId,
		});

		return await ctx.db.insert("chapter", {
			courseId: args.courseId,
			title: args.title,
			position: chapters.length + 1,
			isPublished: false,
			isFree: false,
		});
	},
});

export const updateChapterPositions = mutation({
	args: {
		chapters: v.array(
			v.object({
				chapterId: v.id("chapter"),
				position: v.number(),
			}),
		),
	},
	handler: async (ctx, args) => {
		if (args.chapters.length === 0)
			throw new ConvexError("No chapters provided");

		await Promise.all(
			args.chapters.map(async ({ chapterId, position }) => {
				await ctx.db.patch(chapterId, {
					position,
				});
			}),
		);
	},
});

export const updateChapter = mutation({
	args: {
		chapterId: v.id("chapter"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		videoUrl: v.optional(v.string()),
		isPublished: v.optional(v.boolean()),
		isFree: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const { chapterId, videoUrl, ...rest } = args;

		const currentMux = await getMuxDataByChapterId(ctx, {
			chapterId,
		});

		const currentChapter = await getChapterById(ctx, chapterId);
		if (!currentChapter) throw new ConvexError("Chapter not found");

		if (currentMux) {
			await ctx.scheduler.runAfter(
				0,
				internal.mux.muxActions.deleteMuxDataAction,
				{ muxDataId: currentMux._id, assetId: currentMux.assetId },
			);
		}

		if (videoUrl) {
			try {
				await ctx.scheduler.runAfter(
					0,
					internal.mux.muxActions.createMuxDataAssetAction,
					{ videoUrl, chapterId },
				);

				return await ctx.db.patch(chapterId, {
					videoUrl,
				});
			} catch (error) {
				console.error("Error creating new Mux asset:", error);
				throw new ConvexError("Failed to process new video");
			}
		}

		return await ctx.db.patch(chapterId, {
			...rest,
		});
	},
});

export const deleteChapter = mutation({
	args: {
		chapterId: v.id("chapter"),
		courseId: v.id("course"),
	},
	handler: async (ctx, { chapterId, courseId }) => {
		const chapter = await getChapterById(ctx, chapterId);
		const muxData = await getMuxDataByChapterId(ctx, { chapterId });

		if (!chapter) throw new ConvexError("Chapter does not exist");

		// Delete the Mux data if it exists
		if (muxData) {
			await ctx.scheduler.runAfter(
				0,
				internal.mux.muxActions.deleteMuxDataAction,
				{
					assetId: muxData.assetId,
					muxDataId: muxData._id,
				},
			);
			await ctx.db.delete(muxData._id);
		}

		// Get all chapters in the course
		const allChapters = await getAllChaptersByCourse(ctx, { courseId });

		// Check if the chapter being deleted is published
		const isDeletingPublishedChapter = chapter.isPublished;

		// Check if there are other chapters in the course
		const hasOtherChapters = allChapters.length > 1;

		// If there are no other chapters or only the published chapter is being deleted, handle course unpublishing
		if (
			!hasOtherChapters ||
			(isDeletingPublishedChapter && !hasOtherChapters)
		) {
			// Unpublish the course
			await ctx.db.patch(courseId, { isPublished: false });
		}

		await deleteChapterAttachments(ctx, { chapterId });

		// Delete the chapter
		await ctx.db.delete(chapterId);
	},
});

export const getChapter = query({
	args: {
		chapterId: v.id("chapter"),
	},
	handler: async (ctx, { chapterId }) => {
		const chapter = await getChapterById(ctx, chapterId);
		if (!chapter) throw new ConvexError("Chapter not found");

		const muxData = await getMuxDataByChapterId(ctx, { chapterId });
		const chapterAttachments = await getChapterAttachments(ctx, {
			chapterId: chapter._id,
		});

		return {
			...chapter,
			...{
				muxDataId: muxData?._id,
				muxAssetId: muxData?.assetId,
				playbackId: muxData?.playbackId,
				attachments: chapterAttachments,
			},
		};
	},
});