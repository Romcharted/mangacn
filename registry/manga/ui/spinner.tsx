import * as React from "react"
import { cn } from "cn"

/*
 * G7 waiting: concentration lines turning in steps. The stock Spinner is only an icon, so this one draws
 * its own lines instead of wrapping it (see AGENTS.md, special cases). Same API: className and svg props.
 */
const rays = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  const inner = i % 3 === 0 ? 4 : 6
  const w = i % 2 ? 0.08 : 0.13
  const p = (r: number, d = 0) => `${(12 + Math.cos(a + d) * r).toFixed(2)} ${(12 + Math.sin(a + d) * r).toFixed(2)}`
  return `M${p(inner)}L${p(12, w)}L${p(12, -w)}Z`
}).join("")

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      data-slot="spinner"
      data-manga="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-5 shrink-0 animate-spin-steps", className)}
      {...props}
    >
      <path d={rays} fill="currentColor" />
    </svg>
  )
}

export { Spinner }
