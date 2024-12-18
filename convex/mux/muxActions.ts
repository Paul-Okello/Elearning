"use node";

import { internal } from "@/_generated/api";
import { internalAction } from "@/_generated/server";
import Mux from "@mux/mux-node";
import { ConvexError, v } from "convex/values";

// Use environment variables more safely
const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
	throw new ConvexError("Missing Mux credentials in environment variables");
}

const { video } = new Mux({
	tokenId: MUX_TOKEN_ID,
	tokenSecret: MUX_TOKEN_SECRET,
});

export const deleteMuxDataAction = internalAction({
	args: {
		muxDataId: v.id("muxData"),
		assetId: v.string(),
	},
	handler: async (ctx, { muxDataId, assetId }) => {
		const muxData = await ctx.runQuery(internal.mux.mux.getMuxData, {
			id: muxDataId,
		});

		if (!muxData) throw new ConvexError("Mux Data does not exist");

		try {
			// Delete the asset from Mux using the asset ID
			await video.assets.delete(muxData.assetId);

			// Remove the muxData entry from the database
			await ctx.runMutation(internal.mux.mux.deleteMuxData, {
				muxDataId,
			});
		} catch (error) {
			console.error("Error deleting Mux asset:", error);
			throw new ConvexError("Failed to delete Mux asset");
		}
	},
});

export const createMuxDataAssetAction = internalAction({
	args: {
		videoUrl: v.string(),
		chapterId: v.id("chapter"),
	},
	handler: async (ctx, args) => {
		const params: Mux.Video.AssetCreateParams = {
			input: [
				{
					url: args.videoUrl,
				},
			],
			playback_policy: ["public"],
			test: true,
		};

		// Create the Mux video asset
		const data = await video.assets.create(params);

		if (!data.playback_ids || data.playback_ids.length === 0) {
			throw new ConvexError("No playback ID received from Mux");
		}

		// Store the Mux asset details in the database
		await ctx.runMutation(internal.mux.mux.createMuxData, {
			chapterId: args.chapterId,
			assetId: data.id,
			playbackId: data.playback_ids[0].id,
		});
	},
});