import * as React from "react"
import { cn } from "cn"

export type ManpuKind = "anger" | "sweat" | "surprise" | "question" | "sparkle" | "gloom" | "love" | "sigh"

export type ManpuProps = Omit<React.ComponentProps<"span">, "children"> & {
  kind: ManpuKind
  /** Size in em of the surrounding text, or any CSS length. */
  size?: string
  /** Pops in (G5) and, for some marks, keeps a small stepped motion. Off with reduced motion. */
  animated?: boolean
  /** Spoken meaning for screen readers. Without it the mark is decorative (aria-hidden). */
  label?: string
}

const ink = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }

// Emotion marks drawn for this kit (manpu, 漫符). 32×32 viewBox, ink strokes, paper fills.
const marks: Record<ManpuKind, React.ReactNode> = {
  anger: <path d="M13 3c0 6-3 9-9 9M19 3c0 6 3 9 9 9M13 29c0-6-3-9-9-9M19 29c0-6 3-9 9-9" style={{ ...ink, strokeWidth: 3.5 }} />,
  sweat: (
    <>
      <path d="M16 3c4 8 9 13 9 19a9 9 0 0 1-18 0c0-6 5-11 9-19z" fill="var(--background)" style={{ ...ink, strokeWidth: 2.5, fill: "var(--background)" }} />
      <path d="M12 22c0 2 1.5 4 4 4" style={{ ...ink, strokeWidth: 2 }} />
    </>
  ),
  surprise: (
    <>
      <path d="M16 3v14M8 5l3 9M24 5l-3 9" style={{ ...ink, strokeWidth: 3.5 }} />
      <circle cx="16" cy="26" r="2.5" fill="currentColor" />
    </>
  ),
  question: (
    <>
      <path d="M10 10c0-4 3-7 7-7s7 3 7 7c0 5-7 6-7 11" style={{ ...ink, strokeWidth: 3.5 }} />
      <circle cx="17" cy="28" r="2.3" fill="currentColor" />
    </>
  ),
  sparkle: <path d="M16 2c1 8 4 12 12 14-8 2-11 6-12 14-1-8-4-12-12-14 8-2 11-6 12-14z" fill="currentColor" />,
  gloom: <path d="M6 3v18M11 3v24M16 3v14M21 3v22M26 3v16" style={{ ...ink, strokeWidth: 2 }} />,
  love: <path d="M16 28C6 21 3 15 3 10a6.5 6.5 0 0 1 13-1 6.5 6.5 0 0 1 13 1c0 5-3 11-13 18z" style={{ ...ink, strokeWidth: 2.5, fill: "var(--background)" }} />,
  sigh: <path d="M4 20c4-6 10-6 13-2s1 9-4 8-4-8 2-10 13 2 13 2" style={{ ...ink, strokeWidth: 2.5 }} />,
}

/** Emotion marks (manpu): anger vein, sweat drop, surprise lines, question, sparkle, gloom lines, love, sigh. */
function Manpu({ kind, size = "1.5em", animated = true, label, className, style, ...props }: ManpuProps) {
  return (
    <span
      data-manga="manpu"
      data-kind={kind}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block shrink-0 align-middle text-foreground", animated && "animate-pop", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg
        viewBox="0 0 32 32"
        className={cn("size-full overflow-visible", animated && (kind === "anger" || kind === "sparkle") && "animate-[mg-wiggle_500ms_step-end_infinite]")}
      >
        {marks[kind]}
      </svg>
    </span>
  )
}

export { Manpu }
