"use client"

/*
 * AI chat — a conversation with a story assistant, made only with mangacn: Message + Bubble lines in the
 * Message Scroller, Markers, the assistant's reasoning in a thought SpeechBubble (Collapsible), tool steps in a
 * Trace, typed answers (TypingBubble), a Code Block, an error shouted in a shout SpeechBubble with Retry,
 * Reaction Picker, Attachments, a Questionnaire, and a composer (Textarea, attach and send Buttons).
 * Nothing goes over the network: sending plays a fake reply (a running step, the waiting dots, then the text).
 * From 48rem wide the chat is a 48rem frame that scrolls inside; narrower, it follows the page (no inner
 * scroller) and sending brings the composer back into view.
 */
import * as React from "react"
import { ArrowUpIcon, BrainIcon, PaperclipIcon, PlusIcon, RotateCcwIcon, XIcon, ZapIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/manga/attachment"
import { Bubble, BubbleContent } from "@/components/ui/manga/bubble"
import { Button } from "@/components/ui/manga/button"
import { ButtonGroup } from "@/components/ui/manga/button-group"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/manga/code-block"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/manga/collapsible"
import { Kbd } from "@/components/ui/manga/kbd"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/manga/marker"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from "@/components/ui/manga/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/manga/message-scroller"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/manga/questionnaire"
import { Textarea } from "@/components/ui/manga/textarea"
import { Trace, TraceDescription, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/manga/trace"
import { ReactionPicker, type Reaction } from "@/components/manga/reaction-picker"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { TypingBubble } from "@/components/manga/typing-bubble"
import { cn } from "cn"

type Model = "deep" | "fast"
type FileKind = "page" | "pdf" | "note"
type ChatFile = { id: string; name: string; kind: FileKind; meta: string; state: "uploading" | "done" }
type Step = { title: string; time?: string; status?: "running" }
type Phase = "working" | "dots" | "typing" | "done"

type Item =
  | { id: string; kind: "marker"; text: string; icon?: Model }
  | { id: string; kind: "user"; time: string; text: string; files?: ChatFile[] }
  | {
      id: string
      kind: "answer"
      time: string
      text: string
      thought?: { seconds: number; text: string }
      steps?: Step[]
      code?: boolean
      reactions?: Reaction[]
    }
  | { id: string; kind: "plan"; time: string }
  | { id: string; kind: "error"; time: string }
  | { id: string; kind: "reply"; time: string; phase: Phase; working: string; worked: string; text: string; thought?: string }

type Reply = Extract<Item, { kind: "reply" }>

const SCRIPT = `// Numbers the panels of each page the manga way:
// top to bottom, then right to left.
type Panel = { page: number; x: number; y: number }

export function numberPanels(panels: Panel[]) {
  const pages = Map.groupBy(panels, (p) => p.page)
  return [...pages].flatMap(([page, list]) =>
    list
      .sort((a, b) => a.y - b.y || b.x - a.x)
      .map((p, i) => ({ ...p, label: \`\${page}-\${i + 1}\` })),
  )
}`

const STORYBOARD: ChatFile[] = [
  { id: "s1", name: "storyboard-ch1.pdf", kind: "pdf", meta: "PDF · 16 pages", state: "done" },
  { id: "s2", name: "rival-sketch.png", kind: "page", meta: "PNG · 2.4 MB", state: "done" },
]

const START: Item[] = [
  { id: "m1", kind: "marker", text: "Today" },
  {
    id: "u1",
    kind: "user",
    time: "21:02",
    files: STORYBOARD,
    text: "Here is my storyboard for a 16-page one-shot. The rival shows up on page 5. Is that too early?",
  },
  {
    id: "a1",
    kind: "answer",
    time: "21:02",
    thought: {
      seconds: 4,
      text: "Page 5 of 16 is early. The hero needs a goal first, then the rival can threaten it.",
    },
    steps: [
      { title: "Read storyboard-ch1.pdf", time: "1.2s" },
      { title: "Looked at rival-sketch.png", time: "0.6s" },
      { title: "Checking the lettering…", status: "running" },
    ],
    text: "Page 5 works if page 4 ends on the hero’s goal. Move the rooftop promise to page 4 and let the rival’s shadow cross its last panel. Page 5 then opens on his face, full width.",
    reactions: [
      { kind: "sparkle", count: 2, active: true },
      { kind: "surprise", count: 1 },
    ],
  },
  { id: "p1", kind: "plan", time: "21:03" },
  { id: "m2", kind: "marker", text: "Switched to a faster model", icon: "fast" },
  { id: "u2", kind: "user", time: "21:05", text: "Can you write a script that numbers my panels, the manga way?" },
  {
    id: "a2",
    kind: "answer",
    time: "21:05",
    text: "Here you go. It sorts each page top to bottom, then right to left.",
    code: true,
  },
  { id: "u3", kind: "user", time: "21:07", text: "Now render page 5 as thumbnails, please." },
  { id: "e1", kind: "error", time: "21:07" },
]

const FRESH: Item[] = [
  { id: "m1", kind: "marker", text: "New chat" },
  {
    id: "a1",
    kind: "answer",
    time: "now",
    text: "Hi, I’m Fude. Ask me about pacing, panels, lettering or tones, or attach a page.",
  },
]

/** Fake replies, played in turn. Nothing leaves the page. */
const REPLIES = [
  {
    working: "Reading your message…",
    worked: "Read your message",
    text: "Try ending the page on a turn: the reader flips it to find out what happens next.",
  },
  {
    working: "Checking the storyboard…",
    worked: "Checked the storyboard · 16 pages",
    text: "Panels 3 and 4 say the same thing. Cut one and give the rooftop a full-width panel.",
  },
  {
    working: "Looking at the lettering…",
    worked: "Looked at the lettering",
    text: "Keep each bubble under 25 words. A long line reads better split into two bubbles.",
  },
]

const POOL: Omit<ChatFile, "id" | "state">[] = [
  { name: "panel-sketch.png", kind: "page", meta: "PNG · 960 KB" },
  { name: "script-ch2.pdf", kind: "pdf", meta: "PDF · 12 pages" },
  { name: "sfx-list.txt", kind: "note", meta: "TXT · 2 KB" },
]

const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

/** A page of a manga: paper, three panels, the last one inked. */
function FileArt({ kind }: { kind: FileKind }) {
  const ink = { fill: "none", stroke: "var(--foreground)", strokeWidth: 1.5 }
  if (kind === "pdf")
    return (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden>
        <path d="M5 2.5h9.5l4.5 4.5v14.5H5z" style={{ ...ink, fill: "var(--background)" }} />
        <path d="M14.5 2.5V7H19" style={ink} />
        <path d="M8 11h8M8 14h8M8 17h5" style={ink} />
      </svg>
    )
  if (kind === "note")
    return (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden>
        <rect x="4.5" y="3" width="15" height="18" style={{ ...ink, fill: "var(--background)" }} />
        <path d="M7.5 7.5h9M7.5 11h9M7.5 14.5h6" style={ink} />
        <path d="M15 17.5l2.5-2.5" style={ink} />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className="size-full" aria-hidden>
      <rect x="3.5" y="2.5" width="17" height="19" style={{ ...ink, fill: "var(--background)" }} />
      <path d="M3.5 10h17M12 2.5V10M3.5 15.5l17-2" style={ink} />
      <path d="M3.5 15.5l17-2V21.5h-17z" style={{ fill: "var(--foreground)" }} />
    </svg>
  )
}

function FileChip({ file, onRemove }: { file: ChatFile; onRemove?: () => void }) {
  return (
    <Attachment state={file.state}>
      <AttachmentMedia>
        <FileArt kind={file.kind} />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>{file.name}</AttachmentTitle>
        <AttachmentDescription>{file.state === "uploading" ? "Uploading…" : file.meta}</AttachmentDescription>
      </AttachmentContent>
      {onRemove && (
        <AttachmentActions>
          <AttachmentAction aria-label={`Remove ${file.name}`} onClick={onRemove}>
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      )}
    </Attachment>
  )
}

function Assistant({ time, children }: { time: string; children: React.ReactNode }) {
  return (
    <Message>
      <MessageAvatar>
        <span aria-hidden className="grid size-full place-items-center ink-fill font-sfx text-lg">
          フ
        </span>
        <span className="sr-only">Fude</span>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>Fude</MessageHeader>
        {children}
        <MessageFooter>{time}</MessageFooter>
      </MessageContent>
    </Message>
  )
}

function User({ item }: { item: Extract<Item, { kind: "user" }> }) {
  return (
    <Message align="end">
      <MessageAvatar>YU</MessageAvatar>
      <MessageContent>
        <MessageHeader>Yuki</MessageHeader>
        {item.files && item.files.length > 0 && (
          <AttachmentGroup aria-label="Attached files" className="justify-end">
            {item.files.map((f) => (
              <FileChip key={f.id} file={f} />
            ))}
          </AttachmentGroup>
        )}
        <Bubble align="end">
          <BubbleContent>{item.text}</BubbleContent>
        </Bubble>
        <MessageFooter>{item.time}</MessageFooter>
      </MessageContent>
    </Message>
  )
}

/** The reasoning, folded: "Thought for 4 s" opens a thought bubble. */
function Thought({ seconds, text }: { seconds: number; text: string }) {
  return (
    <div className="max-w-full self-start">
      <Collapsible>
        <CollapsibleTrigger className="max-sm:min-h-11">
          <BrainIcon aria-hidden className="size-4 shrink-0" />
          Thought for {seconds} s
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SpeechBubble variant="thought" tail="top" tailAlign="start">
            {text}
          </SpeechBubble>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function Steps({ steps }: { steps: Step[] }) {
  return (
    <Trace aria-label="Steps">
      {steps.map((s) => (
        <TraceLine key={s.title} status={s.status}>
          <TraceIcon />
          <TraceTitle>{s.title}</TraceTitle>
          {s.time && <TraceDescription>{s.time}</TraceDescription>}
        </TraceLine>
      ))}
    </Trace>
  )
}

/** Toggles a reaction: on adds one, off takes it back; a reaction at zero leaves the row. */
function toggle(list: Reaction[], kind: Reaction["kind"]): Reaction[] {
  const found = list.find((r) => r.kind === kind)
  if (!found) return [...list, { kind, count: 1, active: true }]
  const active = !found.active
  const count = found.count + (active ? 1 : -1)
  if (count <= 0) return list.filter((r) => r.kind !== kind)
  return list.map((r) => (r.kind === kind ? { ...r, active, count } : r))
}

function Reactions({ initial }: { initial: Reaction[] }) {
  const [reactions, setReactions] = React.useState(initial)
  return <ReactionPicker reactions={reactions} onReact={(kind) => setReactions((list) => toggle(list, kind))} max={4} />
}

function Answer({ item }: { item: Extract<Item, { kind: "answer" }> }) {
  return (
    <Assistant time={item.time}>
      {item.thought && <Thought {...item.thought} />}
      {item.steps && <Steps steps={item.steps} />}
      <Bubble variant="secondary">
        <BubbleContent>{item.text}</BubbleContent>
      </Bubble>
      {item.code && (
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>number-panels.ts</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={SCRIPT} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent>{SCRIPT}</CodeBlockContent>
          <CodeBlockFooter>ts · 12 lines</CodeBlockFooter>
        </CodeBlock>
      )}
      {item.reactions && <Reactions initial={item.reactions} />}
    </Assistant>
  )
}

/** A fake reply: a running step, the waiting dots, then the text types itself. */
function ReplyLine({ item, onDone }: { item: Reply; onDone: () => void }) {
  return (
    <Assistant time={item.time}>
      {item.thought && item.phase !== "working" && <Thought seconds={2} text={item.thought} />}
      <Steps steps={[item.phase === "working" ? { title: item.working, status: "running" } : { title: item.worked, time: "1.1s" }]} />
      {item.phase !== "working" && (
        <TypingBubble
          text={item.phase === "dots" ? "" : item.text}
          // the tail points down-left, at the avatar under the line
          tail="start"
          tailAlign="end"
          className="self-start"
          onDone={onDone}
        />
      )}
    </Assistant>
  )
}

function Failure({ item, onRetry }: { item: Extract<Item, { kind: "error" }>; onRetry: () => void }) {
  return (
    <Assistant time={item.time}>
      <Steps steps={[{ title: "Opened page-05.psd", time: "0.3s" }]} />
      <div role="alert" className="flex flex-col items-start gap-3">
        <SpeechBubble
          variant="shout"
          tail="start"
          tailAlign="end"
          seed={11}
          style={{ "--bubble-stroke": "var(--destructive)" } as React.CSSProperties}
        >
          Render failed!
        </SpeechBubble>
        <Bubble variant="destructive">
          <BubbleContent>page-05.psd is open in another app. Close it there, then try again.</BubbleContent>
        </Bubble>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="self-start max-sm:h-11">
        <RotateCcwIcon />
        Retry
      </Button>
    </Assistant>
  )
}

const GENRES = [
  { value: "Action", hint: "Rivals, a tournament, one big punch." },
  { value: "Mystery", hint: "A locked room on the last train." },
  { value: "Romance", hint: "Two leads, one umbrella." },
]
const LENGTHS = ["16 pages", "24 pages", "32 pages"]
type Plan = { genre: string; pages: string; pitch: string }

/** The assistant offers a questionnaire; once sent it folds into a summary card. */
function PlanOffer({ time, onPlanned }: { time: string; onPlanned: (plan: Plan) => void }) {
  const [plan, setPlan] = React.useState<Plan | null>(null)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const next = { genre: String(data.get("genre") ?? ""), pages: String(data.get("pages") ?? ""), pitch: String(data.get("pitch") ?? "") }
    setPlan(next)
    onPlanned(next)
  }

  return (
    <Assistant time={time}>
      <Bubble variant="secondary">
        <BubbleContent>Want to plan your next one? Three quick questions.</BubbleContent>
      </Bubble>
      {/* room for the case's tone shadow inside the scroller */}
      <div className="max-w-md pe-2 pb-2">
        {plan ? (
          <div className="relative ink-case animate-pop space-y-2 p-4">
            <p className="flex items-center gap-2 font-letter text-xl tracking-wide uppercase">
              <span aria-hidden className="mark-check text-lg" /> One-shot planned
            </p>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1">
              <dt className="font-letter tracking-wide uppercase">Genre</dt>
              <dd>{plan.genre}</dd>
              <dt className="font-letter tracking-wide uppercase">Length</dt>
              <dd>{plan.pages}</dd>
              <dt className="font-letter tracking-wide uppercase">Pitch</dt>
              <dd className="break-words">{plan.pitch}</dd>
            </dl>
          </div>
        ) : (
          <Questionnaire shortcuts="letters" onSubmit={submit} aria-label="Plan your one-shot">
            <QuestionnaireProgress />
            <QuestionnaireItem name="genre" required>
              <QuestionnaireTitle>Plan your one-shot: which genre?</QuestionnaireTitle>
              <QuestionnaireChoices>
                {GENRES.map((g) => (
                  <QuestionnaireChoice key={g.value} value={g.value}>
                    {g.value}
                    <QuestionnaireChoiceDescription>{g.hint}</QuestionnaireChoiceDescription>
                  </QuestionnaireChoice>
                ))}
              </QuestionnaireChoices>
              <QuestionnaireError />
            </QuestionnaireItem>
            <QuestionnaireItem name="pages" required>
              <QuestionnaireTitle>How many pages?</QuestionnaireTitle>
              <QuestionnaireChoices>
                {LENGTHS.map((l) => (
                  <QuestionnaireChoice key={l} value={l}>
                    {l}
                  </QuestionnaireChoice>
                ))}
              </QuestionnaireChoices>
              <QuestionnaireError />
            </QuestionnaireItem>
            <QuestionnaireItem name="pitch" required>
              <QuestionnaireTitle>Your pitch in one line</QuestionnaireTitle>
              <QuestionnaireInput placeholder="A courier races the last ferry…" aria-label="Pitch" />
              <QuestionnaireError>Write one line to finish.</QuestionnaireError>
            </QuestionnaireItem>
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext />
              <QuestionnaireSubmit>Plan it</QuestionnaireSubmit>
            </QuestionnaireActions>
          </Questionnaire>
        )}
      </div>
    </Assistant>
  )
}

/** Keeps the newest line in view after you send or retry (the scroller only sticks while you sit at the end). */
function FollowEnd({ signal }: { signal: string }) {
  const { scrollToEnd } = useMessageScroller()
  const scroll = React.useRef(scrollToEnd)
  React.useEffect(() => {
    scroll.current = scrollToEnd
  })
  React.useEffect(() => {
    if (signal) scroll.current({ behavior: "smooth" })
  }, [signal])
  return null
}

export function AiChat({ className }: { className?: string }) {
  const [items, setItems] = React.useState<Item[]>(START)
  const [model, setModel] = React.useState<Model>("fast")
  const [draft, setDraft] = React.useState("")
  const [files, setFiles] = React.useState<ChatFile[]>([
    { id: "f1", name: "page-06.png", kind: "page", meta: "PNG · 1.8 MB", state: "done" },
    { id: "f2", name: "lettering-notes.txt", kind: "note", meta: "TXT · 4 KB", state: "uploading" },
  ])
  const [chat, setChat] = React.useState(0)
  const ids = React.useRef(0)
  const turn = React.useRef(0)
  const [follow, setFollow] = React.useState(false)
  const composerRef = React.useRef<HTMLFormElement>(null)
  const frameRef = React.useRef<HTMLDivElement>(null)

  const nextId = (prefix: string) => `${prefix}${++ids.current}`
  const busy = items.some((i) => i.kind === "reply" && i.phase !== "done")
  const ready = files.filter((f) => f.state === "done")
  const canSend = !busy && (draft.trim().length > 0 || ready.length > 0)

  // A reply moves on by itself: running step → waiting dots → typing. One timer, cleared on every change.
  const pending = items.find((i): i is Reply => i.kind === "reply" && (i.phase === "working" || i.phase === "dots"))
  const pendingKey = pending ? `${pending.id}:${pending.phase}` : ""
  React.useEffect(() => {
    if (!pendingKey) return
    const [id, phase] = pendingKey.split(":")
    const timer = window.setTimeout(
      () =>
        setItems((list) =>
          list.map((i) => (i.id === id && i.kind === "reply" && i.phase === phase ? { ...i, phase: phase === "working" ? "dots" : "typing" } : i)),
        ),
      phase === "working" ? 1100 : 900,
    )
    return () => window.clearTimeout(timer)
  }, [pendingKey])

  // Files finish uploading after a moment.
  const uploading = files.filter((f) => f.state === "uploading").map((f) => f.id).join()
  React.useEffect(() => {
    if (!uploading) return
    const timer = window.setTimeout(() => setFiles((list) => list.map((f) => ({ ...f, state: "done" as const }))), 1600)
    return () => window.clearTimeout(timer)
  }, [uploading])

  // On phones the conversation follows the page: after you send, keep the composer (and the newest line above
  // it) in view. In the frame (48rem wide and up) FollowEnd scrolls the Message Scroller instead.
  React.useEffect(() => {
    const composer = composerRef.current
    const frame = frameRef.current
    if (!follow || !composer || !frame || getComputedStyle(frame).overflowY === "hidden") return
    composer.scrollIntoView({ block: "nearest" })
  }, [follow, items.length, pendingKey])

  const reply = (r: Omit<Reply, "id" | "kind" | "time" | "phase">) =>
    ({ ...r, id: nextId("r"), kind: "reply", time: now(), phase: "working" }) satisfies Reply

  function send() {
    if (!canSend) return
    const text = draft.trim()
    const canned = REPLIES[turn.current++ % REPLIES.length]
    const withFiles = ready.length > 0
    const line: Item = { id: nextId("u"), kind: "user", time: now(), text: text || "Here are my files.", files: ready }
    const answer = reply({
      working: withFiles ? `Opening ${ready.length === 1 ? "your file" : `${ready.length} files`}…` : canned.working,
      worked: withFiles ? `Opened ${ready.length === 1 ? ready[0].name : `${ready.length} files`}` : canned.worked,
      text: canned.text,
      thought: model === "deep" ? "They asked for something short. One clear rule beats a list." : undefined,
    })
    setFollow(true)
    setItems((list) => [...list, line, answer])
    setDraft("")
    setFiles((list) => list.filter((f) => f.state !== "done"))
  }

  function retry(id: string) {
    const answer = reply({
      working: "Rendering page 5…",
      worked: "Rendered page 5 · 3 thumbnails",
      text: "Done: three thumbnails, 600 px wide. The splash panel would make a strong cover.",
    })
    setFollow(true)
    setItems((list) => list.map((i) => (i.id === id ? answer : i)))
  }

  // The plan's answer lands right under the questionnaire; the page does not jump to the end for it.
  function planned(plan: Plan) {
    const answer = reply({
      working: "Drafting a page plan…",
      worked: `Drafted a plan · ${plan.pages}`,
      text: `A ${plan.pages.replace(" pages", "-page")} ${plan.genre.toLowerCase()} one-shot. Open on your hook in panel one and keep the reveal for the last spread.`,
    })
    setFollow(false)
    setItems((list) => {
      const at = list.findIndex((i) => i.kind === "plan") + 1
      return [...list.slice(0, at), answer, ...list.slice(at)]
    })
  }

  function switchModel(next: Model) {
    if (next === model) return
    const line: Item = { id: nextId("m"), kind: "marker", icon: next, text: next === "fast" ? "Switched to a faster model" : "Switched to the deep model" }
    setModel(next)
    setFollow(false)
    setItems((list) => [...list, line])
  }

  function newChat() {
    setFollow(false)
    setItems(FRESH.map((i) => (i.kind === "answer" ? { ...i, time: now() } : i)))
    setFiles([])
    setDraft("")
    setChat((n) => n + 1)
  }

  function attach() {
    const pick = POOL[files.length % POOL.length]
    setFiles((list) => [...list, { ...pick, id: nextId("f"), state: "uploading" }])
  }

  const finish = (id: string) =>
    setItems((list) => list.map((i) => (i.id === id && i.kind === "reply" && i.phase === "typing" ? { ...i, phase: "done" } : i)))

  function render(item: Item) {
    switch (item.kind) {
      case "marker":
        return item.icon ? (
          <Marker>
            <MarkerIcon>{item.icon === "fast" ? <ZapIcon /> : <BrainIcon />}</MarkerIcon>
            <MarkerContent>{item.text}</MarkerContent>
          </Marker>
        ) : (
          <Marker variant="separator">
            <MarkerContent>{item.text}</MarkerContent>
          </Marker>
        )
      case "user":
        return <User item={item} />
      case "answer":
        return <Answer item={item} />
      case "plan":
        return <PlanOffer time={item.time} onPlanned={planned} />
      case "error":
        return <Failure item={item} onRetry={() => retry(item.id)} />
      case "reply":
        return <ReplyLine item={item} onDone={() => finish(item.id)} />
    }
  }

  return (
    <div data-manga="ai-chat" className={cn("@container/main w-full bg-background text-foreground", className)}>
      <div ref={frameRef} className="flex flex-col @3xl/main:h-[48rem] @3xl/main:overflow-hidden">
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-[length:var(--mg-bw)] border-border px-3 py-2 @md/main:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden className="grid size-10 shrink-0 place-items-center ink-fill font-sfx text-xl">
              フ
            </span>
            <div className="min-w-0">
              <h2 className="font-letter text-2xl leading-none tracking-wide uppercase">Fude</h2>
              <p className="text-sm">Story assistant · {model === "deep" ? "deep model" : "fast model"}</p>
            </div>
          </div>
          <div className="ms-auto flex flex-wrap items-center gap-2">
            {/* Pressed buttons rather than a Toggle Group: its value API differs between Radix and Base UI. */}
            <ButtonGroup aria-label="Model">
              {(["deep", "fast"] as const).map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={model === m ? "default" : "outline"}
                  aria-pressed={model === m}
                  onClick={() => switchModel(m)}
                  className="max-sm:h-11"
                >
                  {m === "deep" ? <BrainIcon /> : <ZapIcon />}
                  {m === "deep" ? "Deep" : "Fast"}
                </Button>
              ))}
            </ButtonGroup>
            <Button variant="outline" size="sm" onClick={newChat} className="max-sm:h-11">
              <PlusIcon />
              New chat
            </Button>
          </div>
        </header>

        <MessageScrollerProvider key={chat} defaultScrollPosition="end">
          <MessageScroller className="@3xl/main:min-h-0 @3xl/main:flex-1">
            <MessageScrollerViewport className="px-3 py-5 @md/main:px-5">
              <MessageScrollerContent>
                {items.map((item) => (
                  <MessageScrollerItem
                    key={item.id}
                    messageId={item.id}
                    // a short conversation: every line is painted, so "scroll to the end" lands on the real end
                    // (and on phones, with no inner scroller, the page never shows blank placeholders)
                    className="[content-visibility:visible]!"
                  >
                    {render(item)}
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
          <FollowEnd signal={follow ? `${items.length}:${pendingKey}` : ""} />
        </MessageScrollerProvider>

        <form
          ref={composerRef}
          aria-label="Write to Fude"
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="z-10 grid gap-2 border-t-[length:var(--mg-bw)] border-border bg-background p-3 @md/main:px-4"
        >
          {files.length > 0 && (
            <AttachmentGroup aria-label="Files to send">
              {files.map((f) => (
                <FileChip key={f.id} file={f} onRemove={() => setFiles((list) => list.filter((x) => x.id !== f.id))} />
              ))}
            </AttachmentGroup>
          )}
          <div className="flex items-end gap-2">
            <Button type="button" variant="outline" size="icon" aria-label="Attach a file" onClick={attach} className="shrink-0 max-sm:size-11">
              <PaperclipIcon />
            </Button>
            <Textarea
              aria-label="Message"
              placeholder="Ask about your manga…"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault()
                  send()
                }
              }}
              className="max-h-40 min-h-10! min-w-0 flex-1"
            />
            <Button type="submit" size="icon" aria-label="Send" loading={busy} disabled={!canSend} className="shrink-0 max-sm:size-11">
              <ArrowUpIcon />
            </Button>
          </div>
          <p className="flex flex-wrap items-center gap-1 text-xs max-sm:hidden">
            <Kbd>Enter</Kbd> to send · <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> for a new line
          </p>
        </form>
      </div>
    </div>
  )
}
