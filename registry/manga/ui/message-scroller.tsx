"use client"

import * as React from "react"
import { ArrowDownIcon } from "lucide-react"
import { cn } from "cn"

import {
  MessageScroller as ShadcnMessageScroller,
  MessageScrollerButton as ShadcnMessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport as ShadcnMessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@/components/ui/message-scroller"
import { ImpactLines, withImpact } from "@/lib/manga/gestures"

/*
 * The scrolling column of a conversation (G1 container, G3 hover, G4 impact, G5 pop). The viewport keeps the
 * stock behaviour (it is a scroller): a thin ink scrollbar and no grey fade at the edge. The "jump to latest"
 * button is a square ink frame (only bubbles are round), pops in when it appears (G5), and hits on click (G4).
 */

type Stock<T> = Omit<T, "render" | "asChild">

function MessageScroller({ className, ...props }: React.ComponentProps<typeof ShadcnMessageScroller>) {
  return (
    <ShadcnMessageScroller
      data-manga="message-scroller"
      className={cn("bg-background text-foreground", className)}
      {...props}
    />
  )
}

function MessageScrollerViewport({ className, ...props }: React.ComponentProps<typeof ShadcnMessageScrollerViewport>) {
  return (
    <ShadcnMessageScrollerViewport
      className={cn(
        "[mask-image:none]! [-webkit-mask-image:none]! [scrollbar-color:var(--foreground)_var(--background)]! [scrollbar-width:thin]",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerButton({
  direction = "end",
  className,
  children,
  onClick,
  ...props
}: Stock<React.ComponentProps<typeof ShadcnMessageScrollerButton>>) {
  const handleClick = withImpact(onClick) as React.MouseEventHandler<HTMLButtonElement>
  return (
    <ShadcnMessageScrollerButton
      data-manga="message-scroller-button"
      direction={direction}
      onClick={handleClick}
      className={cn(
        "rounded-(--radius)! border-[length:var(--mg-bw)]! border-border! bg-background! text-foreground! shadow-none! hover:bg-background! hover:text-foreground!",
        "size-8! max-sm:size-11! [&_svg]:size-5!",
        "transition-none! data-[active=false]:hidden! data-[active=true]:animate-pop data-[impact]:animate-hit",
        "hover-lift focus-ink",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <ImpactLines />
          <ArrowDownIcon />
          <span className="sr-only">{direction === "end" ? "Scroll to latest message" : "Scroll to first message"}</span>
        </>
      )}
    </ShadcnMessageScrollerButton>
  )
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
