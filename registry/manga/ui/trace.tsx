"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Trace as ShadcnTrace,
  TraceCollapsible as ShadcnTraceCollapsible,
  TraceCollapsibleContent as ShadcnTraceCollapsibleContent,
  TraceCollapsibleTrigger as ShadcnTraceCollapsibleTrigger,
  TraceDescription as ShadcnTraceDescription,
  TraceIcon as ShadcnTraceIcon,
  TraceLine as ShadcnTraceLine,
  TraceTitle as ShadcnTraceTitle,
} from "@/components/ui/trace"
import { Spinner } from "@/components/ui/manga/spinner"

/*
 * Grammar: every line is reading text in ink, never faded. Status marks (G8): done = the brush check,
 * running = the kit Spinner (G7, concentration lines turning in steps, instead of the stock shimmer),
 * pending = a small hollow square (never dashes: dashes mean disabled), error = accent text and a "!" mark.
 * Lines inside a link or button are underlined; the underline thickens on hover (G3 frameless) and focus
 * draws the ink / paper / ink ring (focus-ink). A collapsible group: its brush chevron turns in two steps,
 * the content unfolds (G5 drop-in) along a 1px ink rail on the start side. Durations: small mono, ink.
 */

function Trace({ className, ...props }: React.ComponentProps<typeof ShadcnTrace>) {
  return (
    <ShadcnTrace
      data-manga="trace"
      className={cn(
        // a link or button around a line: no stock ring, the kit focus instead
        "*:has-[>[data-slot=trace-line]]:rounded-(--radius)! *:has-[>[data-slot=trace-line]]:focus-visible:ring-0! *:has-[>[data-slot=trace-line]]:focus-ink",
        // 44px touch targets on phones
        "*:has-[>[data-slot=trace-line]]:items-center max-sm:*:has-[>[data-slot=trace-line]]:min-h-11",
        className,
      )}
      {...props}
    />
  )
}

function TraceLine({ className, ...props }: React.ComponentProps<typeof ShadcnTraceLine>) {
  return (
    <ShadcnTraceLine
      data-manga="trace-line"
      className={cn(
        "min-h-6 font-sans text-sm text-foreground! transition-none! data-[status=pending]:opacity-100!",
        "data-[status=error]:text-destructive! [:is(a,button):hover>&]:data-[status=error]:text-destructive!",
        // clickable: reacts to its own link or button only (direct parent), never to any ancestor
        "[:is(a,button)>&]:cursor-pointer",
        "[:is(a,button)>&]:*:data-[slot=trace-title]:underline [:is(a,button)>&]:*:data-[slot=trace-title]:decoration-2 [:is(a,button)>&]:*:data-[slot=trace-title]:underline-offset-4",
        "[:is(a,button):hover>&]:*:data-[slot=trace-title]:decoration-4",
        className,
      )}
      {...props}
    />
  )
}

/** The status mark of a line, shown when TraceIcon has no children. Picked from the line's data-status. */
function StatusMark() {
  return (
    <>
      <span className="hidden place-items-center [[data-slot=trace-line]:not([data-status])>[data-slot=trace-icon]>&]:grid">
        <span className="mark-check text-base" />
      </span>
      <span className="hidden place-items-center [[data-status=running]>[data-slot=trace-icon]>&]:grid">
        <Spinner role="presentation" aria-label={undefined} className="size-4" />
      </span>
      <span className="hidden place-items-center [[data-status=pending]>[data-slot=trace-icon]>&]:grid">
        <span className="size-2.5 border-[length:var(--mg-bw)] border-current" />
      </span>
      <span className="hidden place-items-center [[data-status=error]>[data-slot=trace-icon]>&]:grid">
        <span className="grid size-4 place-items-center bg-destructive font-sfx text-[0.7rem] leading-4 text-primary-foreground">!</span>
      </span>
    </>
  )
}

/** Leave it empty to get the mark of the line's status (check, spinner, hollow square, "!"). */
function TraceIcon({ className, children, ...props }: React.ComponentProps<typeof ShadcnTraceIcon>) {
  return (
    <ShadcnTraceIcon data-manga="trace-icon" className={cn("text-current", className)} {...props}>
      {children ?? <StatusMark />}
    </ShadcnTraceIcon>
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<typeof ShadcnTraceTitle>) {
  return (
    <ShadcnTraceTitle
      data-manga="trace-title"
      className={cn(
        // no shimmer: a running line shows the Spinner instead
        "animate-none! bg-none! [-webkit-text-fill-color:currentColor]!",
        // room under the text for the thick underline (the title truncates, so it clips)
        "-mb-1.5 pb-1.5",
        className,
      )}
      {...props}
    />
  )
}

function TraceDescription({ className, ...props }: React.ComponentProps<typeof ShadcnTraceDescription>) {
  return (
    <ShadcnTraceDescription
      data-manga="trace-description"
      className={cn("font-mono text-xs text-foreground!", className)}
      {...props}
    />
  )
}

function TraceCollapsible({ className, ...props }: React.ComponentProps<typeof ShadcnTraceCollapsible>) {
  return (
    <ShadcnTraceCollapsible
      data-manga="trace-collapsible"
      className={cn(
        // the panel opens at once (no smooth height): its content drops in, in steps
        "[&>[data-slot=trace-collapsible-content]]:transition-none! [&>[data-slot=trace-collapsible-content]]:animate-none!",
        className,
      )}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnTraceCollapsibleTrigger>) {
  return (
    <ShadcnTraceCollapsibleTrigger
      data-manga="trace-collapsible-trigger"
      className={cn(
        "gap-2 max-sm:min-h-11 rounded-(--radius)! text-foreground! transition-none! focus-visible:ring-0! focus-ink",
        "has-[[data-status=error]]:text-destructive!",
        // the brush chevron replaces the stock icon: points to the end, turns down in two steps when open
        "[&>[data-slot=trace-icon]:last-child]:hidden",
        "after:mark-chevron after:shrink-0 after:text-sm after:-rotate-90 rtl:after:rotate-90 after:transition-[rotate] after:duration-[166ms] after:ease-[steps(2)]",
        "aria-expanded:after:rotate-0 rtl:aria-expanded:after:rotate-0",
        className,
      )}
      {...props}
    />
  )
}

function TraceCollapsibleContent({ className, ...props }: React.ComponentProps<typeof ShadcnTraceCollapsibleContent>) {
  return (
    <ShadcnTraceCollapsibleContent
      data-manga="trace-collapsible-content"
      className={cn(
        // a 1px ink rail on the start side, under the centre of the marks; content unfolds in steps
        "flex flex-col gap-2 border-s-[length:var(--mg-bw-fine)]! border-border! text-sm text-foreground! animate-drop-in",
        className,
      )}
      {...props}
    />
  )
}

export {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
}
