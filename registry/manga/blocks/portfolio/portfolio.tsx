"use client"

/*
 * Portfolio — a developer's portfolio made only with mangacn: an opening spread of Panels (focus SpeedLines,
 * a TonedImage portrait, a SpeechBubble, Sfx), projects as a manga page of Cards (drawn thumbnails, Badge tags,
 * a CodeBlock), skills as a CharacterCard, experience as a vertical Stepper, and a contact form (Field, Input,
 * Textarea, Button) that validates and shows a brush check when sent. No network: nothing is posted and links
 * do not navigate. One column on phones; container queries (`@container/main`) widen it.
 */
import * as React from "react"

import { Badge } from "@/components/ui/manga/badge"
import { Button, buttonClassName } from "@/components/ui/manga/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/manga/card"
import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from "@/components/ui/manga/code-block"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/manga/field"
import { Input } from "@/components/ui/manga/input"
import { Textarea } from "@/components/ui/manga/textarea"
import { CharacterCard } from "@/components/manga/character-card"
import { Panel } from "@/components/manga/panel"
import { Sfx } from "@/components/manga/sfx"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { SpeedLines } from "@/components/manga/speed-lines"
import { Stamp } from "@/components/manga/stamp"
import { Stepper } from "@/components/manga/stepper"
import { TonedImage } from "@/components/manga/toned-image"
import { cn } from "cn"

/** The developer, drawn in greys as a data URL: TonedImage turns it into a screentone (and its negative in dark mode). */
const PORTRAIT = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><radialGradient id="g" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#7d7d7d"/></radialGradient></defs><rect width="300" height="300" fill="url(#g)"/><path d="M36 300 C44 214 256 214 264 300Z" fill="#262626"/><path d="M118 232 L150 268 L182 232Z" fill="#a3a3a3"/><rect x="134" y="178" width="32" height="44" fill="#b3b3b3"/><ellipse cx="150" cy="138" rx="50" ry="58" fill="#cfcfcf"/><path d="M94 142 C84 64 216 64 206 142 C198 106 172 94 150 104 C126 92 102 108 94 142Z" fill="#111"/><path d="M150 102 L128 128 L146 118Z" fill="#111"/><rect x="110" y="130" width="32" height="24" fill="none" stroke="#111" stroke-width="5"/><rect x="158" y="130" width="32" height="24" fill="none" stroke="#111" stroke-width="5"/><path d="M142 140 H158" stroke="#111" stroke-width="4"/><path d="M136 178 Q150 188 164 178" fill="none" stroke="#333" stroke-width="4"/><path d="M100 218 C108 256 192 256 200 218" fill="none" stroke="#111" stroke-width="10"/><rect x="88" y="204" width="24" height="32" fill="#111"/><rect x="188" y="204" width="24" height="32" fill="#111"/></svg>`,
)}`

type Project = {
  id: string
  title: string
  kind: string
  year: string
  text: string
  tags: string[]
  wide?: boolean
  fresh?: boolean
  install?: string
  Art: (props: { className?: string }) => React.ReactElement
}

/* ---------- Thumbnails, drawn with the kit's ink and paper (they follow dark mode and the accent) ---------- */

function useTone() {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const defs = (
    <defs>
      <pattern id={`${id}-dots`} width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.3" className="fill-foreground" />
        <circle cx="4.5" cy="4.5" r="1.3" className="fill-foreground" />
      </pattern>
    </defs>
  )
  return [defs, `url(#${id}-dots)`] as const
}

function KitArt({ className }: { className?: string }) {
  const [defs, tone] = useTone()
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Reader parts: a button, a field, a switch and a page card" className={className}>
      {defs}
      <rect width="320" height="180" className="fill-background" />
      <rect x="0" y="0" width="84" height="180" fill={tone} />
      <rect x="84" y="0" width="3" height="180" className="fill-foreground" />
      <rect x="112" y="26" width="92" height="32" className="fill-foreground" />
      <rect x="126" y="38" width="64" height="8" className="fill-background" />
      <rect x="112" y="76" width="176" height="30" strokeWidth="3" className="fill-background stroke-foreground" />
      <rect x="122" y="88" width="70" height="6" className="fill-foreground" />
      <rect x="112" y="124" width="56" height="28" strokeWidth="3" className="fill-background stroke-foreground" />
      <rect x="144" y="130" width="18" height="16" className="fill-foreground" />
      <rect x="222" y="22" width="74" height="40" strokeWidth="3" className="fill-background stroke-foreground" />
      <rect x="228" y="28" width="28" height="28" fill={tone} />
      <rect x="190" y="124" width="98" height="28" strokeWidth="3" className="fill-background stroke-foreground" />
      <path d="M200 138 h60" strokeWidth="6" className="stroke-foreground" />
    </svg>
  )
}

