import { Id } from "@/_generated/dataModel";
import { mutation, query } from "@/_generated/server";
import { createAttachment, getCourseAttachments } from "@/attachments";
import { deleteChapter, getAllChaptersByCourse } from "@/chapter/chapter";
import { courseCategories, getCourseById } from "@/course/courseUtils";
import { getUserById } from "@/user/userUtils";
import { defineTable, paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

export const courseFields = defineTable({
	userId: v.id("user"),
	title: v.optional(v.string()),
	description: v.optional(v.string()),
	images: v.array(
		v.object({
			imageUrl: v.string(),
			imageKey: v.string(),
		}),
	),
	price: v.optional(v.float64()),
	isPublished: v.boolean(),
	category: v.optional(courseCategories),
	attachments: v.array(v.id("attachments")),
})
	.index("by_userId", ["userId"])
	.index("by_title", ["title"])
	.index("by_category", ["category"]);

export const createCourse = mutation({
	args: {
		title: v.string(),
		clerkId: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await getUserById(ctx, args.clerkId);

		if (!user) throw new ConvexError("User not found");

		return ctx.db.insert("course", {
			userId: user._id,
			title: args.title,
			isPublished: false,
			attachments: [],
			images: [],
		});
	},
});

export const deleteCourse = mutation({
	args: {
		courseId: v.id("course"),
		clerkId: v.string(),
	},
	handler: async (ctx, { courseId, clerkId }) => {
		const user = await getUserById(ctx, clerkId);

		if (!user) throw new ConvexError("User not found");

		const course = await getCourseById(ctx, courseId);
		if (!course) throw new ConvexError("Course not found");

		if (course.userId !== user._id) throw new ConvexError("Not authorized");

		// Get all chapters in the course
		const allChapters = await getAllChaptersByCourse(ctx, { courseId });

		await Promise.all(
			allChapters.map(async (chapter) => {
				await deleteChapter(ctx, { courseId, chapterId: chapter._id });
			}),
		);

		await ctx.db.delete(courseId);
	},
});

export const getCourse = query({
	args: {
		courseId: v.id("course"),
	},
	handler: async (ctx, { courseId }) => {
		const course = await getCourseById(ctx, courseId);
		if (!course) throw new ConvexError("Course not found");
		const courseAttachments = await getCourseAttachments(ctx, {
			courseId,
		});
		const chapters = await getAllChaptersByCourse(ctx, { courseId });

		return {
			...course,
			chapters,
			attachments: courseAttachments,
		};
	},
});

export const getAllCourses = query({
	args: { paginationOpts: paginationOptsValidator },
	handler: async (ctx, args) => {
		const courses = await ctx.db
			.query("course")
			.order("desc")
			.paginate(args.paginationOpts);

		return await Promise.all(
			courses.page.map(async (course) => {
				const chapters = await getAllChaptersByCourse(ctx, {
					courseId: course._id,
				});

				return {
					...course,
					chapters,
				};
			}),
		);
	},
});

export const updateCourse = mutation({
	args: {
		courseId: v.id("course"),
		title: v.optional(v.string()),
		description: v.optional(v.string()),
		images: v.optional(
			v.array(
				v.object({
					imageUrl: v.string(),
					imageKey: v.string(),
				}),
			),
		),
		price: v.optional(v.float64()),
		isPublished: v.optional(v.boolean()),
		category: v.optional(courseCategories),
		fileName: v.optional(v.string()),
		fileType: v.optional(v.string()),
		fileKey: v.optional(v.string()),
		fileUrl: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const course = await getCourseById(ctx, args.courseId);

		if (args.fileKey && args.fileName && args.fileType && args.fileUrl) {
			const attachementId = await createAttachment(ctx, {
				fileKey: args.fileKey,
				name: args.fileName,
				fileType: args.fileType,
				url: args.fileUrl,
				courseId: course._id,
			});

			return await ctx.db.patch(args.courseId, {
				attachments: [...course.attachments.map((a) => a._id), attachementId],
			});
		}

		return await ctx.db.patch(args.courseId, {
			title: args.title ?? course.title,
			description: args.description ?? course.description,
			images: [...course.images, ...(args.images ?? [])],
			price: args.price ?? course.price,
			isPublished: args.isPublished ?? course.isPublished,
			category: args.category ?? course.category,
		});
	},
});

export const publishCourse = mutation({
	args: {
		courseId: v.id("course"),
	},
	handler: async (ctx, { courseId }) => {
		const course = await getCourse(ctx, {
			courseId,
		});

		const publishedChapters = course.chapters.filter(
			(chapter) => chapter.isPublished === true,
		);

		if (publishedChapters.length === 0) {
			throw new ConvexError("Course must have at least one published chapter");
		}

		await ctx.db.patch(courseId, {
			isPublished: true,
		});

		await ctx.db.patch(courseId, {
			isPublished: true,
		});
	},
});

export const unpublishCourse = mutation({
	args: {
		courseId: v.id("course"),
	},
	handler: async (ctx, { courseId }) => {
		const course = await getCourse(ctx, {
			courseId,
		});

		await ctx.db.patch(course._id, {
			isPublished: false,
		});
	},
});