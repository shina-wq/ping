import * as z from "zod";

export const addCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Course title is required."),

  term: z
    .string()
    .trim()
    .min(1, "Term is required."),

  year: z
    .string()
    .trim()
    .min(1, "Year is required.")
    .refine(
      (val) => !val || /^\d{4}$/.test(val),
      "Enter a valid 4-digit year."
    ),

  status: z.enum(["active", "completed", "archived"]),
});

export type AddCourseValues = z.infer<typeof addCourseSchema>;