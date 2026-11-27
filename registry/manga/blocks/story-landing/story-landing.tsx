"use client"

/*
 * Story landing: a product page told as a short manga, for an invented habit app (Tsugi). It opens on a
 * magazine cover, lists its chapters like the contents page of a volume, explains the product in a
 * four-panel strip, lets a guide talk the reader through it in a dialogue box, and titles every section as a
 * chapter. Jumping to a chapter plays a stepped scene transition (instant with reduced motion), then moves
 * focus to the chapter's heading. The strip is a Yonkoma on the page model: captions and the sound effect
 * are `Place`d on its panels, sized with the page. Nothing is posted; links never navigate.
 * The block ships no image: pass the cover and the faces in `art` (without them the cover is screentone and the
 * faces are left out). The strip draws its own pictures in ink (a goal on a page, a check, a cross, a burst);
 * `art.beats` replaces them with your own pictures if you prefer.
 * One column on phones; container queries (`@container/story`) widen it.
 */
import * as React from "react"
import { cn } from "cn"

import { Button } from "@/components/ui/manga/button"
import { ChapterTitle } from "@/components/manga/chapter-title"
import { DialogueBox, type DialogueLine } from "@/components/manga/dialogue-box"
import { MagazineCover } from "@/components/manga/magazine-cover"
import { PanelCaption, Place } from "@/components/manga/panel"
import { useSceneTransition } from "@/components/manga/scene-transition"
import { Sfx } from "@/components/manga/sfx"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { Yonkoma } from "@/components/manga/yonkoma"

/* ---------- Pictures: passed in `art`, none ships with the block ---------- */

export type StoryLandingArt = {
  /** The magazine cover's picture. */
  cover?: string
  /** The guide's face, in the dialogue box. */
  guide?: string
  /** The reader's face, when they answer. */
  reader?: string
  /** Your own picture for each panel of the four-panel strip, instead of the drawn ones. */
  beats?: [string, string, string, string]
}

/** One beat of the four-panel strip: your picture if you pass one, otherwise what the caption says, in ink. */
function Beat({ src, index }: { src?: string; index: number }) {
  if (src) return <img src={src} alt="" draggable={false} className="absolute inset-0 size-full object-cover" />
  return (
    <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-x-[8%] top-[26%] bottom-[6%] h-[68%] w-[84%] text-foreground">
      {index === 0 && <GoalPage />}
      {index === 1 && <Check />}
      {index === 2 && <Cross />}
      {index === 3 && <Week />}
    </svg>
  )
}

const INK = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const

/** Panel 1: today's page, one goal written on it, the brush still on the paper. */
function GoalPage() {
  return (
    <g {...INK} strokeWidth={3}>
      <rect x={22} y={10} width={56} height={80} className="fill-background" />
      <path d="M32 26 H68" strokeWidth={2} />
      <path d="M32 40 Q44 34 52 40 T68 38" strokeWidth={4} />
      <path d="M32 54 H58" strokeWidth={2} strokeDasharray="3 4" />
      <path d="M32 66 H62" strokeWidth={2} strokeDasharray="3 4" />
      <path d="M70 44 L88 18" strokeWidth={6} />
      <path d="M68 47 L70 44" strokeWidth={3} />
    </g>
  )
}

/** Panel 2: the day's box, inked with a brush check. */
function Check() {
  return (
    <g {...INK}>
      <rect x={20} y={18} width={60} height={60} strokeWidth={4} className="fill-background" />
      <path d="M30 50 L45 66 L80 22" strokeWidth={10} />
      <path d="M12 86 L22 80 M88 86 L78 80 M50 94 V86" strokeWidth={3} />
    </g>
  )
}

/** Panel 3: a missed day: a cross in the box, drawn calmly. */
function Cross() {
  return (
    <g {...INK}>
      <rect x={20} y={18} width={60} height={60} strokeWidth={4} className="fill-background" />
      <path d="M34 32 L66 64 M66 32 L34 64" strokeWidth={6} />
    </g>
  )
}

