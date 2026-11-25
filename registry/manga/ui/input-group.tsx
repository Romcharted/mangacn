import * as React from "react"
import { cn } from "cn"

import {
  InputGroup as ShadcnInputGroup,
  InputGroupAddon as ShadcnInputGroupAddon,
  InputGroupButton as ShadcnInputGroupButton,
  InputGroupInput as ShadcnInputGroupInput,
  InputGroupText as ShadcnInputGroupText,
  InputGroupTextarea as ShadcnInputGroupTextarea,
} from "@/components/ui/input-group"

/*
 * Grammar: the GROUP is drawn like Input (2px ink line, paper); its control loses its own line.
 * Hover: the line thickens (G3, fields). Focus on the control: 3px + paper + ink around the group.
 * Error: accent line and a "!" mark with a serrated bottom edge (G8). Disabled control: dashed line + tone frame.
 * Addons read in ink; InputGroupButton is a small kit button (2px frame, lettering, hover invert, pressed
 * negative + 2px offset), its focus ring stays inside the group. Block addons sit behind a fine ink rule.
 * States come from :has() on the control ([data-slot=input-group-control]) and aria-invalid, set by both versions.
 */

/** The look of the group, shared with Combobox (its input is an input group). Styles the control too. */
const inputGroupClassName = [
  "rounded-(--radius)! border-[length:var(--mg-bw)]! border-input bg-background! text-foreground shadow-none ring-0! transition-none",
  "min-h-10 max-sm:min-h-11 hover-thicken",
  // focus: the line thickens to 3px, then paper and ink around the group
  "has-[[data-slot=input-group-control]:focus-visible]:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
  // error: accent line, thicker, a serrated bottom edge along the whole group
  "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:shadow-[inset_0_0_0_1px_var(--destructive)]",
  "has-[[data-slot][aria-invalid=true]]:[background-image:conic-gradient(from_-45deg_at_50%_100%,var(--destructive)_90deg,#0000_0)] has-[[data-slot][aria-invalid=true]]:[background-size:8px_5px] has-[[data-slot][aria-invalid=true]]:bg-bottom-left has-[[data-slot][aria-invalid=true]]:bg-repeat-x",
  "has-[[data-slot][aria-invalid=true]:focus-visible]:shadow-[inset_0_0_0_1px_var(--destructive),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
  // disabled control: dashed line + tone frame, text on paper (a disabled button alone keeps the group as is)
  "has-disabled:opacity-100!",
  "has-[[data-slot=input-group-control]:disabled]:cursor-not-allowed has-[[data-slot=input-group-control]:disabled]:border-dashed has-[[data-slot=input-group-control]:disabled]:tone-frame has-[[data-slot=input-group-control]:disabled]:hover:shadow-none",
  // the control: no line of its own, reading face, italic placeholder in ink
  "[&>[data-slot=input-group-control]]:self-stretch [&>[data-slot=input-group-control]]:h-auto [&>[data-slot=input-group-control]]:text-base [&>[data-slot=input-group-control]]:md:text-base",
  "[&>[data-slot=input-group-control]]:placeholder:text-foreground [&>[data-slot=input-group-control]]:placeholder:italic",
  "[&>[data-slot=input-group-control]]:disabled:opacity-100 [&>[data-slot=input-group-control]]:disabled:text-foreground",
  // the "!" mark sits at the end of the input itself, before any end addon
  "[&>input]:aria-invalid:pe-8! [&>input]:aria-invalid:bg-no-repeat [&>input]:aria-invalid:[background-image:linear-gradient(var(--destructive),var(--destructive)),linear-gradient(var(--destructive),var(--destructive))] [&>input]:aria-invalid:[background-size:3px_0.7rem,3px_3px]",
  "[&>input]:aria-invalid:[background-position:right_0.85rem_top_calc(50%-0.25rem),right_0.85rem_top_calc(50%+0.55rem)] rtl:[&>input]:aria-invalid:[background-position:left_0.85rem_top_calc(50%-0.25rem),left_0.85rem_top_calc(50%+0.55rem)]",
  // addons: ink, reading face; block addons behind a fine ink rule
  "[&>[data-slot=input-group-addon]]:font-sans [&>[data-slot=input-group-addon]]:text-base [&>[data-slot=input-group-addon]]:font-normal [&>[data-slot=input-group-addon]]:text-foreground [&>[data-slot=input-group-addon]]:opacity-100!",
  "[&>[data-align=block-start]]:border-b-[length:var(--mg-bw-fine)] [&>[data-align=block-start]]:border-border [&>[data-align=block-start]]:pb-2",
  "[&>[data-align=block-end]]:border-t-[length:var(--mg-bw-fine)] [&>[data-align=block-end]]:border-border [&>[data-align=block-end]]:pt-2",
].join(" ")