function ReaderArt({ className }: { className?: string }) {
  const [defs, tone] = useTone()
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="A phone showing a vertical comic strip" className={className}>
      {defs}
      <rect width="320" height="180" className="fill-background" />
      {[30, 52, 74, 96, 118, 140].map((y, i) => (
        <path key={y} d={`M${i % 2 ? 24 : 40} ${y} H112 M208 ${y + 8} H${i % 2 ? 296 : 280}`} strokeWidth={i % 3 ? 2 : 4} className="stroke-foreground" />
      ))}
      <rect x="122" y="8" width="76" height="164" strokeWidth="4" className="fill-background stroke-foreground" />
      <rect x="130" y="18" width="60" height="44" strokeWidth="2" className="stroke-foreground" fill={tone} />
      <rect x="130" y="68" width="60" height="40" strokeWidth="2" className="fill-background stroke-foreground" />
      <circle cx="160" cy="92" r="10" className="fill-foreground" />
      <path d="M144 108 C146 96 174 96 176 108Z" className="fill-foreground" />
      <rect x="130" y="114" width="60" height="44" strokeWidth="2" className="fill-foreground stroke-foreground" />
      <path d="M138 150 L160 122 L182 150Z" className="fill-background" />
    </svg>
  )
}

function ToneArt({ className }: { className?: string }) {
  const cols = 16
  const rows = 8
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Halftone dots growing from small to large" className={className}>
      <rect width="320" height="180" className="fill-background" />
      {Array.from({ length: cols * rows }, (_, k) => {
        const i = k % cols
        const j = Math.floor(k / cols)
        return <circle key={k} cx={20 + i * 18.6} cy={18 + j * 16 + (i % 2 ? 8 : 0)} r={0.8 + i * 0.52} className="fill-foreground" />
      })}
      <rect x="20" y="156" width="280" height="14" strokeWidth="3" className="fill-background stroke-foreground" />
      <rect x="20" y="156" width="190" height="14" className="fill-foreground" />
      <rect x="204" y="150" width="14" height="26" strokeWidth="3" className="fill-background stroke-foreground" />
    </svg>
  )
}

function MapArt({ className }: { className?: string }) {
  const [defs, tone] = useTone()
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="A street map with lantern pins" className={className}>
      {defs}
      <rect width="320" height="180" className="fill-background" />
      <rect x="16" y="14" width="86" height="58" fill={tone} />
      <rect x="196" y="100" width="108" height="66" fill={tone} />
      <rect x="122" y="14" width="56" height="58" strokeWidth="2" className="fill-background stroke-foreground" />
      <path d="M0 86 H320 M110 0 V180 M186 0 V180 M0 150 C80 140 120 170 186 150" strokeWidth="8" className="fill-none stroke-foreground" />
      <path d="M0 86 H320 M110 0 V180 M186 0 V180 M0 150 C80 140 120 170 186 150" strokeWidth="3" className="fill-none stroke-background" />
      <path d="M60 120 L148 120 L148 40 L250 40" strokeWidth="5" className="fill-none stroke-foreground" />
      {[
        [60, 120],
        [148, 40],
        [250, 40],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x - 9} y={y - 13} width="18" height="22" strokeWidth="3" className="fill-background stroke-foreground" />
          <rect x={x - 5} y={y - 8} width="10" height="12" className="fill-foreground" />
        </g>
      ))}
    </svg>
  )
}

