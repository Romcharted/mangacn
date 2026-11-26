import { useEffect, useRef, type ReactNode } from "react"
import type { Force } from "./state-grid"

/**
 * Showcase only: freezes a state on parts a component draws itself (a spine, a thumbnail, a cell) by
 * setting data-force on the first descendant matching `selector`, so the component keeps its own API.
 * Not a demo module: it exports no Preview.
 */
export function ForceInside({ state, selector = "button", children }: { state: Force; selector?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current?.querySelector(selector)
    el?.setAttribute("data-force", state)
  })
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  )
}
