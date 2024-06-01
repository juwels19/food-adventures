import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1, minFileCount: 1 },
  }).onUploadComplete(async ({ file }) => {
    console.log("image uploaded to: ", file.url);
    return { imageUrl: file.url };
  }),
};
