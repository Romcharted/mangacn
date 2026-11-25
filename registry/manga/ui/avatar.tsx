import * as React from "react"
import { cn } from "cn"

import {
  Avatar as ShadcnAvatar,
  AvatarBadge as ShadcnAvatarBadge,
  AvatarFallback as ShadcnAvatarFallback,
  AvatarGroup as ShadcnAvatarGroup,
  AvatarGroupCount as ShadcnAvatarGroupCount,
  AvatarImage as ShadcnAvatarImage,
} from "@/components/ui/avatar"

/*
 * A small square panel (only speech bubbles are round): 2px ink frame, picture inside, initials in
 * lettering on paper (no tone under them, rule A). In a group, avatars overlap with a paper gap.
 */
function Avatar({ className, ...props }: React.ComponentProps<typeof ShadcnAvatar>) {
  return (
    <ShadcnAvatar
      data-manga="avatar"
      className={cn(
        "rounded-none border-[length:var(--mg-bw)] border-border bg-background after:hidden data-[size=default]:size-9 data-[size=lg]:size-12 data-[size=sm]:size-7",
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof ShadcnAvatarImage>) {
  return <ShadcnAvatarImage className={cn("rounded-none grayscale contrast-125", className)} {...props} />
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof ShadcnAvatarFallback>) {
  return (
    <ShadcnAvatarFallback
      className={cn(
        "rounded-none bg-background font-letter text-sm text-foreground uppercase group-data-[size=lg]/avatar:text-lg group-data-[size=sm]/avatar:text-xs",
        className,
      )}
      {...props}
    />
  )
}

/** Status mark: a small ink square (a burst would be noise at this size). */
function AvatarBadge({ className, ...props }: React.ComponentProps<typeof ShadcnAvatarBadge>) {
  return <ShadcnAvatarBadge className={cn("-end-1 -bottom-1 rounded-none bg-foreground ring-2 ring-background", className)} {...props} />
}

function AvatarGroup({ className, ...props }: React.ComponentProps<typeof ShadcnAvatarGroup>) {
  return <ShadcnAvatarGroup className={cn("-space-x-1.5 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background", className)} {...props} />
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<typeof ShadcnAvatarGroupCount>) {
  return (
    <ShadcnAvatarGroupCount
      className={cn("size-9 rounded-none border-[length:var(--mg-bw)] border-border bg-foreground font-letter text-sm text-background ring-2 ring-background", className)}
      {...props}
    />
  )
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage }
