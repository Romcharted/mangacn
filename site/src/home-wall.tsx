import { useMemo, useState, type ReactNode } from "react"
import { Bar, BarChart, XAxis } from "recharts"
import { Button } from "@registry/manga/ui/button"
import { Calendar } from "@registry/manga/ui/calendar"
import { ChartContainer, ChartTooltip, ChartTooltipContent, chartFill, type ChartConfig } from "@registry/manga/ui/chart"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@registry/manga/ui/command"
import { Field, FieldLabel } from "@registry/manga/ui/field"
import { Input } from "@registry/manga/ui/input"
import { Label } from "@registry/manga/ui/label"
import { Message, MessageAvatar, MessageContent, MessageHeader } from "@registry/manga/ui/message"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@registry/manga/ui/select"
import { Slider } from "@registry/manga/ui/slider"
import { Switch } from "@registry/manga/ui/switch"
import { DialogueBox, type DialogueLine } from "@registry/manga/signature/dialogue-box"
import { ObiBand } from "@registry/manga/signature/obi-band"
import { PageReader } from "@registry/manga/signature/page-reader"
import { ReactionPicker } from "@registry/manga/signature/reaction-picker"
import { ReaderSettings, defaultReaderSettings } from "@registry/manga/signature/reader-settings"
import { AuthDivider, SocialButton } from "@registry/manga/signature/social-button"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { Spoiler } from "@registry/manga/signature/spoiler"
import { Stat } from "@registry/manga/signature/stat"
import { TypingBubble } from "@registry/manga/signature/typing-bubble"
import type { ManpuKind } from "@registry/manga/signature/manpu"
import { AppleMark, GoogleMark } from "./brands"
import { chapterPages } from "./demos/reader-art"
import { Art, VolumeCover, artSrc } from "./mapless"
import { componentRoute } from "./docs/nav"
import { to } from "./router"

/*
 * The home page's wall of live components, like the cards on the shadcn home page: each card is a small,
 * real piece of interface you can use on the spot, with a discreet link to the page of its main component.
 * Loaded on demand, below the interfaces.
 */

