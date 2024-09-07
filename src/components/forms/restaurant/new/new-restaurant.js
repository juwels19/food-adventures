"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Pencil, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { utDeleteFiles } from "@/server/uploadthing/actions";
import { restaurantSchema } from "@/db/schemas";
import { createRestaurant } from "@/db/queries";
import { cn } from "@/lib/utils";
import ROUTES from "@/lib/routes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import GoogleAutocomplete from "@/components/common/google-autocomplete";
import SingleLocationMap from "@/components/maps/single-location-map";
import { useUploadThing } from "@/components/common/uploadthing";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import TagMultiSelect from "../common/tag-multi-select";
import { tokenizeRestaurantName } from "../utils";
import ImageDropzone from "@/components/common/image-dropzone";
import { Label } from "@/components/ui/label";

export default function NewRestaurantForm() {
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullLocationDetails, setFullLocationDetails] = useState();

  const router = useRouter();

  const newRestaurantForm = useForm({
    resolver: zodResolver(restaurantSchema),
    mode: "all",
    values: { visited: false },
  });

  const restaurantName = newRestaurantForm.watch("name");

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    const lat = await fullLocationDetails.geometry.location.lat();
    const lng = await fullLocationDetails.geometry.location.lng();
    const timestamp = dayjs().format("YYYY-MM-DD");
    const fullPayload = {
      ...formData,
      ...(formData.visited && {
        dateVisited: dayjs(formData.dateVisited).format("YYYY-MM-DD"),
      }),
      ...(tags.length > 0 && {
        tags: tags.map((tag) => tag.id) || [],
      }),
      ...(fullLocationDetails && {
        lat,
        lng,
      }),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const saveResult = await createRestaurant(fullPayload);
    if (!saveResult) {
      setIsSubmitting(false);
      toast.error(
        `Error: ${formData.name} was not added to the list. Try again!`
      );
      return;
    }
    setIsSubmitting(false);
    router.push(ROUTES.HOME);
    toast.success(`${formData.name} has been added to the list!`);
  };

  return (
    <div className="self-center w-full">
      <Form {...newRestaurantForm}>
        <div className="grid grid-cols-1 min-[650px]:grid-cols-2 gap-4 py-4">
          <form
            className="flex flex-col gap-2"
            onSubmit={newRestaurantForm.handleSubmit(onSubmit)}
          >
            {/* RESTAURANT NAME */}
            <FormField
              name="name"
              control={newRestaurantForm.control}
              render={() => (
                <FormItem>
                  <FormLabel className="text-xl">Name</FormLabel>
                  <FormControl>
                    <GoogleAutocomplete
                      onPlaceSelect={(placeDetails) => {
                        setFullLocationDetails(placeDetails);
                        newRestaurantForm.setValue(
                          "address",
                          placeDetails?.formatted_address || ""
                        );
                        newRestaurantForm.setValue(
                          "name",
                          placeDetails?.name || ""
                        );
                        newRestaurantForm.clearErrors("name");
                      }}
                      value={newRestaurantForm.getValues("name")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* NEW ADDRESS */}
            <Label className="text-lg">Address</Label>
            <Input
              value={newRestaurantForm.getValues("address")}
              disabled
              placeholder="This field auto populates..."
            />

            {/* DATE VISITED */}
            <FormField
              name="dateVisited"
              control={newRestaurantForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Date Visited</FormLabel>
                  <FormControl>
                    <Popover>
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
                          onSelect={(value) => {
                            newRestaurantForm.setValue(
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
              control={newRestaurantForm.control}
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
                          newRestaurantForm.setValue("rating", e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TAGS */}
            <FormField
              name="tags"
              control={newRestaurantForm.control}
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
              control={newRestaurantForm.control}
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
            <FormField
              name="imageUrl"
              control={newRestaurantForm.control}
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg">Image Upload</FormLabel>
                  <FormControl>
                    <ImageDropzone
                      disabled={!restaurantName}
                      imagePrefix={
                        newRestaurantForm.getValues("name")
                          ? tokenizeRestaurantName(
                              newRestaurantForm.getValues("name")
                            )
                          : undefined
                      }
                      onSuccessCallback={(result) => {
                        newRestaurantForm.setValue("imageUrl", result[0].url);
                        newRestaurantForm.clearErrors("imageUrl");
                      }}
                      onDeleteCallback={() => {
                        newRestaurantForm.setValue("imageUrl", undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="text-md mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add it to the list!
            </Button>
          </form>
          <SingleLocationMap
            location={fullLocationDetails}
            className="!h-full"
          />
        </div>
      </Form>
    </div>
  );
}