/** Panel 4: seven boxes, all checked, under a burst: the week is a chapter. */
function Week() {
  const burst = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2
    const r = i % 2 ? 22 : 34
    return `${(50 + Math.cos(a) * r * 1.3).toFixed(1)},${(36 + Math.sin(a) * r).toFixed(1)}`
  }).join(" ")
  return (
    <g {...INK}>
      <polygon points={burst} strokeWidth={3} className="fill-background" />
      <path d="M38 36 L46 44 L62 26" strokeWidth={6} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={6 + i * 12.6} y={78} width={10} height={10} strokeWidth={2} className="fill-background" />
          <path d={`M${8 + i * 12.6} 83 L${10.5 + i * 12.6} 86 L${14.5 + i * 12.6} 80`} strokeWidth={2} />
        </g>
      ))}
    </g>
  )
}

/* ---------- Content ---------- */

const CHAPTERS = [
  { id: "how", no: "01", title: "How it works", vertical: "仕組み" },
  { id: "guide", no: "02", title: "Meet your guide", vertical: "案内" },
  { id: "readers", no: "03", title: "Readers say", vertical: "声" },
  { id: "begin", no: "04", title: "Your turn", vertical: "始まり" },
] as const
type ChapterId = (typeof CHAPTERS)[number]["id"]

const STRIP_LABELS: [string, string, string, string] = [
  "Panel 1: write one small goal on today's page.",
  "Panel 2: do it, and the day gets a brush check.",
  "Panel 3: miss a day; the page gets a cross and nobody shouts.",
  "Panel 4: a full week turns into a finished chapter.",
]
const STRIP_CAPTIONS = ["Pick one small goal.", "Do it. Check.", "Missed? A cross. Move on.", "Seven checks: a chapter!"]

const lines = (art: StoryLandingArt): DialogueLine[] => [
  { speaker: "Fude", portrait: art.guide, text: "Hi! I'm Fude. I keep your week the way a mangaka keeps a story: one page at a time." },
  { speaker: "Fude", portrait: art.guide, text: "Each day is a panel. Do your goal and I ink a check in it. Skip it and I draw a cross. No guilt, just the next panel." },
  { speaker: "You", portrait: art.reader, side: "end", text: "And when the week is over?" },
  { speaker: "Fude", portrait: art.guide, text: "Then it becomes a chapter, with a title you choose. Your habits end up as a little volume you can flip through." },
]

const QUOTES = [
  { text: "I stopped breaking streaks once a missed day was just a panel, not a failure.", name: "Mira, 6 chapters" },
  { text: "Naming my weeks like chapters is silly. It also works.", name: "Theo, 11 chapters" },
  { text: "My study log finally reads like a story I want to continue.", name: "Ana, 3 chapters" },
]

const stop = (e: React.MouseEvent) => e.preventDefault()

/* ---------- The interface ---------- */

