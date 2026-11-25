import * as React from "react"
import { cn } from "cn"

import {
  Accordion as ShadcnAccordion,
  AccordionContent as ShadcnAccordionContent,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger as ShadcnAccordionTrigger,
} from "@/components/ui/accordion"

/*
 * Grammar: items are cases stacked so they share their lines (G1). Open: the header is an ink flat
 * that sweeps in (G2), the content drops in by steps (G5) and the brush chevron turns in two steps.
 * Hover (G3, frameless row): the label underline thickens. Both libraries set aria-expanded and
 * data-disabled on the trigger. Radix needs `type="single" | "multiple"` on <Accordion>; Base UI does not.
 */

function Accordion({ className, ...props }: React.ComponentProps<typeof ShadcnAccordion>) {
  return (
    <ShadcnAccordion
      data-manga="accordion"
      className={cn("relative ink-case rounded-(--radius)", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof ShadcnAccordionItem>) {
  return (
    <ShadcnAccordionItem
      data-manga="accordion-item"
      className={cn("border-b-0 not-last:border-b-[length:var(--mg-bw-panel)] border-border", className)}
      {...props}
    />
  )
}

function AccordionTrigger({ className, ...props }: React.ComponentProps<typeof ShadcnAccordionTrigger>) {
  return (
    <ShadcnAccordionTrigger
      data-manga="accordion-trigger"
      className={cn(
        "items-center gap-3 rounded-none border-0 bg-background px-4 py-3 font-letter text-lg tracking-wide text-foreground uppercase transition-none",
        "hover:no-underline hover:[&>span:first-child]:underline",
        "decoration-[3px] underline-offset-4 hover:underline",
        // brush chevron instead of the stock icons
        "**:data-[slot=accordion-trigger-icon]:hidden! after:mark-chevron after:ms-auto after:shrink-0 after:text-base",
        "aria-expanded:after:rotate-180 aria-expanded:after:animate-chevron",
        // G2: the open header is an ink flat
        "aria-expanded:ink-fill aria-expanded:fill-in aria-expanded:bg-primary! aria-expanded:text-primary-foreground!",
        "focus-visible:ring-0 focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-[6px] focus-visible:outline-current",
        "aria-disabled:cursor-not-allowed aria-disabled:pointer-events-auto aria-disabled:opacity-100 data-disabled:cursor-not-allowed data-disabled:pointer-events-auto data-disabled:opacity-100",
        "data-[disabled]:tone-frame data-[disabled]:[--frame-w:5px] data-[disabled]:underline data-[disabled]:decoration-dashed data-[disabled]:decoration-2 aria-disabled:tone-frame aria-disabled:[--frame-w:5px]",
        className,
      )}
      {...props}
    />
  )
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof ShadcnAccordionContent>) {
  return (
    <ShadcnAccordionContent
      data-manga="accordion-content"
      className={cn(
        "data-open:animate-none data-closed:animate-none data-[state=open]:animate-none data-[state=closed]:animate-none",
        "border-t-[length:var(--mg-bw)] border-border px-4 pt-3 pb-4 text-base",
        className,
      )}
      {...props}
    >
      <div className="animate-drop-in">{children}</div>
    </ShadcnAccordionContent>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
