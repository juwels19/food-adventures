"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateTag } from "@/db/queries";
import { editTagSchema } from "@/db/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditTagForm({ tag, setIsModalOpen }) {
  const [isLoading, setIsLoading] = useState(false);

  const editTagForm = useForm({
    resolver: zodResolver(editTagSchema),
    mode: "all",
    values: { name: tag.name, backgroundColour: tag.backgroundColour },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TAG NAME */}
          <FormField
            name="name"
            control={editTagForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BACKGROUND COLOUR */}
          <FormField
            name="backgroundColour"
            control={editTagForm.control}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Colour</FormLabel>
                <FormControl>
                  <HexColorPicker
                    className="!w-full"
                    color={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="lg" disabled={isLoading} className="mt-2">
          Save changes
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
