"use client"

/*
 * Landing page — a product page for an invented manga app, made only with mangacn: an opening splash page of
 * Panels on a PanelGrid (lettering headline, focus SpeedLines and an accent Burst around the art, never under
 * text, two Buttons), features in cases, pricing as a VersusPanel (Free vs Pro, Pro highlighted, monthly or
 * yearly), reviews in SpeechBubbles with Avatars, a FAQ in the Accordion and a footer with links and a newsletter
 * InputGroup that validates. The top nav folds into a Sheet below 42rem of container width. Nothing navigates
 * and nothing is posted. One column on phones; container queries (`@container/main`) widen it.
 */
import * as React from "react"
import { BookOpen, CalendarClock, HandCoins, Languages, Menu, MessageSquareText, PenTool } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/manga/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/manga/avatar"
import { Button } from "@/components/ui/manga/button"
import { ButtonGroup } from "@/components/ui/manga/button-group"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/manga/field"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/manga/input-group"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/manga/sheet"
import { Burst } from "@/components/manga/burst"
import { Panel, PanelCaption, PanelGrid } from "@/components/manga/panel"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { SpeedLines } from "@/components/manga/speed-lines"
import { VersusPanel, VersusSide } from "@/components/manga/versus-panel"
import { cn } from "cn"

/* ---------- Content ---------- */

const SECTIONS = [
  ["features", "Features"],
  ["pricing", "Pricing"],
  ["reviews", "Reviews"],
  ["faq", "FAQ"],
] as const
type SectionId = (typeof SECTIONS)[number][0]

const FEATURES = [
  { icon: PenTool, title: "Letter in the browser", text: "Speech bubbles, SFX and screentones that snap to your panels. No plug-in, no export round trip." },
  { icon: CalendarClock, title: "Schedule chapters", text: "Queue a whole season and let Friday at noon take care of itself, in every reader's time zone." },
  { icon: BookOpen, title: "A reader made for manga", text: "Right-to-left pages, double spreads that never break and a vertical strip mode for phones." },
  { icon: MessageSquareText, title: "Readers in the margins", text: "Comments pin to a panel and wait beside the page, never on top of the art." },
  { icon: HandCoins, title: "Fair payouts", text: "Sell volumes and early chapters. Up to 90% of every sale goes to the creator, paid monthly." },
  { icon: Languages, title: "Translation teams", text: "Invite translators and letterers; each language keeps its own lettering layer." },
]

type Billing = "monthly" | "yearly"
const PLANS = {
  free: {
    name: "Free",
    price: { monthly: "$0", yearly: "$0" },
    blurb: "For a first series and a few loyal readers.",
    perks: ["Up to 3 series", "Basic lettering kit", "Reader comments", "80% of each sale"],
  },
  pro: {
    name: "Pro",
    price: { monthly: "$9", yearly: "$90" },
    blurb: "For weekly series, teams and print runs.",
    perks: ["Unlimited series", "Full lettering and SFX kit", "Scheduled releases", "Translation teams", "90% of each sale"],
  },
}

const REVIEWS = [
  { quote: "I went from photocopied zines to four thousand weekly readers in one summer.", name: "Aiko Mori", role: "Author of Salt & Static", initials: "AM" },
  { quote: "At last I can put the SFX where they belong: around the art, not on it.", name: "Tomás Reyes", role: "Letterer, 3 series", initials: "TR" },
  { quote: "Right to left by default, spreads that don't break. My readers noticed on day one.", name: "Jun Park", role: "Creator of Moth Lantern", initials: "JP" },
]

// Radix's Accordion requires `type`; Base UI's ignores it (it stays a harmless attribute). Spread from a
// loosely typed object so the same file compiles and works with both versions of shadcn.
const FAQ_MODE = { type: "multiple" } as unknown as React.ComponentProps<typeof Accordion>

