import { hexToRgb, isLightTextContrasting } from "@/lib/utils";
import { z } from "zod";

const baseRestaurantSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .refine((value) => value !== "", "Name is required"),
  address: z
    .string({ message: "Address is required" })
    .refine((value) => value !== "", "Address is required"),
  comments: z.string().optional(),
});

const additionalRestaurantSchema = z
  .object({
    visited: z.boolean(),
    dateVisited: z.date().optional(),
    rating: z
      .string()
      .optional()
      .refine((value) => value !== "", "Rating required"),
    imageUrl: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.visited && !values.dateVisited) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date visited is required for a visited restaurant!",
        path: ["dateVisited"],
      });
    }
    if (values.visited && !values.rating) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Rating is required for a visited restaurant!",
        path: ["rating"],
      });
    }
    if (values.visited && !values.imageUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image is required for a visited restaurant!",
        path: ["imageUrl"],
      });
    }
  });

export const restaurantSchema = z.intersection(
  baseRestaurantSchema,
  additionalRestaurantSchema
);

export const createTagSchema = z.object({
  name: z.string().refine((value) => value !== "", "Name is required"),
  type: z.string(),
  backgroundColour: z
    .string()
    .refine((value) => /^#[0-9A-F]{6}$/i.test(value), "Not a valid hex code")
    .refine(
      (value) => isLightTextContrasting(hexToRgb(value)),
      "Colour must contrast white text"
    ),
  fontColour: z
    .string()
    .refine((value) => /^#[0-9A-F]{6}$/i.test(value), "Not a valid hex code"),
});

export const editTagSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  backgroundColour: z
    .string()
    .refine((value) => /^#[0-9A-F]{6}$/i.test(value), "Not a valid hex code")
    .refine(
      (value) => isLightTextContrasting(hexToRgb(value)),
      "Colour must contrast white text"
    ),
});
