import * as React from "react"
import { cn } from "cn"

import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"

export type TextareaProps = React.ComponentProps<typeof ShadcnTextarea>

// Drawn like Input: a 2px ink line. Hover: the line thickens (G3, fields). Focus: 3px + ink / paper / ink.
// Disabled: dashed line + tone frame, text on paper. Error: accent line and a "!" mark (G8).
function Textarea({ className, ...props }: TextareaProps) {
  return (
    <ShadcnTextarea
      data-manga="textarea"
      className={cn(
        "min-h-24 rounded-(--radius) border-[length:var(--mg-bw)] border-input bg-background px-3 py-2 text-base text-foreground shadow-none transition-none md:text-base dark:bg-background",
        "placeholder:text-foreground placeholder:italic hover-thicken",
        "focus-visible:border-ring focus-visible:ring-0 focus-visible:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        "read-only:not-disabled:border-[length:var(--mg-bw-fine)]",
        "disabled:cursor-not-allowed disabled:opacity-100 disabled:border-dashed disabled:bg-background disabled:text-foreground disabled:tone-frame dark:disabled:bg-background",
        "aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)] dark:aria-invalid:border-destructive",
        "aria-invalid:pe-8 aria-invalid:[background-image:linear-gradient(var(--destructive),var(--destructive)),linear-gradient(var(--destructive),var(--destructive))] aria-invalid:[background-size:3px_0.7rem,3px_3px] aria-invalid:[background-position:right_0.85rem_top_0.7rem,right_0.85rem_top_1.55rem] aria-invalid:bg-no-repeat",
        "rtl:aria-invalid:[background-position:left_0.85rem_top_0.7rem,left_0.85rem_top_1.55rem]",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