function WallCard({ title, item, label, children, className = "" }: { title: string; item: string; label: string; children: ReactNode; className?: string }) {
  return (
    <section aria-label={title} className={`mb-4 grid break-inside-avoid gap-3 border-ink bg-background p-4 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-letter text-lg leading-none uppercase">{title}</p>
        <a href={to(componentRoute(item))} className="inline-flex min-h-11 shrink-0 items-center font-mono text-xs underline-offset-4 hover:underline focus-ink sm:min-h-6">
          {label} →
        </a>
      </div>
      {children}
    </section>
  )
}

function SignIn() {
  return (
    <WallCard title="Sign in" item="social-button" label="Social Button">
      <form className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
        <Field>
          <FieldLabel htmlFor="wall-email">Email</FieldLabel>
          <Input id="wall-email" type="email" autoComplete="off" placeholder="suzu@mapless.ink" />
        </Field>
        <Field>
          <FieldLabel htmlFor="wall-pass">Password</FieldLabel>
          <Input id="wall-pass" type="password" autoComplete="off" />
        </Field>
        <Button type="submit" fullWidth>
          Sign in
        </Button>
        <AuthDivider />
        <div className="grid grid-cols-2 gap-2">
          <SocialButton type="button" provider="google" logo={<GoogleMark />}>
            Google
          </SocialButton>
          <SocialButton type="button" provider="apple" logo={<AppleMark />}>
            Apple
          </SocialButton>
        </div>
      </form>
    </WallCard>
  )
}

const READS = [
  { month: "Jun", reads: 32, sales: 18 },
  { month: "Jul", reads: 41, sales: 22 },
  { month: "Aug", reads: 38, sales: 25 },
  { month: "Sep", reads: 55, sales: 31 },
  { month: "Oct", reads: 62, sales: 36 },
]
const CONFIG = { reads: { label: "Reads" }, sales: { label: "Sales" } } satisfies ChartConfig
const KEYS = Object.keys(CONFIG)

function Figures() {
  return (
    <WallCard title="This month" item="chart" label="Chart">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Readers" value="12.4k" delta="+8%" trend="up" emphasis />
        <Stat label="Chapters" value="11" delta="+1" trend="up" />
      </div>
      <ChartContainer config={CONFIG} className="aspect-auto h-40 w-full">
        <BarChart data={READS} margin={{ top: 8, left: 4, right: 4 }}>
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="reads" fill={chartFill("reads", KEYS)} stroke="currentColor" strokeWidth={2} />
          <Bar dataKey="sales" fill={chartFill("sales", KEYS)} stroke="currentColor" strokeWidth={2} />
        </BarChart>
      </ChartContainer>
    </WallCard>
  )
}

function ReleaseDay() {
  const [date, setDate] = useState<Date | undefined>(() => new Date())
  return (
    <WallCard title="Release day" item="calendar" label="Calendar">
      <div className="grid justify-items-center">
        <div className="relative w-fit ink-case">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
        <p className="mt-2 text-sm" aria-live="polite">
          {date ? `Volume 3 out on ${date.toLocaleDateString("en", { month: "long", day: "numeric" })}.` : "Pick a day."}
        </p>
      </div>
    </WallCard>
  )
}

const ANSWER = "Chapter 12 is out on Friday. Kuro is in it, and he is not happy about the rain."

function Conversation() {
  const [asked, setAsked] = useState(false)
  const [done, setDone] = useState(false)
  return (
    <WallCard title="Conversation" item="typing-bubble" label="Typing Bubble">
      <div className="grid gap-3">
        <Message>
          <MessageAvatar>SU</MessageAvatar>
          <MessageContent>
            <MessageHeader>Suzu</MessageHeader>
            <SpeechBubble tail="start" tailAlign="start" maxWidth="100%">
              When is the next chapter?
            </SpeechBubble>
          </MessageContent>
        </Message>
        {asked && (
          <div className="ms-auto max-w-[85%]">
            <TypingBubble text={ANSWER} typing={false} onDone={() => setDone(true)} tail="end" tailAlign="start" />
          </div>
        )}
        <Button
          variant={asked ? "outline" : "default"}
          onClick={() => {
            setAsked((a) => !a)
            setDone(false)
          }}
          disabled={asked && !done}
        >
          {asked ? "Ask again" : "Answer"}
        </Button>
      </div>
    </WallCard>
  )
}

function Settings() {
  const [furigana, setFurigana] = useState(true)
  const [size, setSize] = useState([60])
  return (
    <WallCard title="Settings" item="switch" label="Switch">
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="wall-furigana">Show furigana</Label>
          <Switch id="wall-furigana" checked={furigana} onCheckedChange={setFurigana} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="wall-sfx">Translate sound effects</Label>
          <Switch id="wall-sfx" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="wall-lang">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger id="wall-lang" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-sm font-bold" id="wall-size">
              Text size
            </span>
            <span className="font-mono text-sm">{size[0]}%</span>
          </div>
          <Slider aria-labelledby="wall-size" value={size} onValueChange={(v) => setSize(Array.isArray(v) ? [...v] : [v])} min={40} max={100} />
        </div>
      </div>
    </WallCard>
  )
}

function Volume() {
  return (
    <WallCard title="New volume" item="obi-band" label="Obi Band">
      <div className="mx-auto w-48">
        <ObiBand cover={<VolumeCover volume={3} shown="12rem" />} headline="Volume 3" caption="The sky has no map" badge="NEW" tone="accent" size="sm" />
      </div>
    </WallCard>
  )
}

function Reader() {
  const [settings, setSettings] = useState(defaultReaderSettings)
  return (
    <WallCard title="Reader settings" item="reader-settings" label="Reader Settings">
      <ReaderSettings value={settings} onValueChange={setSettings} hide={["fit"]} />
    </WallCard>
  )
}

const VARIANTS = ["speech", "thought", "shout", "whisper", "electronic"] as const
const LINES: Record<(typeof VARIANTS)[number], string> = {
  speech: "Every island deserves a map.",
  thought: "Where did Kuro go…",
  shout: "KURO, BACK!",
  whisper: "Don't wake the Eraser.",
  electronic: "Signal lost. Recalculating.",
}

function Bubbles() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>("speech")
  return (
    <WallCard title="Speech bubble" item="speech-bubble" label="Speech Bubble">
      <div role="radiogroup" aria-label="Bubble variant" className="flex flex-wrap gap-1.5">
        {VARIANTS.map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={variant === v}
            onClick={() => setVariant(v)}
            className="min-h-11 border-ink-fine px-2.5 font-letter text-sm uppercase focus-ink aria-checked:ink-fill sm:min-h-8"
          >
            {v}
          </button>
        ))}
      </div>
      <div className="grid min-h-36 place-items-center">
        <SpeechBubble key={variant} variant={variant} tail="bottom" tailAlign="start">
          {LINES[variant]}
        </SpeechBubble>
      </div>
    </WallCard>
  )
}

const KINDS: ManpuKind[] = ["love", "sweat", "anger", "surprise"]

function Reactions() {
  const [counts, setCounts] = useState<Record<string, number>>({ love: 12, sweat: 3, anger: 1, surprise: 7 })
  const [mine, setMine] = useState<Set<string>>(() => new Set(["love"]))
  return (
    <WallCard title="Reactions" item="reaction-picker" label="Reaction Picker">
      <p className="text-sm">How was chapter 11?</p>
      <ReactionPicker
        reactions={KINDS.map((kind) => ({ kind, count: counts[kind] ?? 0, active: mine.has(kind) }))}
        onReact={(kind) => {
          const on = !mine.has(kind)
          setMine((s) => {
            const next = new Set(s)
            if (on) next.add(kind)
            else next.delete(kind)
            return next
          })
          setCounts((c) => ({ ...c, [kind]: (c[kind] ?? 0) + (on ? 1 : -1) }))
        }}
      />
    </WallCard>
  )
}

function Palette() {
  return (
    <WallCard title="Command palette" item="command" label="Command">
      <Command className="border-ink">
        <CommandInput placeholder="Jump to a chapter…" />
        <CommandList className="max-h-44">
          <CommandEmpty>No chapter matches.</CommandEmpty>
          <CommandGroup heading="Volume 2">
            <CommandItem value="chapter 9 the lighthouse">
              Ch. 9 — The lighthouse <CommandShortcut>9</CommandShortcut>
            </CommandItem>
            <CommandItem value="chapter 10 ink rain">
              Ch. 10 — Ink rain <CommandShortcut>10</CommandShortcut>
            </CommandItem>
            <CommandItem value="chapter 11 the bridge">
              Ch. 11 — The bridge <CommandShortcut>11</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </WallCard>
  )
}

function Secret() {
  return (
    <WallCard title="Spoiler" item="spoiler" label="Spoiler">
      <Spoiler label="the last panel of chapter 11">
        <Art name="spear-clash" shown="20rem" alt="The Eraser's spear meets Suzu's pen above the bridge." className="block h-auto w-full max-w-[371px]" />
      </Spoiler>
      <p className="text-sm">
        The map was drawn by <Spoiler variant="inline" label="who drew the map">Kuro</Spoiler>.
      </p>
    </WallCard>
  )
}

const DIALOGUE: DialogueLine[] = [
  { speaker: "Suzu", portrait: artSrc("suzu-face", 240), text: "Kuro! Did you eat my ink again?" },
  { speaker: "Kuro", portrait: artSrc("kuro", 150), side: "end", text: "Grrrk. (Only the black one.)" },
  { speaker: "Suzu", portrait: artSrc("suzu-face", 240), text: "That is the only one I have!" },
]

function Dialogue() {
  return (
    <WallCard title="Dialogue box" item="dialogue-box" label="Dialogue Box">
      <DialogueBox lines={DIALOGUE} loop />
    </WallCard>
  )
}

function MiniReader() {
  const pages = useMemo(() => chapterPages(), [])
  return (
    <WallCard title="Page reader" item="page-reader" label="Page Reader">
      <PageReader pages={pages} spread="single" direction="ltr" className="h-[26rem]! min-h-0!" />
    </WallCard>
  )
}

export function HomeWall() {
  return (
    <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
      <SignIn />
      <Bubbles />
      <Figures />
      <Conversation />
      <ReleaseDay />
      <Reactions />
      <Settings />
      <Volume />
      <MiniReader />
      <Palette />
      <Reader />
      <Secret />
      <Dialogue />
    </div>
  )
}
