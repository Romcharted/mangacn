import * as React from "react"
import { cn } from "cn"

import {
  Field as ShadcnField,
  FieldContent,
  FieldDescription as ShadcnFieldDescription,
  FieldError as ShadcnFieldError,
  FieldGroup,
  FieldLabel as ShadcnFieldLabel,
  FieldLegend as ShadcnFieldLegend,
  FieldSeparator as ShadcnFieldSeparator,
  FieldSet,
  FieldTitle as ShadcnFieldTitle,
} from "@/components/ui/field"

/*
 * Labels in lettering, descriptions in the reading face, never faded. Errors: accent colour, a "!" mark
 * and a shake (G8). A choice card (a FieldLabel wrapping a Field) is a 2px case; checked, it gets a 6px
 * ink bar at the start, like a selected table row (see AGENTS.md, special cases).
 */

function Field({ className, ...props }: React.ComponentProps<typeof ShadcnField>) {
  return <ShadcnField data-manga="field" className={cn("data-[invalid=true]:text-foreground", className)} {...props} />
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof ShadcnFieldLabel>) {
  return (
    <ShadcnFieldLabel
      className={cn(
        "font-letter text-base leading-none font-normal tracking-wide uppercase group-data-[disabled=true]/field:opacity-100",
        // choice card
        "has-[>[data-slot=field]]:rounded-(--radius) has-[>[data-slot=field]]:border-[length:var(--mg-bw)] has-[>[data-slot=field]]:border-border has-[>[data-slot=field]]:font-sans has-[>[data-slot=field]]:normal-case has-[>[data-slot=field]]:tracking-normal",
        "has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-transparent has-[>[data-slot=field]]:hover-thicken",
        "has-data-checked:border-border has-data-checked:bg-transparent dark:has-data-checked:bg-transparent",
        // checked: the 6px bar at the start grows down in three frames (G2 bar-in), as in Questionnaire
        "has-[>[data-slot=field]]:relative has-aria-checked:before:absolute has-aria-checked:before:inset-y-0 has-aria-checked:before:start-0 has-aria-checked:before:w-1.5 has-aria-checked:before:origin-top has-aria-checked:before:bg-foreground has-aria-checked:before:content-[''] has-aria-checked:before:animate-bar-in [--bar-from:1_0.34] [--bar-mid:1_0.67]",
        // the control sits on the first line of the label, clear of the 6px bar
        "has-[>[data-slot=field]]:[&_[data-manga=radio]]:mt-[6px]! has-[>[data-slot=field]]:[&_[data-manga=radio]]:ms-2 has-[>[data-slot=field]]:[&_[data-manga=checkbox]]:mt-0.5 has-[>[data-slot=field]]:[&_[data-manga=checkbox]]:ms-1.5",
        "has-[>[data-slot=field]]:has-[:focus-visible]:ring-0 has-[>[data-slot=field]]:has-[:focus-visible]:outline-2 has-[>[data-slot=field]]:has-[:focus-visible]:outline-offset-4 has-[>[data-slot=field]]:has-[:focus-visible]:outline-solid",
        className,
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<typeof ShadcnFieldTitle>) {
  return (
    <ShadcnFieldTitle
      className={cn("font-letter text-base font-normal tracking-wide uppercase group-data-[disabled=true]/field:opacity-100", className)}
      {...props}
    />
  )
}

function FieldLegend({ className, ...props }: React.ComponentProps<typeof ShadcnFieldLegend>) {
  return (
    <ShadcnFieldLegend
      className={cn(
        "font-letter font-normal tracking-wide uppercase underline decoration-2 underline-offset-4 data-[variant=label]:text-base data-[variant=legend]:text-lg",
        className,
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<typeof ShadcnFieldDescription>) {
  return (
    <ShadcnFieldDescription
      className={cn("text-sm text-foreground [&>a]:decoration-2 [&>a:hover]:text-foreground [&>a:hover]:decoration-4", className)}
      {...props}
    />
  )
}

function FieldError({ className, ...props }: React.ComponentProps<typeof ShadcnFieldError>) {
  return (
    <ShadcnFieldError
      data-manga="field-error"
      className={cn(
        "flex animate-shake items-start gap-2 text-sm font-normal text-destructive",
        "before:grid before:size-4 before:shrink-0 before:place-items-center before:bg-destructive before:font-sfx before:text-[0.7rem] before:leading-4 before:text-primary-foreground before:content-['!']",
        className,
      )}
      {...props}
    />
  )
}

function FieldSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnFieldSeparator>) {
  return (
    <ShadcnFieldSeparator
      className={cn(
        "*:data-[slot=separator]:h-[length:var(--mg-bw-fine)]! *:data-[slot=separator]:bg-border [&_[data-slot=field-separator-content]]:font-letter [&_[data-slot=field-separator-content]]:text-foreground [&_[data-slot=field-separator-content]]:uppercase",
        className,
      )}
      {...props}
    />
  )
}

export { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle }
