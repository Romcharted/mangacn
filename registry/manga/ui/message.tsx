import * as React from "react"
import { cn } from "cn"

import {
  Message as ShadcnMessage,
  MessageAvatar as ShadcnMessageAvatar,
  MessageContent,
  MessageFooter as ShadcnMessageFooter,
  MessageGroup,
  MessageHeader as ShadcnMessageHeader,
} from "@/components/ui/message"

/*
 * A line of a conversation: a square avatar frame (only bubbles are round), the speaker's name in
 * lettering, the time in a small monospace. Pair with Bubble for the words.
 */
function Message({ className, ...props }: React.ComponentProps<typeof ShadcnMessage>) {
  return <ShadcnMessage data-manga="message" className={cn("gap-3 text-base", className)} {...props} />
}

function MessageAvatar({ className, ...props }: React.ComponentProps<typeof ShadcnMessageAvatar>) {
  return (
    <ShadcnMessageAvatar
      className={cn("size-9 min-w-9 rounded-none border-[length:var(--mg-bw)] border-border bg-background font-letter text-sm uppercase", className)}
      {...props}
    />
  )
}

function MessageHeader({ className, ...props }: React.ComponentProps<typeof ShadcnMessageHeader>) {
  return <ShadcnMessageHeader className={cn("px-1 font-letter text-sm font-normal tracking-wide text-foreground uppercase", className)} {...props} />
}

function MessageFooter({ className, ...props }: React.ComponentProps<typeof ShadcnMessageFooter>) {
  return <ShadcnMessageFooter className={cn("px-1 pt-2 font-mono text-xs font-normal text-foreground", className)} {...props} />
}

export { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader }
