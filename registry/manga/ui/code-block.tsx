"use client"

/*
 * Grammar: a code viewer in a 2px ink frame (G1), header and footer split by 1px rules. The copy button is an
 * ink-framed square: hover-thicken (G3), focus-ink, an impact on click (G4), and the stock check icon once copied.
 * Highlighted / added / removed lines carry a 6px bar at the start, as an inset shadow in place of the stock
 * bg-muted (ink, or accent for removed). Numbers and the + / − marks (stock ::before / ::after) are ink, the
 * removed mark is accent.
 *
 * Special rule: the syntax colours are monochrome. Token spans from a highlighter (inline styles included) are
 * forced to the ink, so the code reads in the kit's two values plus its one accent.
 *
 * Stock classes are kept and beaten with `!`, because cn does not merge classes in this kit.
 */

import * as React from "react"
import { cn } from "cn"

import {
  CodeBlock as ShadcnCodeBlock,
  CodeBlockActions as ShadcnCodeBlockActions,
  CodeBlockContent as ShadcnCodeBlockContent,
  CodeBlockCopyButton as ShadcnCodeBlockCopyButton,
  CodeBlockFooter as ShadcnCodeBlockFooter,
  CodeBlockHeader as ShadcnCodeBlockHeader,
  CodeBlockLine as ShadcnCodeBlockLine,
  CodeBlockTitle as ShadcnCodeBlockTitle,
} from "@/components/ui/code-block"
import { withImpact } from "@/lib/manga/gestures"

function CodeBlock({ className, ...props }: React.ComponentProps<typeof ShadcnCodeBlock>) {
  return (
    <ShadcnCodeBlock
      data-manga="code-block"
      className={cn(
        "rounded-(--radius)! border-ink! bg-background! text-foreground! shadow-none!",
        "data-[variant=destructive]:border-destructive! data-[variant=destructive]:text-destructive!",
        "has-[>[data-slot=code-block-content]:focus-visible]:ring-0!",
        "has-[>[data-slot=code-block-content]:focus-visible]:[outline:2px_solid_var(--ring)]!",
        "has-[>[data-slot=code-block-content]:focus-visible]:[outline-offset:4px]!",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<typeof ShadcnCodeBlockHeader>) {
  return (
    <ShadcnCodeBlockHeader
      className={cn(
        "pb-2! text-foreground! [border-bottom:var(--mg-bw-fine)_solid_var(--border)]!",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<typeof ShadcnCodeBlockTitle>) {
  return <ShadcnCodeBlockTitle className={cn("font-letter! text-base! font-normal! tracking-wide text-foreground!", className)} {...props} />
}

function CodeBlockActions({ className, ...props }: React.ComponentProps<typeof ShadcnCodeBlockActions>) {
  // Stock hides the actions until hover when they sit in the block: keep them visible.
  return (
    <ShadcnCodeBlockActions
      className={cn("opacity-100! [[data-slot=code-block]>&]:static! [[data-slot=code-block]>&]:opacity-100!", className)}
      {...props}
    />
  )
}

/**
 * The copy button: an ink-framed square. Stock draws the copy and check icons itself, so this button cannot take
 * children: the impact plays through its data attribute (the speed lines of ImpactLines are not added here).
 */
function CodeBlockCopyButton({
  variant = "ghost",
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof ShadcnCodeBlockCopyButton>) {
  // The stock handler is typed with the Base UI event; it receives the same DOM click at runtime.
  const handler = onClick as unknown as ((event: React.MouseEvent<HTMLButtonElement>) => void) | undefined
  return (
    <ShadcnCodeBlockCopyButton
      data-manga="code-block-copy"
      variant={variant}
      {...props}
      onClick={withImpact<React.MouseEvent<HTMLButtonElement>>(handler)}
      className={cn(
        "rounded-(--radius)! border-ink! bg-background! text-foreground! size-7! max-sm:size-11!",
        "hover:bg-background! hover:text-foreground! dark:hover:bg-background! hover-thicken focus-ink",
        "focus-visible:ring-0! focus-visible:border-ink! focus-visible:[outline:2px_solid_var(--ring)]! focus-visible:[outline-offset:4px]!",
        "data-[impact]:animate-hit active:translate-x-0.5 active:translate-y-0.5 active:border-primary! active:bg-primary! active:text-primary-foreground!",
        className,
      )}
    />
  )
}

function CodeBlockContent({ className, ...props }: React.ComponentProps<typeof ShadcnCodeBlockContent>) {
  return (
    <ShadcnCodeBlockContent
      className={cn(
        // Token colours from a highlighter become ink. Structural spans carry data-slot and keep their own colour.
        "[&_span:not([data-slot])]:text-foreground!",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockLine({ className, ...props }: React.ComponentProps<typeof ShadcnCodeBlockLine>) {
  return (
    <ShadcnCodeBlockLine
      className={cn(
        // base draws bg-muted as a light tone: never behind text (Rule A)
        "bg-transparent! bg-none!",
        // room for the 6px bar, then the +/− mark, then the code
        "ps-5! after:start-2!",
        "data-[variant=highlighted]:shadow-[inset_6px_0_0_var(--foreground)]! data-[variant=added]:shadow-[inset_6px_0_0_var(--foreground)]!",
        "data-[variant=removed]:shadow-[inset_6px_0_0_var(--destructive)]!",
        "rtl:data-[variant=highlighted]:shadow-[inset_-6px_0_0_var(--foreground)]! rtl:data-[variant=added]:shadow-[inset_-6px_0_0_var(--foreground)]!",
        "rtl:data-[variant=removed]:shadow-[inset_-6px_0_0_var(--destructive)]!",
        "before:text-foreground! after:text-foreground!",
        "data-[variant=removed]:after:text-destructive! data-[variant=removed]:text-destructive! data-[variant=removed]:line-through",
        className,
      )}
      {...props}
    />
  )
}

function CodeBlockFooter({ className, ...props }: React.ComponentProps<typeof ShadcnCodeBlockFooter>) {
  return (
    <ShadcnCodeBlockFooter
      className={cn(
        "pt-2! text-foreground! [border-top:var(--mg-bw-fine)_solid_var(--border)]!",
        className,
      )}
      {...props}
    />
  )
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
  CodeBlockFooter,
}
