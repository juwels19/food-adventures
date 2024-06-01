import { z } from "zod";

const baseRestaurantSchema = z.object({
  name: z.string().refine((value) => value !== "", "Required"),
  address: z.string().refine((value) => value !== "", "Required"),
  comments: z.string().optional(),
});

const additionalRestaurantSchema = z
  .object({
    visited: z.boolean(),
    dateVisited: z.date().optional(),
    rating: z
      .string()
      .optional()
      .refine((value) => value !== "", "Required"),
    imageUrl: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.visited && !values.dateVisited) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
        path: ["dateVisited"],
      });
    }
    if (values.visited && !values.rating) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
        path: ["rating"],
      });
    }
    if (values.visited && !values.imageUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
        path: ["imageUrl"],
      });
    }
  });

export const addRestaurantSchema = z.intersection(
  baseRestaurantSchema,
  additionalRestaurantSchema
);

export const createTagSchema = z.object({
  name: z.string(),
  type: z.string(),
  backgroundColour: z.string(),
  fontColour: z.string(),
});
