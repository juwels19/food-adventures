"use server";

import { utapi } from "./uploadthing";

export const utDeleteFiles = async (fileUrls) => {
  const fileKeys = fileUrls.map((url) => {
    const tokens = url.split("/");
    const fileKey = tokens[tokens.length - 1];
    return fileKey;
  });
  await utapi.deleteFiles(fileKeys);
};
