"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

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
import React, { useState } from "react";
import AddressAutocomplete from "@/components/common/address-autocomplete";
import SingleLocationMap from "@/components/maps/single-location-map";
import { UploadButton, UploadDropzone } from "@/components/common/uploadthing";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import TagMultiSelect from "../common/tag-multi-select";

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

  const imageUrl = newRestaurantForm.watch("imageUrl");

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
    console.log(fullPayload);
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
      <SingleLocationMap location={fullLocationDetails} />
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ADDRESS */}
            <FormField
              name="address"
              control={newRestaurantForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Address</FormLabel>
                  <FormControl>
                    <AddressAutocomplete
                      onPlaceSelect={(placeDetails) => {
                        setFullLocationDetails(placeDetails);
                        field.onChange(placeDetails?.formatted_address || "");
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
            <Button
              type="submit"
              size="lg"
              className="text-md"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add it to the list!
            </Button>
          </form>
          {!imageUrl && (
            <FormField
              name="imageUrl"
              control={newRestaurantForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Image Upload</FormLabel>
                  <FormControl>
                    <UploadDropzone
                      {...field}
                      className="cursor-pointer"
                      endpoint="imageUploader"
                      content={{
                        button({ ready }) {
                          if (ready) return "Upload Image";
                          return "Loading...";
                        },
                        label() {
                          return "Click to choose a file, then click Upload!";
                        },
                        allowedContent({ isUploading }) {
                          if (isUploading) return "Your image is uploading...";
                          return "Image (4MB)";
                        },
                      }}
                      onClientUploadComplete={(res) => {
                        // Do something with the response
                        newRestaurantForm.setValue("imageUrl", res[0].url);
                        newRestaurantForm.clearErrors("imageUrl");
                        toast.success("Image uploaded successfully!");
                      }}
                      onUploadError={() => {
                        toast.error("Image upload failed! Try again!");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {imageUrl && (
            <div className="justify-start min-h-[50vh] flex flex-col gap-2 items-center">
              <Label className="text-xl">Image preview</Label>
              <div className="w-full h-full relative">
                <Image
                  alt="image preview"
                  src={imageUrl}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <UploadButton
                endpoint="imageUploader"
                appearance={{
                  button:
                    "bg-custom-secondary text-custom-text hover:bg-slate-200/90 transition-colors",
                }}
                content={{
                  button({ ready }) {
                    if (ready) return "Update image";
                    return "Loading...";
                  },
                  allowedContent({ isUploading }) {
                    if (isUploading) return <div>Uploading image...</div>;
                    return "Image (4MB)";
                  },
                }}
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  newRestaurantForm.setValue("imageUrl", res[0].url);
                  newRestaurantForm.clearErrors("imageUrl");
                  toast.success("Image uploaded successfully!");
                }}
                onUploadError={() => {
                  toast.error("Image upload failed! Try again!");
                }}
              />
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
