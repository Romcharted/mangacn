import * as React from "react"
import { cn } from "cn"

import {
  Breadcrumb,
  BreadcrumbEllipsis as ShadcnBreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink as ShadcnBreadcrumbLink,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

/*
 * Lettering, links underlined that thicken on hover (G3, links), the current page an ink flat (G2),
 * brush chevrons between steps (G8).
 */
function BreadcrumbList({ className, ...props }: React.ComponentProps<typeof ShadcnBreadcrumbList>) {
  return <ShadcnBreadcrumbList className={cn("gap-2 font-letter text-base tracking-wide text-foreground uppercase", className)} {...props} />
}

function BreadcrumbLink({ className, ...props }: React.ComponentProps<typeof ShadcnBreadcrumbLink>) {
  return <ShadcnBreadcrumbLink className={cn("hover-underline hover:text-foreground focus-ink", className)} {...props} />
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<typeof ShadcnBreadcrumbPage>) {
  return <ShadcnBreadcrumbPage className={cn("ink-fill px-1.5 py-0.5 text-primary-foreground!", className)} {...props} />
}

function BreadcrumbSeparator({ className, children, ...props }: React.ComponentProps<typeof ShadcnBreadcrumbSeparator>) {
  return (
    <ShadcnBreadcrumbSeparator
      className={cn(!children && "[&>svg]:hidden after:mark-chevron after:-rotate-90 rtl:after:rotate-90 after:text-xs", className)}
      {...props}
    >
      {children}
    </ShadcnBreadcrumbSeparator>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<typeof ShadcnBreadcrumbEllipsis>) {
  return <ShadcnBreadcrumbEllipsis className={cn("[&>svg]:hidden after:font-sfx after:content-['…']", className)} {...props} />
}

export { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator }
