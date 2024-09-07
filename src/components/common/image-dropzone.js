"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "@uploadthing/react";
import { FolderUp, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

import { useUploadThing } from "@/components/common/uploadthing";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { utDeleteFiles } from "@/server/uploadthing/actions";
import Image from "next/image";

export default function ImageDropzone({
  disabled = false,
  imagePrefix,
  onSuccessCallback,
  onErrorCallback,
  onDeleteCallback,
  initialImageUrl,
}) {
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isDeleting, setIsDeleting] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (result) => {
      toast.dismiss();
      toast.success("Image uploaded successfully!");
      setImageUrl(result[0].url);
      if (onSuccessCallback) onSuccessCallback(result);
    },
    onUploadError: () => {
      toast.error("Image upload failed! Try again!");
      if (onErrorCallback) onErrorCallback();
    },
    onBeforeUploadBegin: (files) => {
      if (!imagePrefix) return files;

      // This adds a prefix of the restaurant name to the image
      return files.map((f) => {
        return new File([f], `${imagePrefix}_${f.name}`, {
          type: f.type,
        });
      });
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    disabled,
    onDrop,
    maxFiles: 1,
    maxSize: 4e6,
  });

  useEffect(() => {
    // If we already have an imageUrl, we know that we're "Editing" the image
    async function deleteFile() {
      return await utDeleteFiles([imageUrl]);
    }
    if (imageUrl) {
      deleteFile();
    }
    if (files.length > 0) {
      toast.loading("Image is uploading...");
      startUpload(files);
    }
  }, [files]);

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className={cn(
          disabled
            ? "text-slate-400 cursor-not-allowed"
            : "text-slate-900 cursor-pointer",
          !imageUrl && "border-2 border-dashed",
          "flex flex-col p-4 items-center rounded-md relative"
        )}
      >
        <Input {...getInputProps()} />
        {!imageUrl ? (
          <>
            {isUploading || isDeleting ? (
              <Loader2 size={40} color="black" className="animate-spin" />
            ) : (
              <FolderUp size={40} color={disabled ? "lightgray" : "black"} />
            )}
            <p
              className={cn(
                disabled ? "text-slate-300" : "text-slate-900",
                "text-center"
              )}
            >
              {disabled && "First enter a restaurant name..."}
              {isUploading && !disabled && "Image is uploading..."}
              {isDeleting && !disabled && "Image is deleting..."}
              {!isUploading &&
                !disabled &&
                "Drag and drop a file here, or click to select! (4MB max)"}
            </p>
          </>
        ) : (
          <div className="min-h-48 min-w-full relative">
            <Image
              alt="image preview"
              src={imageUrl}
              layout="fill"
              className="object-cover relative"
              sizes="(max-width: 340px) 100vw, (max-width: 1200px) 50vw, 33vw"
              objectFit="contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-6 md:size-8 absolute -top-3 -right-2"
              onClick={async (e) => {
                toast.loading("Image is deleting...");
                e.preventDefault();
                e.stopPropagation();
                setIsDeleting(true);
                await utDeleteFiles([imageUrl]);
                setImageUrl();
                setFiles([]);
                if (onDeleteCallback) onDeleteCallback();
                setIsDeleting(false);
                toast.dismiss();
                toast.success("Image deleted successfully!");
              }}
            >
              <Trash color="red" className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
