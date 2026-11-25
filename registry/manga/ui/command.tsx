"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Command as ShadcnCommand,
  CommandEmpty as ShadcnCommandEmpty,
  CommandGroup as ShadcnCommandGroup,
  CommandInput as ShadcnCommandInput,
  CommandItem as ShadcnCommandItem,
  CommandList as ShadcnCommandList,
  CommandSeparator as ShadcnCommandSeparator,
  CommandShortcut as ShadcnCommandShortcut,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/manga/dialog"

/*
 * Wraps the stock command (cmdk). The palette is a case (G1); the search row is a field with a search
 * mark and a 2px line under it; the highlighted item is an ink flat (G3, inverts); headings are lettering;
 * the dialog is the manga Dialog (pop in three steps, G5) and its case is the palette itself.
 */

function Command({ className, ...props }: React.ComponentProps<typeof ShadcnCommand>) {
  return (
    <ShadcnCommand
      data-manga="command"
      className={cn(
        "ink-case relative flex size-full flex-col overflow-visible! rounded-(--radius)! bg-background! p-1 text-base text-foreground ring-0 shadow-none!",
        className,
      )}
      {...props}
    />
  )
}

/** The palette in a dialog: the manga Dialog frame is hidden, the Command draws the case. */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        data-manga="command-dialog"
        showCloseButton={false}
        className={cn("top-1/3 translate-y-0 gap-0 overflow-visible border-0! bg-transparent! p-0 shadow-none! after:hidden!", className)}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

/** The search row: a search mark, the stock input with its group drawn flat, a 2px line under it. */
function CommandInput({ className, ...props }: React.ComponentProps<typeof ShadcnCommandInput>) {
  return (
    <div
      data-manga="command-input"
      className="flex h-11 items-center gap-2 border-b-[length:var(--mg-bw)] border-border ps-3 pe-3 has-focus-visible:shadow-[inset_0_-3px_0_var(--ring)] [&_[data-slot=command-input-wrapper]]:min-w-0 [&_[data-slot=command-input-wrapper]]:flex-1 [&_[data-slot=command-input-wrapper]]:p-0 [&_[data-slot=input-group]]:h-full! [&_[data-slot=input-group]]:rounded-none! [&_[data-slot=input-group]]:border-0! [&_[data-slot=input-group]]:bg-transparent! [&_[data-slot=input-group]]:shadow-none! [&_[data-slot=input-group]]:dark:bg-transparent! [&_[data-slot=input-group-addon]]:hidden"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5 shrink-0">
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="3.2" strokeLinecap="square" />
      </svg>
      <ShadcnCommandInput
        className={cn(
          "h-full w-full min-w-0 bg-transparent text-base outline-none placeholder:text-foreground placeholder:italic",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<typeof ShadcnCommandList>) {
  return <ShadcnCommandList data-manga="command-list" className={cn("max-h-80 py-1", className)} {...props} />
}

/** Nothing matches: a “…” mark and a short line, like the empty Select. */
function CommandEmpty({ className, children = "Nothing here yet.", ...props }: React.ComponentProps<typeof ShadcnCommandEmpty>) {
  return (
    <ShadcnCommandEmpty data-manga="command-empty" className={cn("flex items-center gap-3 px-2 py-6 text-sm", className)} {...props}>
      <span aria-hidden className="font-sfx text-2xl leading-none">
        …
      </span>
      {children}
    </ShadcnCommandEmpty>
  )
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof ShadcnCommandGroup>) {
  return (
    <ShadcnCommandGroup
      data-manga="command-group"
      className={cn(
        "overflow-visible p-1 text-foreground",
        "**:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:pt-1.5 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:font-letter **:[[cmdk-group-heading]]:text-sm **:[[cmdk-group-heading]]:tracking-wide **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:text-foreground! **:[[cmdk-group-heading]]:underline **:[[cmdk-group-heading]]:decoration-2 **:[[cmdk-group-heading]]:underline-offset-4",
        className,
      )}
      {...props}
    />
  )
}

/** A fine ink rule. */
function CommandSeparator({ className, ...props }: React.ComponentProps<typeof ShadcnCommandSeparator>) {
  return <ShadcnCommandSeparator data-manga="command-separator" className={cn("-mx-1 my-1 h-[length:var(--mg-bw-fine)] bg-border", className)} {...props} />
}

function CommandItem({ className, children, ...props }: React.ComponentProps<typeof ShadcnCommandItem>) {
  return (
    <ShadcnCommandItem
      data-manga="command-item"
      className={cn(
        "relative gap-3 rounded-none py-1.5 ps-2 pe-9 text-base outline-none",
        // G3: the highlighted item (mouse or keyboard) inverts to ink; the stock muted fill is replaced
        "data-selected:bg-foreground! data-selected:text-background! data-selected:*:[svg]:text-background!",
        // G8: a brush check on the chosen item; the stock check icon is hidden
        "[&>svg:last-child]:hidden after:absolute after:end-2 after:text-lg data-[checked=true]:after:mark-check",
        // disabled: label kept on paper, dashed underline, not-allowed cursor
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-100! data-[disabled=true]:underline data-[disabled=true]:decoration-dashed data-[disabled=true]:decoration-2 data-[disabled=true]:underline-offset-4",
        "data-[disabled=true]:data-selected:bg-transparent! data-[disabled=true]:data-selected:text-foreground!",
        className,
      )}
      {...props}
    >
      {children}
    </ShadcnCommandItem>
  )
}

/** A key cap: mono lettering in a fine frame (the Kbd look, drawn here so this item needs no Kbd). */
function CommandShortcut({ className, ...props }: React.ComponentProps<typeof ShadcnCommandShortcut>) {
  return (
    <ShadcnCommandShortcut
      data-manga="command-shortcut"
      className={cn(
        "border-[length:var(--mg-bw-fine)] border-current px-1.5 py-px font-mono text-xs leading-5 tracking-widest text-current!",
        className,
      )}
      {...props}
    />
  )
}

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut }
