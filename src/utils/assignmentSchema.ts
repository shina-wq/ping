import * as z from "zod";

export const assignmentSchema = z.object({
  title: z.string().trim().min(1, "Assignment title is required."),
  description: z.string().trim().optional(),
  dueDate: z.string().min(1, "Due date is required."),
  points: z
    .string()
    .trim()
    .min(1, "Points are required.")
    .refine((val) => /^\d+$/.test(val) && Number(val) > 0, "Enter a positive whole number."),
  submissionType: z.enum(["file_upload", "text", "link"]),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;