import { mutation, query } from "@/_generated/server";
import { defineTable } from "convex/server";
import { ConvexError, v } from "convex/values";

export const attachmentsFields = defineTable({
	name: v.string(),
	url: v.string(),
	fileKey: v.string(),
	fileType: v.optional(v.string()),
	courseId: v.optional(v.id("course")),
	chapterId: v.optional(v.id("chapter")),
})
	.index("by_courseId", ["courseId"])
	.index("by_name", ["name"])
	.index("by_nameChapter", ["name", "chapterId"])
	.index("by_courseName", ["courseId", "name"]);

export const createAttachment = mutation({
	args: {
		name: v.string(),
		url: v.string(),
		fileKey: v.string(),
		courseId: v.id("course"),
		fileType: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const course = await ctx.db.get(args.courseId);

		if (!course) throw new ConvexError("Course Not Found");

		const attachment = await ctx.db.insert("attachments", {
			...args,
		});

		await ctx.db.patch(course._id, {
			attachments: [...course.attachments, attachment],
		});

		return attachment;
	},
});

export const getCourseAttachments = query({
	args: {
		courseId: v.id("course"),
	},
	handler: async (ctx, { courseId }) => {
		const attachments = await ctx.db
			.query("attachments")
			.withIndex("by_courseId", (q) => q.eq("courseId", courseId))
			.order("desc")
			.collect();

		return attachments;
	},
});


export const deleteCourseAttachments = mutation({
	args: {
		courseId: v.id("course"),
		name: v.string(),
	},
	handler: async (ctx, { courseId, name }) => {
		const attachments = await ctx.db
			.query("attachments")
			.withIndex("by_courseId", (q) => q.eq("courseId", courseId))
			.collect();

		if (attachments.length === 0) return;

		/**
		 * TODO: Delete the attachment from uploadthing using fileId
		 */
		await Promise.all(
			attachments.map(
				async (attachment) => await ctx.db.delete(attachment._id),
			),
		);
	},
});

export const deleteAttachment = mutation({
	args: {
		attachmentId: v.id("attachments"),
		courseId: v.id("course"),
	},
	handler: async (ctx, { attachmentId, courseId }) => {
		const attachment = await ctx.db.get(attachmentId);
		const course = await ctx.db.get(courseId);

		if (!course) throw new ConvexError("Course Not Found");

		if (!attachment) throw new ConvexError("Attachment not found");

		/**
		 * TODO: Delete the attachment from uploadthing using fileId
		 */
		await ctx.db.patch(courseId, {
			attachments: course.attachments.filter((at) => at !== attachmentId),
		});
		await ctx.db.delete(attachment._id);
	},
});

export const getAttachment = query({
	args: {
		name: v.string(),
	},
	handler: async (ctx, { name }) => {
		const attachment = await ctx.db
			.query("attachments")
			.withIndex("by_name", (q) => q.eq("name", name))
			.first();

		if (!attachment) {
			throw new ConvexError("Attachment not found");
		}

		return attachment;
	},
});