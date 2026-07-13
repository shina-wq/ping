import * as z from "zod";

export const moduleSchema = z.object({
  title: z.string().trim().min(1, "Module title is required."),

  order: z
    .string()
    .trim()
    .min(1, "Order is required.")
    .refine((val) => /^\d+$/.test(val), "Order must be a whole number."),
});

export type ModuleFormValues = z.infer<typeof moduleSchema>;