import * as React from "react"
import { cn } from "cn"

import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox"

export type CheckboxProps = React.ComponentProps<typeof ShadcnCheckbox>

// States are read from ARIA (aria-checked, aria-invalid) and data-disabled,
// which Radix and Base UI both set, so the same classes work on either.
function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <ShadcnCheckbox
      data-manga="checkbox"
      className={cn(
        "size-5 rounded-[calc(var(--radius)*0.4)] border-[length:var(--mg-bw)] border-border bg-background text-foreground shadow-none transition-none dark:bg-background",
        // hover thickens the line; no screentone under 24px (rule C)
        "hover-thicken active:translate-x-0.5 active:translate-y-0.5 rtl:active:-translate-x-0.5",
        "focus-visible:border-border focus-visible:ring-0 focus-ink",
        // checked: ink flat, the brush check draws itself in 3 frames
        "aria-checked:bg-primary! aria-checked:bg-none aria-checked:text-primary-foreground aria-checked:border-primary aria-checked:fill-in", // G2 + G8
        "[&_svg]:size-4 [&_svg]:stroke-[3.5] [&_svg_path]:[stroke-dasharray:24] [&_svg_path]:animate-draw [--draw-length:24]",
        // indeterminate: a thick ink bar
        "aria-[checked=mixed]:bg-primary! aria-[checked=mixed]:bg-none aria-[checked=mixed]:text-primary-foreground aria-[checked=mixed]:[&_svg]:hidden",
        "aria-[checked=mixed]:before:absolute aria-[checked=mixed]:before:h-[3px] aria-[checked=mixed]:before:w-2.5 aria-[checked=mixed]:before:bg-current aria-[checked=mixed]:before:content-['']",
        // disabled: dashed line; the mark stays visible in ink
        "data-disabled:opacity-100 disabled:opacity-100 aria-disabled:opacity-100 group-has-disabled/field:opacity-100 data-disabled:border-dashed data-disabled:border-border data-disabled:bg-background! data-disabled:text-foreground! data-disabled:cursor-not-allowed data-disabled:hover:border-[length:var(--mg-bw)]",
        "data-disabled:aria-checked:bg-background! data-disabled:aria-checked:text-foreground! data-disabled:aria-[checked=mixed]:bg-background! data-disabled:aria-[checked=mixed]:text-foreground!",
        // error: stamp red line and red tone
        "aria-invalid:border-[3px] aria-invalid:border-destructive aria-invalid:ring-0 aria-invalid:aria-checked:bg-destructive! aria-invalid:aria-checked:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Checkbox }
