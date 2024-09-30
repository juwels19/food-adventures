"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";

import { restaurantSchema } from "@/db/schemas";
import { cn } from "@/lib/utils";

import TagMultiSelect from "../common/tag-multi-select";
import { updateRestaurant } from "@/db/queries";
import ImageDropzone from "@/components/common/image-dropzone";
import { tokenizeRestaurantName } from "../utils";

export default function EditRestaurantForm({
  restaurant,
  initialTags,
  setIsModalOpen,
}) {
  const [tags, setTags] = useState(initialTags);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const editRestaurantForm = useForm({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: restaurant.name,
      address: restaurant.address,
      visited: restaurant.visited,
      ...(restaurant.dateVisited && {
        dateVisited: dayjs(restaurant.dateVisited).toDate(),
      }),
      ...(restaurant.rating && { rating: restaurant.rating }),
      ...(restaurant.comments && { comments: restaurant.comments }),
      ...(restaurant.imageUrl && { imageUrl: restaurant.imageUrl }),
    },
  });

  const imageUrl = editRestaurantForm.watch("imageUrl");

  const onConfirmClick = async () => {
    setIsLoading(true);
    const timestamp = dayjs().format("YYYY-MM-DD");

    const updatePayload = {
      ...restaurant,
      id: undefined,
      ...editRestaurantForm.getValues(),
      ...(editRestaurantForm.getValues().visited && {
        dateVisited: dayjs(editRestaurantForm.getValues().dateVisited).format(
          "YYYY-MM-DD"
        ),
      }),
      tags: tags.map((tag) => tag.id),
      updatedAt: timestamp,
      imageUrl,
    };
    try {
      await updateRestaurant(updatePayload, restaurant.id, "/");
      toast.success(`${restaurant.name} edited successfully!`);
      mutate("/api/restaurants/visited");
      mutate("/api/restaurants/not-visited");
    } catch (err) {
      toast.error(`${restaurant.name} failed to update! Please try again.`);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <Form {...editRestaurantForm}>
      <form
        onSubmit={editRestaurantForm.handleSubmit(onConfirmClick)}
        className="flex flex-col gap-2"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* DATE VISITED */}
          <FormField
            name="dateVisited"
            control={editRestaurantForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Date Visited</FormLabel>
                <FormControl>
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 justify-start font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? dayjs(field.value).format("MMMM D, YYYY")
                            : "Click to pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        defaultMonth={field.value}
                        onSelect={(value) => {
                          editRestaurantForm.setValue(
                            "visited",
                            value ? true : false
                          );
                          field.onChange(value);
                        }}
                        disabled={(date) =>
                          date > dayjs() || date < dayjs("2024-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* RATING */}
          <FormField
            name="rating"
            control={editRestaurantForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Rating</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    type="tel"
                    onChange={(e) => {
                      if (e.target.validity.valid) {
                        field.onChange(e.target.value);
                        editRestaurantForm.setValue("rating", e.target.value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* TAGS */}
        <FormField
          name="tags"
          control={editRestaurantForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Tags</FormLabel>
              <FormControl>
                <TagMultiSelect {...field} setTags={setTags} tags={tags} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* COMMENTS */}
        <FormField
          name="comments"
          control={editRestaurantForm.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any comments here..."
                  className="max-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* IMAGE UPLOAD/PREVIEW */}
        <FormField
          name="imageUrl"
          control={editRestaurantForm.control}
          render={() => (
            <FormItem>
              <FormLabel className="text-lg">Image Upload</FormLabel>
              <FormControl>
                <ImageDropzone
                  initialImageUrl={imageUrl}
                  imagePrefix={tokenizeRestaurantName(
                    editRestaurantForm.getValues("name")
                  )}
                  onSuccessCallback={(result) => {
                    editRestaurantForm.setValue("imageUrl", result[0].url);
                    editRestaurantForm.clearErrors("imageUrl");
                  }}
                  onDeleteCallback={() => {
                    editRestaurantForm.setValue("imageUrl", undefined);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="pt-2 gap-2">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
