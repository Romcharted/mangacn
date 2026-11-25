"use client"

import * as React from "react"
import { cn } from "cn"

import {
  InputOTP as ShadcnInputOTP,
  InputOTPGroup as ShadcnInputOTPGroup,
  InputOTPSeparator as ShadcnInputOTPSeparator,
  InputOTPSlot as ShadcnInputOTPSlot,
} from "@/components/ui/input-otp"

/*
 * Grammar: the slots are joined cells in one 2px frame (shared lines collapse to one 2px rule, like
 * Toggle Group), each character large in the lettering face, 44px cells. Hover thickens the frame
 * (G3, a field). The active slot gets a 3px line inside (never over its neighbours) and a 2px ink caret
 * blinking in steps; focus adds ink / paper / ink around the group. Separator: a short 2px dash.
 * Invalid (aria-invalid on InputOTP or on a slot): accent lines and a "!" mark beside the group.
 * Disabled: dashed lines and a tone frame in each cell, characters kept on paper.
 * The container is a named group (group/otp): its input carries focus, hover, disabled and aria-invalid.
 */

function InputOTP({ className, containerClassName, ...props }: React.ComponentProps<typeof ShadcnInputOTP>) {
  return (
    <ShadcnInputOTP
      data-manga="input-otp"
      containerClassName={cn(
        "group/otp gap-2 has-disabled:opacity-100!",
        // invalid: a "!" mark beside the group
        "has-aria-invalid:after:font-sfx has-aria-invalid:after:text-2xl has-aria-invalid:after:leading-none has-aria-invalid:after:text-destructive has-aria-invalid:after:content-['!']",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<typeof ShadcnInputOTPGroup>) {
  return (
    <ShadcnInputOTPGroup
      data-manga="input-otp-group"
      className={cn(
        "relative rounded-(--radius)! border-[length:var(--mg-bw)] border-border bg-background",
        // G3, a field: the frame thickens by 1px, inside
        "group-hover/otp:shadow-[inset_0_0_0_1px_var(--border)]",
        // focus: ink, paper, ink around the group
        "group-has-[input:focus-visible]/otp:outline-solid group-has-[input:focus-visible]/otp:outline-2 group-has-[input:focus-visible]/otp:outline-offset-2 group-has-[input:focus-visible]/otp:outline-ring",
        "has-aria-invalid:ring-0! has-aria-invalid:border-destructive group-has-aria-invalid/otp:border-destructive group-has-aria-invalid/otp:shadow-[inset_0_0_0_1px_var(--destructive)]",
        "group-has-disabled/otp:border-dashed group-has-disabled/otp:shadow-none",
        className,
      )}
      {...props}
    />
  )
}

function InputOTPSlot({ className, ...props }: React.ComponentProps<typeof ShadcnInputOTPSlot>) {
  return (
    <ShadcnInputOTPSlot
      data-manga="input-otp-slot"
      className={cn(
        "size-11! rounded-none! border-y-0! border-e-0! border-s-[length:var(--mg-bw)]! border-border! bg-transparent! font-letter text-2xl! leading-none text-foreground transition-none first:border-s-0!",
        // active slot: a 3px line inside the cell
        "data-[active=true]:ring-0! data-[active=true]:shadow-[inset_0_0_0_3px_var(--ring)]",
        // the caret: a 2px ink bar blinking in steps (stops with reduced motion)
        "[&>div>div]:h-6! [&>div>div]:w-[length:var(--mg-bw)]! [&>div>div]:bg-foreground [&>div>div]:[animation-timing-function:steps(1,end)]!",
        // invalid: accent rules
        "aria-invalid:border-destructive! aria-invalid:ring-0! group-has-aria-invalid/otp:border-destructive!",
        "data-[active=true]:aria-invalid:shadow-[inset_0_0_0_3px_var(--destructive)] group-has-aria-invalid/otp:data-[active=true]:shadow-[inset_0_0_0_3px_var(--destructive)]",
        // disabled: dashed rules, tone frame, characters on paper
        "group-has-disabled/otp:border-dashed! group-has-disabled/otp:tone-frame group-has-disabled/otp:[--frame-w:4px]",
        className,
      )}
      {...props}
    />
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnInputOTPSeparator>) {
  return (
    <ShadcnInputOTPSeparator
      data-manga="input-otp-separator"
      className={cn(
        "flex items-center [&>svg]:hidden after:block after:h-[length:var(--mg-bw)] after:w-3 after:bg-foreground after:content-['']",
        className,
      )}
      {...props}
    />
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