function InputGroup({ className, ...props }: React.ComponentProps<typeof ShadcnInputGroup>) {
  return <ShadcnInputGroup data-manga="input-group" className={cn(inputGroupClassName, className)} {...props} />
}

function InputGroupAddon({ className, ...props }: React.ComponentProps<typeof ShadcnInputGroupAddon>) {
  return <ShadcnInputGroupAddon data-manga="input-group-addon" className={cn("[&>svg]:text-foreground", className)} {...props} />
}

/** A small kit button: 2px frame, lettering; hover inverts, pressed is a negative with a 2px offset. */
const inputGroupButtonClassName = [
  "relative rounded-(--radius)! border-[length:var(--mg-bw)]! border-border! bg-background! font-letter text-sm! font-normal tracking-wide text-foreground! uppercase shadow-none transition-none",
  // a 44px touch target under 640px, without changing the drawing
  "max-sm:after:absolute max-sm:after:-inset-[10px] max-sm:after:content-['']",
  "enabled:hover:border-foreground! enabled:hover:bg-foreground! enabled:hover:text-background! aria-expanded:bg-foreground! aria-expanded:text-background!",
  "enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 rtl:enabled:active:-translate-x-0.5 enabled:active:bg-foreground! enabled:active:text-background! enabled:active:shadow-[inset_0_0_0_2px_var(--background)]!",
  // focus stays inside the group: a 2px ink ring around the button, in the group's padding
  "focus-visible:border-border! focus-visible:ring-0! focus-visible:outline-solid! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-ring!",
  "disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-100! disabled:border-dashed",
].join(" ")

function InputGroupButton({ className, ...props }: React.ComponentProps<typeof ShadcnInputGroupButton>) {
  return <ShadcnInputGroupButton data-manga="input-group-button" className={cn(inputGroupButtonClassName, className)} {...props} />
}

function InputGroupText({ className, ...props }: React.ComponentProps<typeof ShadcnInputGroupText>) {
  return <ShadcnInputGroupText data-manga="input-group-text" className={cn("font-sans text-base! text-foreground! [&_svg]:text-foreground", className)} {...props} />
}

function InputGroupInput({ className, ...props }: React.ComponentProps<typeof ShadcnInputGroupInput>) {
  return <ShadcnInputGroupInput data-manga="input-group-input" className={cn("transition-none", className)} {...props} />
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<typeof ShadcnInputGroupTextarea>) {
  return (
    <ShadcnInputGroupTextarea
      data-manga="input-group-textarea"
      className={cn(
        "min-h-24 px-3! transition-none",
        // error: a "!" at the top end (a textarea grows, so not centred)
        "aria-invalid:pe-8! aria-invalid:[background-image:linear-gradient(var(--destructive),var(--destructive)),linear-gradient(var(--destructive),var(--destructive))] aria-invalid:[background-size:3px_0.7rem,3px_3px] aria-invalid:[background-position:right_0.85rem_top_0.7rem,right_0.85rem_top_1.55rem] aria-invalid:bg-no-repeat",
        "rtl:aria-invalid:[background-position:left_0.85rem_top_0.7rem,left_0.85rem_top_1.55rem]",
        className,
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  inputGroupButtonClassName,
  inputGroupClassName,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
}
