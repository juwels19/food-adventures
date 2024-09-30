"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import EditRestaurantForm from "@/components/forms/restaurant/edit";

export default function EditRestaurantModal({ restaurant, initialTags }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full size-7 lg:size-8"
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil className="size-4" color="black" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{restaurant.name}</DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-slate-900">Note:</span> You{" "}
            <span className="italic">cannot</span> edit the restaurant name or
            address. To do so, you must delete this entry and re-create it.
          </DialogDescription>
        </DialogHeader>
        <EditRestaurantForm
          restaurant={restaurant}
          initialTags={initialTags}
          setIsModalOpen={setIsModalOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
