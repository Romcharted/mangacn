import * as React from "react"
import { cn } from "cn"

import { Input as ShadcnInput } from "@/components/ui/input"

export type InputSize = "sm" | "default" | "lg"

export type InputProps = React.ComponentProps<typeof ShadcnInput> & {
  /** Height and text size. (`size` stays the native attribute.) */
  inputSize?: InputSize
}

const sizes: Record<InputSize, string> = {
  sm: "h-8 px-2.5 text-sm",
  default: "h-10 px-3 text-base",
  lg: "h-12 px-4 text-lg",
}

function Input({ inputSize = "default", className, ...props }: InputProps) {
  return (
    <ShadcnInput
      data-manga="input"
      data-size={inputSize}
      className={cn(
        "rounded-(--radius) border-[length:var(--mg-bw)] border-input bg-background text-foreground shadow-none transition-none dark:bg-background",
        "placeholder:text-foreground placeholder:italic",
        // focus: the line thickens to 3px, then paper and ink around it
        "focus-visible:border-ring focus-visible:ring-0 focus-visible:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        // read-only: a fine line
        "read-only:not-disabled:border-[length:var(--mg-bw-fine)]",
        // disabled: dashed line + light tone, text still readable
        "disabled:opacity-100 disabled:border-dashed disabled:bg-background disabled:text-foreground disabled:tone-10 dark:disabled:bg-background",
        // error: stamp red, serrated bottom edge, "!" mark
        "aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)] aria-invalid:mark-error dark:aria-invalid:border-destructive",
        "aria-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--destructive),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        sizes[inputSize],
        className,
      )}
      {...props}
    />
  )
}

export { Input }
