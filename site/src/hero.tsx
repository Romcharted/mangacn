import { useState } from "react"

/**
 * Opening page: shows the style in five seconds. Built only from base utilities for now;
 * it switches to the real SpeechBubble / Sfx / Panel components once they exist.
 */
export function Hero() {
  const [hit, setHit] = useState(0)
  return (
    <div
      key={hit}
      className={`grid aspect-[4/3] grid-cols-6 grid-rows-6 gap-2 ${hit ? "animate-impact" : ""}`}
      role="img"
      aria-label="A manga page: a figure in focus lines, a speech bubble, a speed-lines panel and an impact panel."
    >
      <div className="relative col-span-4 row-span-4 overflow-hidden border-ink-panel focus-lines">
        <Figure className="absolute inset-x-0 bottom-0 mx-auto h-[78%] text-foreground" />
        <Bubble className="absolute end-3 top-3 w-[42%]">Ready?</Bubble>
      </div>
      <div className="col-span-2 row-span-2 border-ink-panel tone-fade-b" />
      <div className="relative col-span-2 row-span-2 grid place-items-center overflow-hidden border-ink-panel speed-lines">
        <span aria-hidden className="bg-background px-1 font-sfx text-2xl">
          ザッ
        </span>
      </div>
      <div className="relative col-span-6 row-span-2 grid place-items-center overflow-hidden border-ink-panel tone-20">
        <button
          type="button"
          onClick={() => setHit((h) => h + 1)}
          className="relative grid h-24 w-44 place-items-center shape-burst ink-fill font-letter text-xl uppercase focus-ink hover:scale-105 active:translate-y-0.5"
        >
          Hit me!
        </button>
        {hit > 0 && (
          <span
            aria-hidden
            className="absolute end-6 top-1 animate-sfx font-sfx text-4xl text-foreground [-webkit-text-stroke:2px_var(--background)] [paint-order:stroke]"
          >
            DON!
          </span>
        )}
      </div>
    </div>
  )
}

function Figure({ className }: { className?: string }) {
  // Abstract head-and-shoulders silhouette, drawn for this page.
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden>
      <path
        d="M100 18c22 0 38 17 38 40 0 16-7 29-17 36l3 10c26 6 46 20 54 56H22c8-36 28-50 54-56l3-10c-10-7-17-20-17-36 0-23 16-40 38-40z"
        fill="var(--background)"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M70 52c10-22 50-26 64-4-12-4-24 2-30 10-6-8-20-12-34-6z" fill="currentColor" />
    </svg>
  )
}

function Bubble({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <svg viewBox="0 0 120 80" className="w-full" aria-hidden>
        <path
          d="M60 4C30 4 6 18 6 36s24 32 54 32c4 0 8 0 12-1l14 11-4-14c20-5 32-15 32-28C114 18 90 4 60 4z"
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center pb-3 font-letter text-lg uppercase">
        {children}
      </span>
    </div>
  )
}
