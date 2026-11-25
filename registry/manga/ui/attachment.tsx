import * as React from "react"
import { cn } from "cn"

import {
  Attachment as ShadcnAttachment,
  AttachmentAction as ShadcnAttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription as ShadcnAttachmentDescription,
  AttachmentGroup as ShadcnAttachmentGroup,
  AttachmentMedia as ShadcnAttachmentMedia,
  AttachmentTitle as ShadcnAttachmentTitle,
  AttachmentTrigger as ShadcnAttachmentTrigger,
} from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/manga/button"

/*
 * A file attached to a message or a prompt (G1 frame, G3 hover, G5 pop, G7 running line, G8 mark).
 * A 2px ink frame, paper inside, no tone shadow (it sits inside a case). States (data-state):
 *   done        rest
 *   uploading   a running line (fill-lines) along the bottom edge
 *   processing  the Spinner in the media square (concentration lines)
 *   error       accent line, mark-error, description in accent
 *   idle        a solid line with a "+" mark (the stock dashes mean disabled only in this kit: special rule)
 * Clickable (AttachmentTrigger): hover-lift and focus-ink. Actions: square ink buttons, hover-thicken.
 */

type Stock<T> = Omit<T, "render" | "asChild">

function Attachment({
  className,
  children,
  state = "done",
  ...props
}: React.ComponentProps<typeof ShadcnAttachment>) {
  return (
    <ShadcnAttachment
      data-manga="attachment"
      state={state}
      className={cn(
        "animate-pop rounded-(--radius)! border-[length:var(--mg-bw)]! border-border! bg-background! text-foreground! shadow-none",
        "focus-within:ring-0! has-[>a,>button]:hover:bg-background! has-[>a,>button]:hover-lift",
        "data-[state=idle]:border-solid! data-[state=idle]:pe-9! data-[state=idle]:before:absolute data-[state=idle]:before:end-3 data-[state=idle]:before:top-1/2 data-[state=idle]:before:-translate-y-1/2 data-[state=idle]:before:font-letter data-[state=idle]:before:text-xl data-[state=idle]:before:leading-none data-[state=idle]:before:content-['+']",
        "data-[state=error]:border-destructive! data-[state=error]:mark-error",
        className,
      )}
      {...props}
    >
      {children}
      {state === "uploading" && (
        <span aria-hidden data-slot="attachment-progress" className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 fill-lines" />
      )}
    </ShadcnAttachment>
  )
}

function AttachmentMedia({
  className,
  variant = "icon",
  children,
  ...props
}: React.ComponentProps<typeof ShadcnAttachmentMedia>) {
  return (
    <ShadcnAttachmentMedia
      data-manga="attachment-media"
      variant={variant}
      className={cn(
        "rounded-(--radius)! border-[length:var(--mg-bw-fine)]! border-border! bg-background! bg-none! text-foreground!",
        "opacity-100! group-data-[state=error]/attachment:bg-background! group-data-[state=error]/attachment:text-destructive!",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="absolute inset-0 hidden items-center justify-center bg-background group-data-[state=processing]/attachment:flex"
      >
        <Spinner className="size-6!" />
      </span>
    </ShadcnAttachmentMedia>
  )
}

function AttachmentTitle({ className, ...props }: React.ComponentProps<typeof ShadcnAttachmentTitle>) {
  // no stock shimmer while uploading / processing (a grey sweep): the bar and the Spinner say it instead
  return (
    <ShadcnAttachmentTitle
      className={cn("font-sans! font-semibold text-foreground! animate-none! bg-none! [-webkit-text-fill-color:currentColor]!", className)}
      {...props}
    />
  )
}

function AttachmentDescription({ className, ...props }: React.ComponentProps<typeof ShadcnAttachmentDescription>) {
  return (
    <ShadcnAttachmentDescription
      className={cn("font-mono! text-foreground! group-data-[state=error]/attachment:text-destructive!", className)}
      {...props}
    />
  )
}

function AttachmentAction({ className, ...props }: Stock<React.ComponentProps<typeof ShadcnAttachmentAction>>) {
  return (
    <ShadcnAttachmentAction
      data-manga="attachment-action"
      className={cn(
        "rounded-(--radius)! border-[length:var(--mg-bw)]! border-border! bg-background! text-foreground! hover:bg-background! hover-thicken focus-ink",
        "max-sm:min-h-11! max-sm:min-w-11!",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentTrigger({ className, ...props }: Stock<React.ComponentProps<typeof ShadcnAttachmentTrigger>>) {
  return <ShadcnAttachmentTrigger data-manga="attachment-trigger" className={cn("focus-ink", className)} {...props} />
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<typeof ShadcnAttachmentGroup>) {
  return <ShadcnAttachmentGroup className={cn("flex-wrap! gap-2! overflow-visible!", className)} {...props} />
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