const FAQ = [
  { q: "Is Panelhouse really free?", a: "Yes. The Free plan has no time limit: three series, the basic lettering kit and reader comments. Pro adds the rest when you need it." },
  { q: "Who owns my work?", a: "You do, always. Panelhouse only gets the right to show your pages to the readers you publish them for, and you can take everything back in one click." },
  { q: "Can readers read right to left?", a: "Right to left is the default for manga. Each series can switch to left to right or to a vertical strip, and readers can change it for themselves." },
  { q: "Can I export my pages for print?", a: "Pro exports print-ready files with bleed, in black and white or in grey tones, one file per volume." },
  { q: "How do payouts work?", a: "Sales add up during the month and are paid on the 5th of the next one, once you pass $20. Free keeps 80% for you, Pro keeps 90%." },
]

const FOOTER = [
  { title: "Product", links: ["Features", "Pricing", "Changelog"] },
  { title: "Studio", links: ["About", "Press kit", "Careers"] },
  { title: "Help", links: ["FAQ", "Contact", "Status"] },
]

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const touch = "max-sm:min-h-11"
const stop = (e: React.MouseEvent) => e.preventDefault()

/* ---------- Pieces ---------- */

/** True once the block is at least 48rem wide (the `@3xl/main` step): the splash page gets three columns and its slant. */
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

function Heading({ no, id, children }: { no: string; id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} tabIndex={-1} className="flex items-center gap-3 font-letter text-3xl leading-none tracking-wide uppercase outline-none @md/main:text-4xl">
      <span aria-hidden className="ink-fill px-2 py-1 font-sfx text-base leading-none">
        {no}
      </span>
      {children}
    </h2>
  )
}

/** An open book of panels with a pen above it: the splash art, drawn for this block. Paper fill knocks out the lines behind. */
function BookArt({ className }: { className?: string }) {
  const ink = "var(--foreground)"
  const paper = "var(--background)"
  return (
    <svg aria-hidden viewBox="0 0 200 150" className={className}>
      <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
        {/* cover */}
        <path d="M14 126 C48 116 80 116 100 130 C120 116 152 116 186 126 L186 134 C152 124 120 124 100 140 C80 124 48 124 14 134 Z" fill={ink} />
        {/* pages */}
        <path d="M100 46 C80 34 48 34 20 42 L20 124 C48 114 80 114 100 128 Z" fill={paper} />
        <path d="M100 46 C120 34 152 34 180 42 L180 124 C152 114 120 114 100 128 Z" fill={paper} />
      </g>
      <g stroke={ink} strokeWidth="2" fill={paper}>
        {/* panels on the left page */}
        <rect x="30" y="48" width="28" height="30" />
        <rect x="62" y="46" width="30" height="32" />
        <rect x="30" y="82" width="62" height="30" />
        {/* panels on the right page */}
        <rect x="108" y="46" width="62" height="28" />
        <rect x="108" y="78" width="28" height="34" />
        <rect x="140" y="78" width="30" height="34" />
        {/* a bubble and a figure */}
        <ellipse cx="124" cy="58" rx="10" ry="6" />
        <circle cx="76" cy="58" r="6" fill={ink} />
        <path d="M68 78 C68 68 84 68 84 78" fill={ink} />
        <path d="M36 104 L50 90 L64 104 L78 90 L86 104" fill="none" />
      </g>
      {/* the pen, nib down */}
      <g stroke={ink} strokeWidth="3" strokeLinejoin="round">
        <path d="M150 8 L170 28 L152 36 L142 26 Z" fill={ink} />
        <path d="M142 26 L134 40 L148 34" fill={paper} />
        <path d="M148 18 L160 30" stroke={paper} strokeWidth="2" />
      </g>
    </svg>
  )
}

/* ---------- The interface ---------- */

