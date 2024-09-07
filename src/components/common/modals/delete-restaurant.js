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
import { deleteRestaurant } from "@/db/queries";
import { utDeleteFiles } from "@/server/uploadthing/actions";

export default function DeleteRestaurantModal({
  id,
  name,
  imageUrl = undefined,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onConfirmClick = async (event) => {
    event.preventDefault();
    setIsDeleting(true);

    // Delete the restaurant from the database
    await deleteRestaurant(id);

    // Delete the image from uploadthing
    if (imageUrl) {
      await utDeleteFiles([imageUrl]);
    }

    setIsDeleting(false);
    setIsModalOpen(false);
    toast.success("Restaurant deleted successfully!");
  };
  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-6 w-6 lg:h-8 lg:w-8"
          onClick={() => setIsModalOpen(true)}
        >
          <Trash className="w-3 h-3 md:w-4 md:h-4" color="red" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Are you sure you want to delete ${name}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="text-slate-500">
              This will permanently delete{" "}
              <span className="text-slate-900 font-semibold">{name}</span>. You
              will have to create this entry again to undo.
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