const PROJECTS: Project[] = [
  {
    id: "inkpot",
    title: "Inkpot",
    kind: "Open-source kit",
    year: "2026",
    text: "Headless reader parts for comics on the web: a vertical strip, a page turner and panel zoom, with full keyboard support and right-to-left reading order.",
    tags: ["React", "TypeScript", "A11y"],
    wide: true,
    fresh: true,
    install: "npm install @inkpot/reader",
    Art: KitArt,
  },
  {
    id: "ledger",
    title: "Panel Ledger",
    kind: "Offline reader",
    year: "2024",
    text: "Downloads chapters for the train and syncs your place once you are back online. Used by 40k readers a month.",
    tags: ["PWA", "IndexedDB", "React"],
    Art: ReaderArt,
  },
  {
    id: "tonelab",
    title: "Tone Lab",
    kind: "Browser tool",
    year: "2023",
    text: "Turns any picture into dots, lines or cross-hatching in the browser and exports it as a clean SVG.",
    tags: ["Canvas", "WebGL", "SVG"],
    Art: ToneArt,
  },
  {
    id: "market",
    title: "Night Market",
    kind: "Festival app",
    year: "2022",
    text: "Map, timetable and live queue lengths for 300 stalls of a city festival, built in six weeks by a team of four, in three languages.",
    tags: ["Maps", "Next.js", "i18n"],
    wide: true,
    Art: MapArt,
  },
]

const STATS = [
  { label: "TypeScript", value: 92 },
  { label: "React", value: 90 },
  { label: "CSS", value: 88 },
  { label: "Accessibility", value: 86 },
  { label: "Testing", value: 72 },
  { label: "Node.js", value: 64 },
]

const CAREER = [
  { label: "Intern · Paper Crane", description: "2017. Put a print magazine's archive on the web: 30 years of issues, searchable." },
  { label: "Frontend dev · Lantern Games", description: "2019. Store pages and a design system shared by twelve teams." },
  { label: "Senior frontend · Kumo Books", description: "2022. Led the reader rewrite: first page in 1 s instead of 4 s." },
  { label: "Staff engineer · Freelance", description: "2025 — now. Design systems and accessible readers for small publishers." },
]

const FOOTER_LINKS = ["Source code", "Journal", "Résumé", "RSS"]

/* ---------- Small parts ---------- */

/** A link that does not navigate: it remembers it was opened (a brush check) instead. */
function DemoLink({ opened, onOpen, className, children }: { opened: boolean; onOpen: () => void; className?: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        onOpen()
      }}
      className={className}
    >
      {children}
      {opened && (
        <>
          <span aria-hidden className="mark-check" />
          <span className="sr-only">(opened)</span>
        </>
      )}
    </a>
  )
}

function Heading({ no, id, children }: { no: string; id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} tabIndex={-1} className="flex items-center gap-3 font-letter text-3xl leading-none uppercase outline-none @md/main:text-4xl">
      <span aria-hidden className="ink-fill px-2 py-1 font-sfx text-base leading-none">
        {no}
      </span>
      {children}
    </h2>
  )
}

/** True once the block is at least 48rem wide (same step as the `@3xl/main` queries): the opening panels get their slant. */
function useWide<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [wide, setWide] = React.useState(false)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWide(el.clientWidth >= 768)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, wide] as const
}

type Form = { name: string; email: string; message: string }
type Errors = Partial<Record<keyof Form, string>>

function validate(f: Form): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = "Tell me who you are."
  if (!f.email.trim()) e.email = "I need an address to answer you."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "That address is missing a part (name@site.com)."
  const n = f.message.trim().length
  if (n < 20) e.message = `A few more words, please (${n}/20).`
  return e
}

const EMPTY: Form = { name: "", email: "", message: "" }
const touch = "max-sm:min-h-11"

/* ---------- The interface ---------- */

