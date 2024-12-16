import { internalMutation, internalQuery, query } from "@/_generated/server";
import { defineTable } from "convex/server";
import { ConvexError, v } from "convex/values";

export const muxDataFields = defineTable({
	chapterId: v.id("chapter"),
	assetId: v.string(),
	playbackId: v.optional(v.string()),
}).index("by_chapterId", ["chapterId"]);

export const getMuxDataByChapterId = query({
	args: {
		chapterId: v.id("chapter"),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("muxData")
			.withIndex("by_chapterId", (q) => q.eq("chapterId", args.chapterId))
			.first();
	},
});

// Deletes a MuxData entry from the database
export const deleteMuxData = internalMutation({
	args: {
		muxDataId: v.id("muxData"),
	},
	async handler(ctx, args) {
		const data = await ctx.db.get(args.muxDataId);
		if (!data) {
			throw new ConvexError("Mux data does not exist");
		}

		// Delete the MuxData entry and return the result
		return await ctx.db.delete(data._id);
	},
});

// Retrieves a MuxData entry from the database
export const getMuxData = internalQuery({
	args: {
		id: v.id("muxData"),
	},
	async handler(ctx, args) {
		const data = await ctx.db.get(args.id);
		if (!data) {
			throw new ConvexError("Mux data does not exist");
		}
		return data;
	},
});

// Creates a new MuxData entry in the database
export const createMuxData = internalMutation({
	args: {
		chapterId: v.id("chapter"),
		assetId: v.string(),
		playbackId: v.optional(v.string()),
	},
	async handler(ctx, args) {
		const chapter = await ctx.db.get(args.chapterId);
		if (!chapter) {
			throw new ConvexError("No Chapter");
		}
		return await ctx.db.insert("muxData", {
			chapterId: chapter._id,
			assetId: args.assetId,
			playbackId: args.playbackId,
		});
	},
});