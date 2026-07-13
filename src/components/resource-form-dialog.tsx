import { useState } from "react";
import type { ReactNode } from "react";
import { useForm, Controller, type DefaultValues, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z, ZodType } from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError } from "@/lib/api-error";

type SelectOption = {
  value: string;
  label: string;
};

type FieldConfig = {
  name: Path<any> | string;
  label?: ReactNode;
  type?: "text" | "number" | "date" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
};

interface ResourceFormDialogProps<TSchema extends ZodType<FieldValues, FieldValues>> {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  schema: TSchema;
  defaultValues?: DefaultValues<z.input<TSchema> & FieldValues>;
  fields: FieldConfig[];
  submitLabel?: string;
  onSubmit: (data: z.output<TSchema> & FieldValues) => Promise<void> | void;
}

export function ResourceFormDialog<TSchema extends ZodType<FieldValues, FieldValues>>({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  schema,
  defaultValues,
  fields,
  submitLabel = "Save",
  onSubmit,
}: ResourceFormDialogProps<TSchema>) {
  type TInput = z.input<TSchema> & FieldValues;
  type TOutput = z.output<TSchema> & FieldValues;

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TInput, unknown, TOutput>({ resolver: zodResolver(schema as never), defaultValues });

  const fieldErrors = errors as Record<string, { message?: string } | undefined>;

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      setDialogOpen(false);
      reset();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
    }
  });

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(next) => {
        if (isSubmitting) return;
        setDialogOpen(next);
        if (!next) reset();
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <form className="space-y-5" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="space-y-4">
            {fields.map((field) => {
              const fieldId = `field-${String(field.name)}`;
              const error = fieldErrors[field.name]?.message;

              return (
                <div key={String(field.name)} className="space-y-2">
                  <Label htmlFor={fieldId}>
                    {field.label}
                    {field.required && <span className="text-destructive"> *</span>}
                  </Label>

                  {field.type === "textarea" ? (
                    <Textarea
                      id={fieldId}
                      placeholder={field.placeholder}
                      aria-invalid={!!error}
                      {...register(field.name as Path<TInput>)}
                    />
                  ) : field.type === "select" ? (
                    <Controller
                      name={field.name as Path<TInput>}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Select value={value} onValueChange={onChange}>
                          <SelectTrigger id={fieldId} className="w-full" aria-invalid={!!error}>
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  ) : (
                    <Input
                      id={fieldId}
                      type={field.type === "date" ? "datetime-local" : "text"}
                      inputMode={field.type === "number" ? "numeric" : undefined}
                      placeholder={field.placeholder}
                      aria-invalid={!!error}
                      {...register(field.name as Path<TInput>)}
                    />
                  )}

                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}