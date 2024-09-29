"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import NewTagForm from "@/components/forms/tags/new-tag";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewTagModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="text-md"
        >
          Create tag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>
        <NewTagForm setIsModalOpen={setIsModalOpen} />
      </DialogContent>
    </Dialog>
  );
}
