"use client";

import { useState } from "react";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import EditTagForm from "@/components/forms/tags/edit-tag";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function EditTagModal({ tag }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsModalOpen(true)}
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
        </DialogHeader>
        <EditTagForm tag={tag} setIsModalOpen={setIsModalOpen} />
      </DialogContent>
    </Dialog>
  );
}
