import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-primary/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer",
        outline:
          "border-border bg-background hover:bg-muted text-foreground cursor-pointer",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer",
        ghost:
          "hover:bg-muted hover:text-foreground cursor-pointer",
        active:
          "bg-primary/15 text-primary hover:bg-primary/25 cursor-pointer",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer",
        link: "text-primary underline-offset-4 hover:underline cursor-pointer",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2.5 text-sm",
        "icon-sm": "h-8 w-8",
        lg: "h-10 px-4",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
      className?: string;
      asChild?: boolean;
      loading?: boolean;
    }

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp: React.ElementType = asChild ? Slot : "button";

  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={isDisabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };