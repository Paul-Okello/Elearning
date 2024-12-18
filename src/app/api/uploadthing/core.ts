import { auth } from "@clerk/nextjs/server";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
	const { userId } = await auth();
	if (!userId) throw new UploadThingError("Unauthorized");
	return { userId };
};

export const OurFileRouter = {
	courseImage: f({
		image: { maxFileSize: "128MB", maxFileCount: 4 },
	})
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	courseAttachment: f(["text", "image", "video", "audio", "pdf"])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	chaptervideo: f({
		video: {
			maxFileCount: 1,
			maxFileSize: "512GB",
		},
	})
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;