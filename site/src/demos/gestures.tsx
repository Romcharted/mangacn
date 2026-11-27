import { useState } from "react"
import { ImpactLines, withImpact } from "@/lib/manga/gestures"
import { to } from "../router"

/** A plain element made to hit: data-[impact]:animate-hit + <ImpactLines /> + withImpact(). */
function Hit({ children, onHit }: { children: React.ReactNode; onHit?: () => void }) {
  return (
    <button
      type="button"
      onClick={withImpact(onHit)}
      className="relative border-ink bg-primary px-4 py-2 font-letter text-primary-foreground uppercase focus-ink press active:bg-background active:text-foreground data-[impact]:animate-hit"
    >
      {children}
      <ImpactLines />
    </button>
  )
}

export function Preview() {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-12 px-8 py-4">
        <Hit>Hit me</Hit>
        <Hit>Again</Hit>
      </div>
      <p className="text-sm">
        Without JavaScript the press still shows a 2px offset, the negative and the lines. Every gesture is on the{" "}
        <a href={to("docs/grammar")} className="hover-underline">
          Grammar page
        </a>
        .
      </p>
    </div>
  )
}

/** Live: each hit lands, and is counted. */
export function Thumb() {
  const [hits, setHits] = useState(0)
  return (
    <div className="px-6">
      <Hit onHit={() => setHits((n) => n + 1)}>{hits ? `Hit ×${hits}` : "Hit me"}</Hit>
    </div>
  )
}
