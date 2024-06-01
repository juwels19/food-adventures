"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { UploadButton, UploadDropzone } from "@/components/common/uploadthing";
import { cn } from "@/lib/utils";
import { addRestaurantSchema } from "@/db/schemas";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import TagMultiSelect from "./tag-multi-select";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Checkbox } from "../../ui/checkbox";
import { Calendar } from "../../ui/calendar";
import { createRestaurant } from "@/db/queries";
import Image from "next/image";

export default function AddRestaurantForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addRestaurantForm = useForm({
    resolver: zodResolver(addRestaurantSchema),
    defaultValues: {
      visited: false,
    },
  });

  const isDateVisitedDisabled = !addRestaurantForm.watch("visited");
  const imageUrl = addRestaurantForm.watch("imageUrl");

  const onSubmit = async (formData) => {
    const timestamp = dayjs().format("YYYY-MM-DD");
    const fullPayload = {
      ...formData,
      ...(formData.visited && {
        dateVisited: dayjs(formData.dateVisited).format("YYYY-MM-DD"),
      }),
      tags: addRestaurantForm.getValues("tags").map((tag) => tag.id) || [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setIsSubmitting(true);
    const result = await createRestaurant(fullPayload);
    if (!result) {
      setIsSubmitting(false);
      toast.error(
        `Error: ${result.name} was not added to the list. Try again!`
      );
    }
    setIsSubmitting(false);
    setIsOpen(false);
    toast.success(`${result.name} has been added to the list!`);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        addRestaurantForm.reset({ visited: false });
        setIsOpen(!isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="text-md">Add Restaurant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">
            Wowie! Another restaurant on the list :)
          </DialogTitle>
        </DialogHeader>
        <Form {...addRestaurantForm}>
          <form
            onSubmit={addRestaurantForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <div className="grid grid-cols-2 justify-start w-full gap-8">
              {/* RESTAURANT NAME */}
              <FormField
                name="name"
                control={addRestaurantForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* DATE VISITED */}
              <FormField
                name="dateVisited"
                control={addRestaurantForm.control}
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
                                "w-full pl-3 text-left font-normal",
                                isDateVisitedDisabled &&
                                  "!pointer-events-auto !cursor-not-allowed",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isDateVisitedDisabled}
                            >
                              {field.value ? (
                                dayjs(field.value).format("MMMM D, YYYY")
                              ) : (
                                <span>Click to pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
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
            </div>
            {/* VISITED */}
            <FormField
              name="visited"
              control={addRestaurantForm.control}
              render={({ field }) => (
                <FormItem className="flex flex-row space-x-3 space-y-0 items-center justify-start">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    We&apos;ve visited this restaurant!
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ADDRESS */}
            <FormField
              name="address"
              control={addRestaurantForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-5 justify-start w-full gap-4">
              {/* RATING */}
              <FormField
                name="rating"
                control={addRestaurantForm.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel className="text-lg">Rating</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* TAGS */}
              <FormField
                name="tags"
                control={addRestaurantForm.control}
                render={({ field }) => (
                  <FormItem className="col-span-3 md:col-span-4">
                    <FormLabel className="text-lg">Tags</FormLabel>
                    <FormControl>
                      <TagMultiSelect {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* COMMENTS */}
            <FormField
              name="comments"
              control={addRestaurantForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Comments</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter comments here..."
                      className="max-h-[300px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div
              className={cn(
                "grid gap-8",
                imageUrl ? "grid-cols-2" : "grid-cols-1"
              )}
            >
              {/* IMAGE */}
              <FormField
                name="imageUrl"
                control={addRestaurantForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Image Upload</FormLabel>
                    <FormControl>
                      <UploadButton
                        {...field}
                        appearance={{
                          container: "flex flex-row",
                          allowedContent: "hidden",
                          button: "bg-custom-secondary text-custom-text w-full",
                        }}
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          addRestaurantForm.setValue("imageUrl", res[0].url);
                          addRestaurantForm.clearErrors("imageUrl");
                          toast.success("Image uploaded successfully!");
                        }}
                        onUploadError={() => {
                          toast.success("Image upload failed! Try again!");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* IMAGE PREVIEW */}
              {imageUrl && (
                <div className="w-full justify-center items-center">
                  <Image src={imageUrl} width={100} height={100} />
                </div>
              )}
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 mt-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="text-md"
                >
                  Close
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="lg"
                className="text-md"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
