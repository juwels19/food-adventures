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
          className="rounded-full h-6 w-6 lg:h-8 lg:w-8"
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil className="w-3 h-3 md:w-4 md:h-4" color="black" />
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