export function StoryLanding({
  className,
  titleAs: TitleTag = "h1",
  art = {},
}: {
  className?: string
  /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */
  titleAs?: "h1" | "h2"
  /** The cover, the faces and the strip's pictures (image URLs). The block ships none. */
  art?: StoryLandingArt
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const uid = React.useId()
  const [started, setStarted] = React.useState(false)
  const { play, transition, playing } = useSceneTransition({ variant: "panels", caption: "Meanwhile…" })
  const begin = useSceneTransition({ variant: "ink", caption: "Chapter one begins" })

  /** A chapter is its section (focusable, tabIndex -1): the transition scrolls to it, then focus moves there. */
  const heading = (id: ChapterId) => rootRef.current?.querySelector<HTMLElement>(`section[aria-labelledby="${uid}-${id}"]`)

  const goTo = (id: ChapterId) => {
    void play(() => heading(id)?.scrollIntoView({ block: "start", behavior: "instant" })).then(() => heading(id)?.focus({ preventScroll: true }))
  }

  const start = () => {
    void begin.play(() => setStarted(true)).then(() => rootRef.current?.querySelector<HTMLElement>(`[id="${uid}-done"]`)?.focus())
  }

  return (
    <div ref={rootRef} data-manga="story-landing" className={cn("@container/story w-full bg-background text-foreground", className)}>
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b-[length:var(--mg-bw-panel)] border-border px-4 py-3 @md/story:px-6">
        <span aria-hidden className="grid size-9 shrink-0 place-items-center ink-fill font-sfx text-lg">
          ツ
        </span>
        <span className="font-letter text-xl leading-none tracking-wide uppercase">Tsugi</span>
        <Button size="sm" className="ms-auto max-sm:min-h-11" disabled={playing} onClick={() => goTo("begin")}>
          Start free
        </Button>
      </header>

      <div className="grid gap-14 px-4 py-6 @md/story:px-6 @md/story:py-10">
        {/* Opening: the magazine cover beside the pitch */}
        <section aria-labelledby={`${uid}-title`} className="grid items-center gap-8 @3xl/story:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] @3xl/story:gap-12">
          <MagazineCover
            title="Tsugi"
            tagline="Your week, one panel a day"
            issue="No. 1"
            date="This week"
            image={art.cover}
            lines={[
              { text: "New! Weeks become chapters", highlight: true },
              { text: "A guide who never nags" },
              { text: "Free to start", side: "end" },
              { text: "Missed a day? Turn the page", side: "end" },
            ]}
            headline="The habit that drew itself"
            className="mx-auto max-w-sm"
          />
          <div className="grid gap-5">
            <p className="font-mono text-xs">Issue 1 · a habit app for people who like stories</p>
            <TitleTag id={`${uid}-title`} className="font-letter text-5xl leading-[0.9] tracking-wide uppercase @md/story:text-6xl">
              Every day
              <br />
              is a panel.
            </TitleTag>
            <p className="max-w-prose text-lg">
              Tsugi turns one small goal a day into a story you keep reading: check the panel, finish the week, title the chapter. Seven
              panels at a time, no streak to lose.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-6 py-2 ps-3">
              <Button variant="shout" size="lg" disabled={playing} onClick={() => goTo("begin")}>
                Start chapter one
              </Button>
              <Button variant="outline" className="max-sm:min-h-11" disabled={playing} onClick={() => goTo("how")}>
                How it works
              </Button>
            </div>
            {/* Contents page, like the first page of a volume */}
            <nav aria-label="Chapters" className="border-ink bg-background">
              <p className="border-b-[length:var(--mg-bw)] border-border px-3 py-1.5 font-letter text-sm tracking-widest uppercase">Contents</p>
              <ol>
                {CHAPTERS.map((c) => (
                  <li key={c.id} className="border-b-[length:var(--mg-bw-fine)] border-border last:border-b-0">
                    <button
                      type="button"
                      disabled={playing}
                      onClick={() => goTo(c.id)}
                      className="flex min-h-11 w-full items-center gap-3 px-3 py-2 text-start hover-invert focus-ink focus-visible:outline-offset-[-5px]! active:bg-foreground active:text-background active:shadow-[inset_0_0_0_2px_var(--background)]"
                    >
                      <span className="w-8 font-sfx text-lg leading-none">{c.no}</span>
                      <span className="flex-1 font-letter text-lg tracking-wide uppercase">{c.title}</span>
                      <span aria-hidden className="mark-arrow rotate-180 text-sm" />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>

        {/* Chapter 1: the strip */}
        <section aria-labelledby={`${uid}-how`} tabIndex={-1} className="grid scroll-mt-4 gap-6 outline-none">
          <ChapterTitle titleId={`${uid}-how`} number="01" title="How it works" vertical="仕組み" subtitle="Four panels, one week, no lectures." className="border-ink-panel" />
          <Yonkoma orientation="auto" labels={STRIP_LABELS} className="mx-auto">
            {STRIP_CAPTIONS.map((caption, i) => (
              // a fragment: its Place elements sit on the page and may cross the frame
              <React.Fragment key={caption}>
                <Beat src={art.beats?.[i]} index={i} />
                <Place x={96} y={6} anchor="top-right" maxWidth={70}>
                  <PanelCaption aria-hidden position="free">
                    {caption}
                  </PanelCaption>
                </Place>
                {i === 3 && (
                  <Place x={14} y={58} rotate={-10}>
                    <Sfx size="sm">ドン</Sfx>
                  </Place>
                )}
              </React.Fragment>
            ))}
          </Yonkoma>
        </section>

        {/* Chapter 2: the guide speaks */}
        <section aria-labelledby={`${uid}-guide`} tabIndex={-1} className="grid scroll-mt-4 gap-6 outline-none">
          <ChapterTitle titleId={`${uid}-guide`} number="02" title="Meet your guide" vertical="案内" variant="ink" subtitle="Click the arrow to hear Fude out." />
          <DialogueBox lines={lines(art)} className="mx-auto max-w-2xl" />
        </section>

        {/* Chapter 3: readers, in bubbles */}
        <section aria-labelledby={`${uid}-readers`} tabIndex={-1} className="grid scroll-mt-4 gap-6 outline-none">
          <ChapterTitle titleId={`${uid}-readers`} number="03" title="Readers say" vertical="声" className="border-ink-panel" />
          <ul className="grid gap-6 @3xl/story:grid-cols-3">
            {QUOTES.map((q, i) => (
              <li key={q.name} className={cn("flex flex-col gap-1", i % 2 ? "items-end" : "items-start")}>
                <SpeechBubble tail="bottom" tailAlign={i % 2 ? "end" : "start"} seed={i + 3} className="max-w-full!">
                  {q.text}
                </SpeechBubble>
                <span className="px-2 font-letter text-sm tracking-wide uppercase">{q.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Chapter 4: the call to action, and what happens after it */}
        <section aria-labelledby={`${uid}-begin`} tabIndex={-1} className="grid scroll-mt-4 gap-6 outline-none">
          <ChapterTitle titleId={`${uid}-begin`} number="04" title="Your turn" vertical="始まり" variant="ink" />
          {started ? (
            <div id={`${uid}-done`} tabIndex={-1} className="relative grid justify-items-center gap-4 ink-case p-6 text-center outline-none">
              <Sfx size="lg" rotate={-6}>
                ドン
              </Sfx>
              <p className="font-letter text-3xl tracking-wide uppercase">Chapter one is open.</p>
              <p className="max-w-prose">Your first panel is waiting for today's goal. (This is a demo: nothing was sent.)</p>
              <Button variant="outline" onClick={() => setStarted(false)}>
                Back to the cover page
              </Button>
            </div>
          ) : (
            <div className="grid items-center gap-8 @3xl/story:grid-cols-[1fr_auto]">
              <div className="flex flex-col items-start gap-1">
                <SpeechBubble tail="bottom" tailAlign="start" className="max-w-xl! text-xl!">
                  Free for your first ten chapters. Then $3 a month, or keep the free volume forever.
                </SpeechBubble>
                <span className="px-2 font-letter text-sm tracking-wide uppercase">Fude</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-6 py-2 ps-3">
                <Button variant="shout" size="lg" disabled={begin.playing} onClick={start}>
                  Start free
                </Button>
                <a href="#" onClick={stop} className="inline-flex min-h-11 items-center font-letter uppercase hover-underline focus-ink">
                  Read the fine print
                </a>
              </div>
            </div>
          )}
        </section>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t-[length:var(--mg-bw-panel)] border-border px-4 py-4 text-sm @md/story:px-6">
        <span className="font-letter uppercase">To be continued…</span>
        <span>Tsugi is an invented app, drawn for this example.</span>
      </footer>

      {transition}
      {begin.transition}
    </div>
  )
}
