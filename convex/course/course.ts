import { mutation, query } from "@/_generated/server";
import { deleteChapter, getAllChaptersByCourse } from "@/chapter/chapter";
import { getCourseById } from "@/course/courseUtils";
import { getUserById } from "@/user/userUtils";
import { defineTable, paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

export const courseFields = defineTable({
	userId: v.id("user"),
	title: v.optional(v.string()),
	description: v.optional(v.string()),
	imageUrl: v.optional(v.string()),
	price: v.optional(v.float64()),
	isPublished: v.boolean(),
	categoryId: v.optional(v.id("category")),
	attachments: v.optional(v.array(v.id("attachments"))),
})
	.index("by_userId", ["userId"])
	.index("by_title", ["title"])
	.index("by_categoryId", ["categoryId"]);

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
		const chapters = await getAllChaptersByCourse(ctx, { courseId });

		return {
			...course,
			chapters,
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