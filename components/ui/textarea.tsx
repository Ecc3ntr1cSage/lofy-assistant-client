import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        // Layout & Base
        "flex min-h-<80px> w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-all outline-none",

        // Placeholder
        "placeholder:text-muted-foreground",

        // Focus States (Matched to your Input component)
        "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[1px]",

        // Disabled State
        "disabled:cursor-not-allowed disabled:opacity-50",

        // Validation (Aria)
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

        // Dark Mode & Responsive
        "dark:bg-input/30 md:text-sm",

        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