export function LandingPage({ className, titleAs: TitleTag = "h1" }: { className?: string; /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */ titleAs?: "h1" | "h2" }) {
  const [rootRef, wide] = useWide<HTMLDivElement>()
  const uid = React.useId()
  const [menu, setMenu] = React.useState(false)
  const [billing, setBilling] = React.useState<Billing>("yearly")
  const [picked, setPicked] = React.useState<{ plan: "free" | "pro"; billing: Billing } | null>(null)
  const [email, setEmail] = React.useState("")
  const [tried, setTried] = React.useState(false)
  const [subscribed, setSubscribed] = React.useState<string | null>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const goTo = (id: SectionId) => {
    const el = rootRef.current?.querySelector<HTMLElement>(`[id="${uid}-${id}"]`)
    if (!el) return
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" })
    el.focus({ preventScroll: true })
  }

  // From the sheet: close it first, then move once it has handed focus back to the menu button.
  const goFromMenu = (id: SectionId) => {
    setMenu(false)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => goTo(id), 350)
  }

  const emailError = tried && !EMAIL.test(email.trim()) ? (email.trim() ? "That address is missing a part (name@site.com)." : "Add your email address first.") : null

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!EMAIL.test(email.trim())) return
    setSubscribed(email.trim())
    setEmail("")
    setTried(false)
  }

  const priceSuffix = (free: boolean) => (free ? "forever" : billing === "monthly" ? "/ month" : "/ year")

  return (
    <div ref={rootRef} data-manga="landing-page" className={cn("@container/main w-full bg-background text-foreground", className)}>
      {/* Top nav: links from 42rem of container width, a menu button and a Sheet below. */}
      <header className="flex items-center gap-3 border-b-[length:var(--mg-bw-panel)] border-border px-4 py-3 @md/main:px-6">
        <span className="flex items-center gap-2">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center ink-fill font-sfx text-sm">
            コマ
          </span>
          <span className="font-letter text-xl leading-none tracking-wide uppercase">Panelhouse</span>
        </span>
        <nav aria-label="Main" className="ms-auto hidden items-center gap-1 @2xl/main:flex">
          <ul className="flex items-center gap-1">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <Button variant="ghost" size="sm" onClick={() => goTo(id)}>
                  {label}
                </Button>
              </li>
            ))}
          </ul>
          <Button size="sm" className="ms-2" onClick={() => goTo("pricing")}>
            Start free
          </Button>
        </nav>
        <Button
          variant="outline"
          size="icon"
          aria-label="Open the menu"
          aria-haspopup="dialog"
          aria-expanded={menu}
          onClick={() => setMenu(true)}
          className="ms-auto max-sm:size-11 @2xl/main:hidden"
        >
          <Menu />
        </Button>
      </header>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Panelhouse</SheetTitle>
            <SheetDescription>Jump to a part of the page.</SheetDescription>
          </SheetHeader>
          <nav aria-label="Menu" className="px-4">
            <ul className="grid gap-2">
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <Button variant="ghost" fullWidth className="min-h-11 justify-start" onClick={() => goFromMenu(id)}>
                    {label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-4 pt-4">
            <Button fullWidth className="min-h-11" onClick={() => goFromMenu("pricing")}>
              Start free
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="grid gap-16 px-4 py-6 @md/main:px-6 @md/main:py-8">
        {/* Splash page: headline panel, art panel (slanted gutter from 48rem), then an ink band of figures. */}
        <section aria-labelledby={`${uid}-title`}>
          <PanelGrid cols={wide ? 3 : 1} gap="0.625rem" className="-m-3">
            <Panel colSpan={wide ? 2 : undefined} cut={wide ? { side: "end", size: 48 } : undefined} className="min-h-0">
              <div className="flex h-full flex-col">
                <div className={cn("grid flex-1 content-center gap-5 p-5 @md/main:p-8", wide && "pe-20")}>
                  <p className="font-mono text-xs">Chapter 1 · open beta</p>
                  <TitleTag id={`${uid}-title`} className="font-letter text-5xl leading-[0.9] tracking-wide uppercase @md/main:text-6xl @5xl/main:text-7xl">
                    Draw it.
                    <br />
                    Drop it.
                    <br />
                    Get read.
                  </TitleTag>
                  <p className="max-w-prose text-lg">
                    Panelhouse is the studio and the shop for independent manga: letter your pages, schedule your chapters and meet
                    readers who follow you from the first panel.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-6 py-4 ps-3">
                    <Button variant="shout" size="lg" onClick={() => goTo("pricing")}>
                      Start free
                    </Button>
                    <Button variant="outline" className={touch} onClick={() => goTo("features")}>
                      See the features
                    </Button>
                  </div>
                </div>
                {/* a band of motion lines on the bottom edge: decoration only, no text on it */}
                <SpeedLines variant="motion" density={0.9} seed={7} className="h-10 shrink-0 border-t-[length:var(--mg-bw)] border-border" />
              </div>
            </Panel>

            <Panel cut={wide ? { side: "start", size: 48 } : undefined} className="min-h-64">
              <SpeedLines variant="focus" originX={50} originY={55} hole={0.62} density={0.55} className="absolute inset-0" />
              <div className={cn("relative grid h-full place-items-center p-6", wide && "ps-14")}>
                <BookArt className="w-full max-w-60" />
              </div>
              <Burst variant="accent" points={12} seed={9} className="absolute end-2 top-2 z-10 min-h-20 min-w-20 px-6 py-5 text-base">
                NEW!
              </Burst>
              <PanelCaption position="bottom-start">
                Chapter 1 is free.
              </PanelCaption>
            </Panel>

            <Panel ink colSpan={wide ? 3 : undefined} className="min-h-0">
              <dl className="grid gap-5 p-5 @xl/main:grid-cols-3 @md/main:p-6">
                {[
                  ["48,200", "chapters published"],
                  ["9,300", "creators drawing"],
                  ["90%", "of a sale to the artist"],
                ].map(([value, label]) => (
                  <div key={label} className="grid gap-1">
                    <dt className="order-2 text-sm">{label}</dt>
                    <dd className="order-1 font-letter text-4xl leading-none">{value}</dd>
                  </div>
                ))}
              </dl>
              <SpeedLines variant="motion" density={0.5} seed={3} className="h-6" />
            </Panel>
          </PanelGrid>
        </section>

        {/* Features: one case per feature. */}
        <section aria-labelledby={`${uid}-features`} className="grid gap-6">
          <Heading no="01" id={`${uid}-features`}>
            Features
          </Heading>
          <ul className="grid gap-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="relative ink-case grid content-start gap-3 p-5">
                <span aria-hidden className="grid size-11 place-items-center ink-fill">
                  <Icon className="size-6" />
                </span>
                <h3 className="font-letter text-2xl leading-tight tracking-wide uppercase">{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Pricing: Free versus Pro, Pro highlighted. */}
        <section aria-labelledby={`${uid}-pricing`} className="grid gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Heading no="02" id={`${uid}-pricing`}>
              Pricing
            </Heading>
            {/* Pressed buttons rather than a Toggle Group: its value API differs between Radix and Base UI. */}
            <ButtonGroup aria-label="Billing">
              {(["monthly", "yearly"] as const).map((b) => (
                <Button
                  key={b}
                  size="sm"
                  variant={billing === b ? "default" : "outline"}
                  aria-pressed={billing === b}
                  onClick={() => setBilling(b)}
                  className={touch}
                >
                  {b === "monthly" ? "Monthly" : "Yearly −2 months"}
                </Button>
              ))}
            </ButtonGroup>
          </div>

          <VersusPanel>
            {(["free", "pro"] as const).map((key) => {
              const plan = PLANS[key]
              const pro = key === "pro"
              return (
                <VersusSide key={key} highlight={pro} aria-labelledby={`${uid}-plan-${key}`}>
                  <div className="grid gap-4">
                    <div className="grid gap-1">
                      <p className="font-mono text-xs">{pro ? "Most picked by weekly series" : "No card needed"}</p>
                      <h3 id={`${uid}-plan-${key}`} className="font-letter text-4xl leading-none tracking-wide uppercase">
                        {plan.name}
                      </h3>
                    </div>
                    <p className="flex items-baseline gap-2">
                      <span className="font-letter text-5xl leading-none">{plan.price[billing]}</span>
                      <span className="text-sm">{priceSuffix(!pro)}</span>
                    </p>
                    <p>{plan.blurb}</p>
                    <ul className="grid gap-2">
                      {plan.perks.map((perk) => (
                        <li key={perk} className="flex items-center gap-2">
                          <span aria-hidden className="mark-check shrink-0 text-lg" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <div>
                      <Button
                        variant={pro ? "outline" : "default"}
                        className={touch}
                        aria-pressed={picked?.plan === key}
                        onClick={() => setPicked({ plan: key, billing })}
                      >
                        {pro ? "Try Pro for 14 days" : "Start free"}
                      </Button>
                    </div>
                  </div>
                </VersusSide>
              )
            })}
          </VersusPanel>
          <p aria-live="polite" className="flex min-h-7 items-center gap-2 font-letter text-lg tracking-wide uppercase">
            {picked && (
              <>
                <span aria-hidden className="mark-check shrink-0" />
                {picked.plan === "free"
                  ? "Free plan picked: your studio is ready."
                  : `Pro trial started: 14 days free, then ${PLANS.pro.price[picked.billing]} ${picked.billing === "monthly" ? "a month" : "a year"}.`}
              </>
            )}
          </p>
        </section>

        {/* Reviews: one speech bubble per creator, the avatar under its tail. */}
        <section aria-labelledby={`${uid}-reviews`} className="grid gap-6">
          <Heading no="03" id={`${uid}-reviews`}>
            Reviews
          </Heading>
          <ul className="grid gap-8 @3xl/main:grid-cols-3 @3xl/main:gap-6">
            {REVIEWS.map((r) => (
              <li key={r.name}>
                <figure className="grid justify-items-start gap-1">
                  <SpeechBubble tail="bottom" tailAlign="start" seed={r.name.length}>
                    <blockquote>“{r.quote}”</blockquote>
                  </SpeechBubble>
                  <figcaption className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback>{r.initials}</AvatarFallback>
                    </Avatar>
                    <span className="grid">
                      <span className="font-letter text-lg leading-tight tracking-wide uppercase">{r.name}</span>
                      <span className="text-sm">{r.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section aria-labelledby={`${uid}-faq`} className="grid gap-6">
          <Heading no="04" id={`${uid}-faq`}>
            FAQ
          </Heading>
          <Accordion {...FAQ_MODE} className="max-w-3xl">
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>

      {/* Footer: brand, link columns, newsletter. */}
      <footer className="grid gap-8 border-t-[length:var(--mg-bw-panel)] border-border px-4 py-8 @md/main:px-6 @4xl/main:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1.3fr)]">
        <div className="grid content-start gap-2">
          <span className="flex items-center gap-2">
            <span aria-hidden className="grid size-9 shrink-0 place-items-center ink-fill font-sfx text-sm">
              コマ
            </span>
            <span className="font-letter text-xl leading-none tracking-wide uppercase">Panelhouse</span>
          </span>
          <p className="text-sm">The studio and the shop for independent manga.</p>
          <p className="text-sm">© 2026 Panelhouse · drawn with mangacn</p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-3 gap-4">
          {FOOTER.map((col) => (
            <div key={col.title} className="grid content-start gap-1">
              <h2 className="font-letter text-lg tracking-wide uppercase">{col.title}</h2>
              <ul className="grid">
                {col.links.map((label) => (
                  <li key={label}>
                    <a href="#" onClick={stop} className={cn("inline-flex min-h-8 items-center text-sm hover-underline focus-ink", touch)}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <form noValidate onSubmit={subscribe} className="grid content-start">
          <Field data-invalid={emailError ? "true" : undefined}>
            <FieldLabel htmlFor={`${uid}-email`}>Newsletter</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id={`${uid}-email`}
                type="email"
                autoComplete="email"
                placeholder="you@studio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={`${uid}-email-note`}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton type="submit" size="sm">
                  Subscribe
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            <div id={`${uid}-email-note`} aria-live="polite">
              {emailError ? (
                <FieldError>{emailError}</FieldError>
              ) : subscribed ? (
                <FieldDescription className="flex items-center gap-2">
                  <span aria-hidden className="mark-check shrink-0" />
                  Subscribed as {subscribed}. Chapter 0 is on its way.
                </FieldDescription>
              ) : (
                <FieldDescription>One email per new feature, never more. Nothing leaves this page.</FieldDescription>
              )}
            </div>
          </Field>
        </form>
      </footer>
    </div>
  )
}
