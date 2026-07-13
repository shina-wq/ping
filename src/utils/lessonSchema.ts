import * as z from "zod";

export const lessonSchema = z.object({
  title: z.string().trim().min(1, "Lesson title is required."),

  type: z.enum(["video", "reading", "quiz"], {
    message: "Please select a lesson type.",
  }),

  duration: z.string().trim().min(1, "Duration is required.").max(20, "Duration too long."),

  order: z
    .string()
    .trim()
    .min(1, "Order is required.")
    .refine((val) => /^\d+$/.test(val), "Order must be a whole number."),

  description: z.string().trim().min(1, "Description is required."),

  overview: z.string().trim().min(1, "Overview is required."),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