export function Portfolio({ className }: { className?: string }) {
  const [rootRef, wide] = useWide<HTMLDivElement>()
  const [opened, setOpened] = React.useState<Set<string>>(() => new Set())
  const [form, setForm] = React.useState<Form>(EMPTY)
  const [tried, setTried] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const [sent, setSent] = React.useState<Form | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const formRef = React.useRef<HTMLFormElement>(null)
  const doneRef = React.useRef<HTMLDivElement>(null)
  const uid = React.useId()
  const errors = tried ? validate(form) : {}

  React.useEffect(() => () => clearTimeout(timer.current), [])
  React.useEffect(() => {
    if (sent) doneRef.current?.focus()
  }, [sent])

  const open = (key: string) => setOpened((s) => new Set(s).add(key))

  const goTo = (id: string) => {
    const el = rootRef.current?.querySelector<HTMLElement>(`[id="${uid}-${id}"]`)
    if (!el) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" })
    el.focus({ preventScroll: true })
  }

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    setTried(true)
    const found = validate(form)
    if (Object.keys(found).length) {
      // wait for the error attributes, then put the caret in the first field to fix
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }
    setSending(true)
    timer.current = setTimeout(() => {
      setSending(false)
      setSent(form)
      setForm(EMPTY)
      setTried(false)
    }, 900)
  }

  const nav = [
    ["projects", "Projects"],
    ["skills", "Skills"],
    ["career", "Career"],
    ["contact", "Contact"],
  ] as const

  return (
    <div ref={rootRef} data-manga="portfolio" className={cn("@container/main w-full bg-background text-foreground", className)}>
      {/* Top bar */}
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-[length:var(--mg-bw-panel)] border-border px-4 py-3 @md/main:px-6">
        <span className="flex items-center gap-2">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center ink-fill font-sfx text-sm">
            ノア
          </span>
          <span className="font-letter text-xl leading-none tracking-wide uppercase">noa.dev</span>
        </span>
        {/* phones: the logo on its line, the four sections on the next one */}
        <nav aria-label="Sections" className="w-full @xl/main:ms-auto @xl/main:w-auto">
          <ul className="grid grid-cols-2 gap-1 @md/main:flex @md/main:justify-between @xl/main:justify-end">
            {nav.map(([id, label]) => (
              <li key={id}>
                <Button variant="ghost" size="sm" fullWidth className={touch} onClick={() => goTo(id)}>
                  {label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="grid gap-14 px-4 py-6 @md/main:px-6 @md/main:py-8">
        {/* Opening spread: two panels, slanted gutter from 48rem up; they follow the reading order. */}
        <section
          aria-label="Introduction"
          className="grid gap-2.5 [direction:ltr] reading-rtl:[direction:rtl] *:[direction:ltr] @3xl/main:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
        >
          <Panel cut={wide ? { side: "end", size: 40 } : undefined} className="min-h-0">
            <SpeedLines variant="focus" originX={50} originY={66} hole={0.5} density={0.5} className="absolute inset-0" />
            <div className="relative flex h-full flex-col items-center gap-2 p-5 @3xl/main:px-12">
              <SpeechBubble tail="bottom" tailAlign="end" className="max-w-[17rem] self-start px-5 py-3 text-base">
                Hi! I&apos;m Noa. I build interfaces that read like a good page.
              </SpeechBubble>
              <div className="relative size-44 border-ink-panel bg-background @md/main:size-52">
                <TonedImage src={PORTRAIT} alt="Portrait of Noa Kirishima, glasses and headphones" density={5} contrast={1.2} className="size-full" />
              </div>
            </div>
          </Panel>

          <Panel cut={wide ? { side: "start", size: 40 } : undefined} className="min-h-0">
            <div className="flex h-full flex-col">
              <div className="grid flex-1 content-between gap-6 p-5 @3xl/main:p-8 @3xl/main:px-16">
                <div className="flex items-start justify-between gap-3">
                  <p className="pt-1 font-mono text-xs">File 01 · Osaka, works remote</p>
                  <Sfx size="md" rotate={-10} className="me-1">
                    ドン!
                  </Sfx>
                </div>
                <div className="grid gap-3">
                  <h1 className="font-letter text-5xl leading-[0.9] tracking-wide uppercase @md/main:text-6xl @5xl/main:text-7xl">
                    Noa
                    <br />
                    Kirishima
                  </h1>
                  <p className="font-letter text-xl tracking-wide uppercase">Frontend engineer</p>
                  <p className="max-w-prose">
                    I draw interfaces like manga pages: clear panels, strong lines, and nothing between the reader and the story.
                    Eight years of React, design systems and readers that work with a keyboard.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button className={touch} onClick={() => goTo("projects")}>
                    See projects
                  </Button>
                  <Button variant="outline" className={touch} onClick={() => goTo("contact")}>
                    Say hello
                  </Button>
                </div>
              </div>
              {/* a band of motion lines on the bottom edge: decoration only, no text on it */}
              <SpeedLines variant="motion" density={0.9} seed={5} className="h-10 shrink-0 border-t-[length:var(--mg-bw)] border-border" />
            </div>
          </Panel>
        </section>

        {/* Projects: a page of panels — wide, two, wide. */}
        <section aria-labelledby={`${uid}-projects`} className="grid gap-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <Heading no="02" id={`${uid}-projects`}>
              Projects
            </Heading>
            <p className="text-sm">{PROJECTS.length} selected works, newest first</p>
          </div>
          <ul className="grid gap-6 @xl/main:grid-cols-2">
            {PROJECTS.map((p) => (
              <li key={p.id} className={cn("grid", p.wide && "@xl/main:col-span-2")}>
                <Card className="min-w-0">
                  <CardHeader>
                    <CardTitle>{p.title}</CardTitle>
                    <CardDescription>
                      {p.kind} · {p.year}
                    </CardDescription>
                    {p.fresh && (
                      <CardAction>
                        <Badge variant="burst" className="me-2">
                          New
                        </Badge>
                      </CardAction>
                    )}
                  </CardHeader>
                  <CardContent className={cn("grid gap-4", p.wide && "@3xl/main:grid-cols-2 @3xl/main:items-start @3xl/main:gap-6")}>
                    <div className="overflow-hidden border-ink">
                      <p.Art className="block h-auto w-full" />
                    </div>
                    <div className="grid min-w-0 gap-4">
                      <p>{p.text}</p>
                      <ul aria-label="Built with" className="flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <li key={t}>
                            <Badge variant="outline">{t}</Badge>
                          </li>
                        ))}
                      </ul>
                      {p.install && (
                        <CodeBlock>
                          <CodeBlockHeader>
                            <CodeBlockTitle>Install</CodeBlockTitle>
                            <CodeBlockActions>
                              <CodeBlockCopyButton value={p.install} />
                            </CodeBlockActions>
                          </CodeBlockHeader>
                          <CodeBlockContent>{p.install}</CodeBlockContent>
                        </CodeBlock>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex-wrap">
                    {(["Live demo", "Source"] as const).map((label) => (
                      <DemoLink
                        key={label}
                        opened={opened.has(`${p.id}-${label}`)}
                        onOpen={() => open(`${p.id}-${label}`)}
                        className={cn(
                          buttonClassName({ variant: label === "Live demo" ? "default" : "outline", size: "sm" }),
                          "inline-flex items-center justify-center whitespace-nowrap",
                          touch,
                        )}
                      >
                        {label}
                        <span className="sr-only"> of {p.title}</span>
                      </DemoLink>
                    ))}
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills as a character sheet, career as chapter marks. */}
        <div className="grid gap-12 @3xl/main:grid-cols-[18rem_minmax(0,1fr)] @3xl/main:gap-10">
          <section aria-labelledby={`${uid}-skills`} className="grid content-start gap-5">
            <Heading no="03" id={`${uid}-skills`}>
              Skills
            </Heading>
            <CharacterCard
              name="Noa Kirishima"
              role="Frontend engineer · Lv. 8"
              image={PORTRAIT}
              stats={STATS}
              tags={["Design systems", "Motion", "i18n"]}
              quote="Ship it, then make it read better."
            />
          </section>

          <section aria-labelledby={`${uid}-career`} className="grid content-start gap-5">
            <Heading no="04" id={`${uid}-career`}>
              Career
            </Heading>
            <Stepper orientation="vertical" steps={CAREER} current={CAREER.length - 1} aria-label="Career, oldest first" />
            <div className="grid gap-2 border-t-[length:var(--mg-bw-fine)] border-border pt-4">
              <p className="font-letter text-base tracking-wide uppercase">Also speaks</p>
              <ul className="flex flex-wrap gap-1.5">
                {["English", "Japanese", "French"].map((l) => (
                  <li key={l}>
                    <Badge variant="tone">{l}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Contact */}
        <section aria-labelledby={`${uid}-contact`} className="grid gap-5">
          <Heading no="05" id={`${uid}-contact`}>
            Contact
          </Heading>
          <div className="grid gap-8 @3xl/main:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] @3xl/main:items-start">
            <div className="grid content-start gap-4">
              <p className="font-letter text-2xl leading-tight tracking-wide uppercase">Got a story to tell? Let&apos;s draw the interface.</p>
              <p>Freelance from January: design systems, readers, accessibility audits. I answer within two working days.</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="font-letter tracking-wide uppercase">Mail</dt>
                <dd className="[overflow-wrap:anywhere]">hello@noa.dev</dd>
                <dt className="font-letter tracking-wide uppercase">Time zone</dt>
                <dd>Osaka (UTC+9)</dd>
              </dl>
              <div className="p-2">
                <Stamp tone="ink" rotate={-4} animated={false} className="px-3 py-1.5 text-sm">
                  Open for work
                </Stamp>
              </div>
            </div>

            <div aria-live="polite" className="p-0.5 pe-2 pb-2">
              {sent ? (
                <div ref={doneRef} tabIndex={-1} className="relative grid animate-pop gap-4 p-5 ink-case focus-ink">
                  <p className="flex items-center gap-3 font-letter text-2xl leading-none tracking-wide uppercase">
                    <span aria-hidden className="mark-check text-3xl" />
                    Message sent!
                  </p>
                  <p>
                    Thanks, {sent.name.trim()}. Noa will answer at <span className="[overflow-wrap:anywhere]">{sent.email.trim()}</span> within two days.
                  </p>
                  <div>
                    <Button variant="outline" className={touch} onClick={() => setSent(null)}>
                      Write another
                    </Button>
                  </div>
                </div>
              ) : (
                <form ref={formRef} noValidate onSubmit={submit} aria-label="Contact Noa" className="relative ink-case p-5">
                  <FieldGroup>
                    <Field data-invalid={errors.name ? "true" : undefined}>
                      <FieldLabel htmlFor={`${uid}-name`}>Name</FieldLabel>
                      <Input
                        id={`${uid}-name`}
                        autoComplete="name"
                        value={form.name}
                        onChange={set("name")}
                        aria-invalid={errors.name ? true : undefined}
                        className="max-sm:h-11"
                      />
                      {errors.name && <FieldError>{errors.name}</FieldError>}
                    </Field>
                    <Field data-invalid={errors.email ? "true" : undefined}>
                      <FieldLabel htmlFor={`${uid}-email`}>Email</FieldLabel>
                      <Input
                        id={`${uid}-email`}
                        type="email"
                        autoComplete="email"
                        placeholder="you@studio.com"
                        value={form.email}
                        onChange={set("email")}
                        aria-invalid={errors.email ? true : undefined}
                        className="max-sm:h-11"
                      />
                      {errors.email && <FieldError>{errors.email}</FieldError>}
                    </Field>
                    <Field data-invalid={errors.message ? "true" : undefined}>
                      <FieldLabel htmlFor={`${uid}-message`}>Message</FieldLabel>
                      <Textarea
                        id={`${uid}-message`}
                        rows={5}
                        placeholder="What are we making?"
                        value={form.message}
                        onChange={set("message")}
                        aria-invalid={errors.message ? true : undefined}
                      />
                      {errors.message ? (
                        <FieldError>{errors.message}</FieldError>
                      ) : (
                        <FieldDescription>Twenty characters at least. Nothing leaves this page.</FieldDescription>
                      )}
                    </Field>
                    <div>
                      <Button type="submit" loading={sending} className={touch}>
                        {sending ? "Sending…" : "Send message"}
                      </Button>
                    </div>
                  </FieldGroup>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t-[length:var(--mg-bw-panel)] border-border px-4 py-5 @md/main:px-6">
        <p className="text-sm">© 2026 Noa Kirishima · drawn with mangacn</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 @3xl/main:ms-auto">
          {FOOTER_LINKS.map((label) => (
            <li key={label}>
              <DemoLink
                opened={opened.has(`footer-${label}`)}
                onOpen={() => open(`footer-${label}`)}
                className={cn("inline-flex items-center justify-center gap-1.5 font-letter text-sm tracking-wide uppercase hover-underline focus-ink max-sm:min-w-11", touch)}
              >
                {label}
              </DemoLink>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}
