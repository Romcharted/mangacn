"use client"

/*
 * Story landing: a product page told as a short manga, for an invented habit app (Tsugi). It opens on a
 * magazine cover, lists its chapters like the contents page of a volume, explains the product in a
 * four-panel strip, lets a guide talk the reader through it in a dialogue box, and titles every section as a
 * chapter. Jumping to a chapter plays a stepped scene transition (instant with reduced motion), then moves
 * focus to the chapter's heading. The strip is a Yonkoma on the page model: captions and the sound effect
 * are `Place`d on its panels, sized with the page. Nothing is posted; links never navigate.
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

/* ---------- Art, drawn for this block (ink = currentColor, paper = the background) ---------- */

const paper = "var(--background)"

function CoverArt() {
  const rays = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2
    const b = a + 0.09
    return `M100 128L${(100 + Math.cos(a) * 260).toFixed(1)} ${(128 + Math.sin(a) * 260).toFixed(1)}L${(100 + Math.cos(b) * 260).toFixed(1)} ${(128 + Math.sin(b) * 260).toFixed(1)}Z`
  }).join("")
  return (
    <svg aria-hidden viewBox="0 0 200 266" preserveAspectRatio="xMidYMid slice" className="size-full">
      <rect width="200" height="266" fill={paper} />
      <path d={rays} fill="currentColor" />
      <circle cx="100" cy="128" r="46" fill={paper} stroke="currentColor" strokeWidth="5" />
      {/* a figure holding a calendar page up, stamped */}
      <path d="M60 266c6-40 20-58 40-58s34 18 40 58z" fill="currentColor" />
      <circle cx="100" cy="190" r="20" fill="currentColor" />
      <rect x="74" y="96" width="52" height="58" fill={paper} stroke="currentColor" strokeWidth="4" />
      <path d="M74 110h52" stroke="currentColor" strokeWidth="4" />
      <path d="M86 132l10 10 18-22" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
      <path d="M78 154l-8 22M122 154l8 22" stroke="currentColor" strokeWidth="6" />
    </svg>
  )
}

function Guide() {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="size-full">
      <rect width="100" height="100" fill={paper} />
      <path d="M14 100c4-18 18-26 36-26s32 8 36 26z" fill="currentColor" />
      <ellipse cx="50" cy="50" rx="24" ry="27" fill={paper} stroke="currentColor" strokeWidth="3.5" />
      <path d="M24 52c-4-26 10-38 26-38s32 10 28 38c-4-10-6-16-10-18-10 6-26 6-40 0-2 4-3 10-4 18z" fill="currentColor" />
      <path d="M70 20 84 8M74 26l14-4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="41" cy="55" r="3" fill="currentColor" />
      <circle cx="59" cy="55" r="3" fill="currentColor" />
      <path d="M43 67c4 4 10 4 14 0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function Reader() {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="size-full">
      <rect width="100" height="100" fill="currentColor" />
      <path d="M18 100c4-16 16-24 32-24s28 8 32 24z" fill={paper} />
      <ellipse cx="50" cy="54" rx="22" ry="25" fill={paper} />
      <path d="M28 52c-2-22 8-32 22-32s26 10 22 32c-6-8-14-12-22-12s-16 4-22 12z" fill="currentColor" stroke={paper} strokeWidth="2.5" />
      <ellipse cx="42" cy="58" rx="3.5" ry="5" fill="currentColor" />
      <ellipse cx="58" cy="58" rx="3.5" ry="5" fill="currentColor" />
      <path d="M46 70h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** One beat of the four-panel strip. */
function Beat({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <svg aria-hidden viewBox="0 0 160 120" preserveAspectRatio="xMidYMax meet" className="absolute inset-x-0 bottom-0 mx-auto h-[82%] w-full">
      {/* a desk and a calendar page, the same in every panel */}
      <path d="M0 108h160" stroke="currentColor" strokeWidth="4" />
      <rect x="54" y="40" width="52" height="60" fill={paper} stroke="currentColor" strokeWidth="3.5" />
      <path d="M54 54h52" stroke="currentColor" strokeWidth="3.5" />
      {step === 1 && <path d="M66 72h28M66 84h18" stroke="currentColor" strokeWidth="4" />}
      {step === 2 && <path d="M66 76l8 8 16-18" fill="none" stroke="currentColor" strokeWidth="6" />}
      {step === 3 && (
        <>
          <path d="M68 66l24 24M92 66 68 90" stroke="currentColor" strokeWidth="5" />
          <path d="M126 34c4 8 8 10 8 15a8 8 0 0 1-16 0c0-5 4-7 8-15z" fill={paper} stroke="currentColor" strokeWidth="3" />
        </>
      )}
      {step === 4 && (
        <>
          <rect x="62" y="62" width="36" height="30" fill="currentColor" />
          <path d="M70 78l7 7 13-14" fill="none" stroke={paper} strokeWidth="5" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const a = (i / 8) * Math.PI * 2
            return <path key={i} d={`M${80 + Math.cos(a) * 44} ${70 + Math.sin(a) * 44}L${80 + Math.cos(a) * 58} ${70 + Math.sin(a) * 58}`} stroke="currentColor" strokeWidth="4" />
          })}
        </>
      )}
    </svg>
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

const LINES: DialogueLine[] = [
  { speaker: "Fude", portrait: <Guide />, text: "Hi! I'm Fude. I keep your week the way a mangaka keeps a story: one page at a time." },
  { speaker: "Fude", portrait: <Guide />, text: "Each day is a panel. Do your goal and I ink a check in it. Skip it and I draw a cross. No guilt, just the next panel." },
  { speaker: "You", portrait: <Reader />, side: "end", text: "And when the week is over?" },
  { speaker: "Fude", portrait: <Guide />, text: "Then it becomes a chapter, with a title you choose. Your habits end up as a little volume you can flip through." },
]

const QUOTES = [
  { text: "I stopped breaking streaks once a missed day was just a panel, not a failure.", name: "Mira, 6 chapters" },
  { text: "Naming my weeks like chapters is silly. It also works.", name: "Theo, 11 chapters" },
  { text: "My study log finally reads like a story I want to continue.", name: "Ana, 3 chapters" },
]

const stop = (e: React.MouseEvent) => e.preventDefault()

/* ---------- The interface ---------- */

export function StoryLanding({ className }: { className?: string }) {
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
            image={<CoverArt />}
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
            <h1 id={`${uid}-title`} className="font-letter text-5xl leading-[0.9] tracking-wide uppercase @md/story:text-6xl">
              Every day
              <br />
              is a panel.
            </h1>
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
                <Beat step={(i + 1) as 1 | 2 | 3 | 4} />
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
          <DialogueBox lines={LINES} className="mx-auto max-w-2xl" />
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
