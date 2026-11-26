"use client"

/*
 * Portfolio — a developer's portfolio made only with mangacn: an opening spread of Panels (focus SpeedLines,
 * a TonedImage portrait, a SpeechBubble, Sfx), projects as a manga page of Cards (thumbnails passed in `art`, Badge tags,
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

/** Pictures: passed in `art`, none ships with the block. */
export type PortfolioArt = {
  /** The developer's portrait. A photo is toned as a screentone; set `inked` for a picture that is already inked. */
  portrait?: string
  inked?: boolean
  /** One thumbnail per project, by project id. Without one, a screentone box. */
  projects?: Partial<Record<string, string>>
}

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
  },
  {
    id: "ledger",
    title: "Panel Ledger",
    kind: "Offline reader",
    year: "2024",
    text: "Downloads chapters for the train and syncs your place once you are back online. Used by 40k readers a month.",
    tags: ["PWA", "IndexedDB", "React"],
  },
  {
    id: "tonelab",
    title: "Tone Lab",
    kind: "Browser tool",
    year: "2023",
    text: "Turns any picture into dots, lines or cross-hatching in the browser and exports it as a clean SVG.",
    tags: ["Canvas", "WebGL", "SVG"],
  },
  {
    id: "market",
    title: "Night Market",
    kind: "Festival app",
    year: "2022",
    text: "Map, timetable and live queue lengths for 300 stalls of a city festival, built in six weeks by a team of four, in three languages.",
    tags: ["Maps", "Next.js", "i18n"],
    wide: true,
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

export function Portfolio({
  className,
  titleAs: TitleTag = "h1",
  art = {},
}: {
  className?: string
  /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */
  titleAs?: "h1" | "h2"
  /** The portrait and the project thumbnails (image URLs). The block ships none. */
  art?: PortfolioArt
}) {
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
                {art.portrait && art.inked ? (
                  <img src={art.portrait} alt="Portrait of Noa Kirishima" className="size-full object-cover" />
                ) : art.portrait ? (
                  <TonedImage src={art.portrait} alt="Portrait of Noa Kirishima" density={5} contrast={1.2} className="size-full" />
                ) : (
                  <span aria-hidden className="grid size-full place-items-center font-letter text-6xl uppercase">
                    NK
                  </span>
                )}
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
                  <TitleTag className="font-letter text-5xl leading-[0.9] tracking-wide uppercase @md/main:text-6xl @5xl/main:text-7xl">
                    Noa
                    <br />
                    Kirishima
                  </TitleTag>
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
                      {art.projects?.[p.id] ? (
                        <img src={art.projects[p.id]} alt="" className="block aspect-video h-auto w-full object-cover" />
                      ) : (
                        <span aria-hidden className="block aspect-video w-full tone-35" />
                      )}
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
              image={art.portrait}
              toned={!art.inked}
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
