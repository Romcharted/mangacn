"use client"

import * as React from "react"
import { cn } from "cn"

import { Badge } from "@/components/ui/manga/badge"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { TonedImage } from "@/components/manga/toned-image"

export type CharacterStat = {
  label: string
  value: number
  /** Top of the bar (default 100). */
  max?: number
}

export type CharacterCardProps = Omit<React.ComponentProps<"article">, "role"> & {
  name: string
  role?: string
  /** Portrait, toned as a screentone. Without one, the initials stand on paper. */
  image?: string
  stats?: CharacterStat[]
  tags?: string[]
  /** A short line in a small speech bubble. */
  quote?: string
  /** Lifts on hover (G3) and takes focus (G3, ink ring). Static by default. */
  interactive?: boolean
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

/*
 * A character sheet in a case (G1): portrait panel, name in lettering, role, stats as bars filled with
 * speed lines (G7, like Progress), tags and a quote in a bubble. Static unless `interactive`.
 */
function CharacterCard({ name, role, image, stats = [], tags = [], quote, interactive = false, className, ...props }: CharacterCardProps) {
  return (
    <article
      data-manga="character-card"
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "relative ink-case grid w-full max-w-72 gap-4 p-4",
        interactive && "hover-lift focus-ink cursor-pointer",
        className,
      )}
      {...props}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-ink-fine bg-background">
        {image ? (
          <TonedImage src={image} alt={name} className="size-full" />
        ) : (
          <span aria-hidden className="grid size-full place-items-center font-letter text-5xl uppercase">
            {initials(name)}
          </span>
        )}
      </div>

      <header className="grid gap-1">
        <h3 className="font-letter text-2xl leading-none uppercase">{name}</h3>
        {role && <p className="font-letter text-base uppercase tracking-wide">{role}</p>}
      </header>

      {quote && (
        <SpeechBubble tail="top" tailAlign="start" className="max-w-full justify-self-start px-4 py-3 text-base">
          {quote}
        </SpeechBubble>
      )}

      {stats.length > 0 && (
        <dl className="grid gap-2">
          {stats.map((s) => {
            const max = s.max ?? 100
            const pct = Math.min(100, Math.max(0, (s.value / max) * 100))
            return (
              <div key={s.label} className="grid gap-1">
                <div className="flex items-baseline justify-between font-letter text-sm uppercase">
                  <dt>{s.label}</dt>
                  <dd className="font-sfx text-base leading-none">
                    {s.value}
                    {s.max !== undefined && <span className="text-sm">/{s.max}</span>}
                  </dd>
                </div>
                <div
                  role="meter"
                  aria-label={s.label}
                  aria-valuemin={0}
                  aria-valuemax={max}
                  aria-valuenow={s.value}
                  className="h-4 border-[length:var(--mg-bw)] border-border bg-background p-0.5"
                >
                  <div className="h-full fill-lines origin-left animate-bar-in" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </dl>
      )}

      {tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <li key={t}>
              <Badge variant="outline">{t}</Badge>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export { CharacterCard }
