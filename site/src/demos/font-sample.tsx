import type { ReactNode } from "react"
import { Tile, Tiles } from "../state-grid"

/*
 * Shared pieces of the four font pages (font-body, font-lettering, font-sfx, font-japanese). Not a demo of its
 * own: the item pages load font-body.tsx and the others, which use these.
 */

export const SIZES = ["text-sm", "text-base", "text-xl", "text-3xl", "text-5xl"] as const

export function Specimen({ font, text, className = "" }: { font: string; text: string; className?: string }) {
  return <p className={`${font} max-w-md text-center text-4xl leading-tight ${className}`}>{text}</p>
}

export function SizeTiles({ font, text }: { font: string; text: string }) {
  return (
    <Tiles>
      {SIZES.map((s) => (
        <Tile key={s} label={s}>
          <span className={`${font} ${s} leading-tight`}>{text}</span>
        </Tile>
      ))}
    </Tiles>
  )
}

export function Panel({ children }: { children: ReactNode }) {
  return <div className="grid w-80 max-w-full gap-3 border-ink p-4">{children}</div>
}
