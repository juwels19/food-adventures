"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateTag } from "@/db/queries";
import { editTagSchema } from "@/db/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditTagForm({ tag, setIsModalOpen }) {
  const [isLoading, setIsLoading] = useState(false);

  const editTagForm = useForm({
    resolver: zodResolver(editTagSchema),
    mode: "all",
    values: { name: tag.name },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await updateTag(tag.id, editTagForm.getValues());
      toast.success("Tag successfully updated!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Tag was not updated. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...editTagForm}>
      <form
        className="flex flex-col gap-2"
        onSubmit={editTagForm.handleSubmit(onSubmit)}
      >
        {/* TAG NAME */}
        <FormField
          name="name"
          control={editTagForm.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" disabled={isLoading}>
          Save changes
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
