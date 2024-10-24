import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(400, "Description must be less than 400 characters"),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(400, "Location must be less than 400 characters"),
  imageUrl: z.string().url("Invalid URL format"), // invoke the url function
  startDateTime: z.date(), // ensure this field receives a Date object
  endDateTime: z.date(),
  category: z.string(),
  price: z.string().optional(), // optional for free events
  isFree: z.boolean(),
  url: z.string().url("Invalid URL format"), // invoke the url function
});
