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
import { createTag } from "@/db/queries";
import { createTagSchema } from "@/db/schemas";
import { TAG_TYPES } from "@/lib/constants";
import { generateValidLightContrastColour } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewTagForm({ setIsModalOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [colour, setColour] = useState(generateValidLightContrastColour());

  const newTagForm = useForm({
    mode: "all",
    resolver: zodResolver(createTagSchema),
    values: {
      type: TAG_TYPES.RESTAURANT,
      fontColour: "#F4FFF8",
    },
  });

  const onSubmit = async () => {
    setIsLoading(true);

    const result = await createTag(newTagForm.getValues());

    if (result) {
      toast.success(
        `${newTagForm.getValues("name")} was successfully created!`
      );
      setIsModalOpen(false);
    } else {
      toast.error(`Tag was not created. Please try again`);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    newTagForm.setValue("backgroundColour", colour);
  }, []);

  return (
    <Form {...newTagForm}>
      <form
        onSubmit={newTagForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TAG NAME */}
          <FormField
            name="name"
            control={newTagForm.control}
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
            control={newTagForm.control}
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Colour</FormLabel>
                <FormControl>
                  <HexColorPicker
                    className="!w-full"
                    color={colour}
                    onChange={(value) => {
                      field.onChange(value);
                      setColour(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          className="text-md mt-2"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create tag
        </Button>
      </form>
    </Form>
  );
}
