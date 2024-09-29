"use client";
import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteTag } from "@/db/queries";
import { cn } from "@/lib/utils";

export default function DeleteTagModal({ tag }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onConfirmClick = async () => {
    setIsDeleting(true);

    const result = await deleteTag(tag.id);

    setIsDeleting(false);
    setIsModalOpen(false);
    if (result.ok) {
      toast.success("Tag deleted successfully!");
    } else {
      toast.error(result.message);
    }
  };
  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsModalOpen(true)}
          disabled={tag._count.restaurants !== 0}
        >
          <Trash color="red" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-slate-500">
              This will permanently delete the tag{" "}
              <span className="text-slate-900 font-semibold">{tag.name}</span>.
              You will have to create this tag again to undo.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={onConfirmClick}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
