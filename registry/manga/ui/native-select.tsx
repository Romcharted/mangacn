import * as React from "react"
import { cn } from "cn"

import {
  NativeSelect as ShadcnNativeSelect,
  NativeSelectOptGroup as ShadcnNativeSelectOptGroup,
  NativeSelectOption as ShadcnNativeSelectOption,
} from "@/components/ui/native-select"

/*
 * Grammar: drawn like the kit Select trigger — a 2px ink line on paper, a brush chevron (G8, mark-chevron)
 * in place of the stock icon. Hover: the line thickens (G3, fields). Focus: 3px + paper + ink.
 * Error: accent line, a "!" before the chevron and a serrated bottom edge (G8). Disabled: dashed line + tone
 * frame, label on paper, not-allowed cursor. The options keep the native popup.
 * The stock component puts className on its wrapper, so the select is styled from there ([&>select]).
 */
function NativeSelect({ className, ...props }: React.ComponentProps<typeof ShadcnNativeSelect>) {
  return (
    <ShadcnNativeSelect
      data-manga="native-select"
      className={cn(
        "max-w-full text-foreground [&>select]:truncate",
        "[&>select]:h-10 [&>select]:max-sm:h-11 [&>select]:data-[size=sm]:h-8 [&>select]:max-sm:data-[size=sm]:h-11",
        "[&>select]:cursor-pointer [&>select]:rounded-(--radius) [&>select]:border-[length:var(--mg-bw)] [&>select]:border-input [&>select]:bg-background [&>select]:hover:bg-background [&>select]:dark:bg-background [&>select]:dark:hover:bg-background [&>select]:ps-3 [&>select]:pe-10 [&>select]:text-base [&>select]:text-foreground [&>select]:transition-none",
        "[&>select]:data-[size=sm]:ps-2.5 [&>select]:data-[size=sm]:pe-9 [&>select]:data-[size=sm]:text-sm [&>select]:data-[size=sm]:rounded-(--radius)",
        // the stock chevron is replaced by a brush chevron
        "[&>svg]:hidden after:pointer-events-none after:absolute after:end-3 after:top-1/2 after:-translate-y-1/2 after:mark-chevron after:text-sm",
        "[&>select]:hover-thicken", // G3, third case: a field
        "[&>select]:focus-visible:border-ring [&>select]:focus-visible:ring-0 [&>select]:focus-visible:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        // error: accent line, a "!" before the chevron, a serrated bottom edge
        "[&>select]:aria-invalid:border-destructive [&>select]:aria-invalid:ring-0 [&>select]:aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)] [&>select]:aria-invalid:pe-16!",
        "[&>select]:aria-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--destructive),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        "[&>select]:aria-invalid:[background-image:linear-gradient(var(--destructive),var(--destructive)),linear-gradient(var(--destructive),var(--destructive)),conic-gradient(from_-45deg_at_50%_100%,var(--destructive)_90deg,#0000_0)]",
        "[&>select]:aria-invalid:[background-size:3px_0.7rem,3px_3px,8px_5px] [&>select]:aria-invalid:[background-repeat:no-repeat,no-repeat,repeat-x]",
        "[&>select]:aria-invalid:[background-position:right_2.5rem_top_calc(50%-0.25rem),right_2.5rem_top_calc(50%+0.55rem),left_bottom]",
        "rtl:[&>select]:aria-invalid:[background-position:left_2.5rem_top_calc(50%-0.25rem),left_2.5rem_top_calc(50%+0.55rem),right_bottom]",
        // sm (32px on wide screens): a shorter "!" so its dot clears the serrated edge
        "sm:[&>select]:data-[size=sm]:aria-invalid:[background-size:3px_0.5rem,3px_3px,8px_5px] sm:[&>select]:data-[size=sm]:aria-invalid:[background-position:right_2.5rem_top_calc(50%-0.4rem),right_2.5rem_top_calc(50%+0.25rem),left_bottom]",
        "sm:rtl:[&>select]:data-[size=sm]:aria-invalid:[background-position:left_2.5rem_top_calc(50%-0.4rem),left_2.5rem_top_calc(50%+0.25rem),right_bottom]",
        // disabled: dashed line + tone frame, label on paper, not-allowed cursor
        "has-[select:disabled]:opacity-100! has-[select:disabled]:cursor-not-allowed",
        "[&>select]:disabled:border-dashed [&>select]:disabled:tone-frame [&>select]:disabled:text-foreground",
        className,
      )}
      {...props}
    />
  )
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<typeof ShadcnNativeSelectOption>) {
  return <ShadcnNativeSelectOption data-manga="native-select-option" className={cn(className)} {...props} />
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<typeof ShadcnNativeSelectOptGroup>) {
  return <ShadcnNativeSelectOptGroup data-manga="native-select-optgroup" className={cn(className)} {...props} />
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
