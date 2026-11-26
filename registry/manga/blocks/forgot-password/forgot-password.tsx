"use client"

/*
 * Forgot password — the recovery screen of the mangacn auth flow, made only with the kit. A manga Panel (the
 * reader drawn whole in SVG, a sweat drop, focus SpeedLines, a SpeechBubble and an Sfx "ハッ" that react to the
 * state) sits on the start side of the form from 48rem of container width, and above it in 4:3 when narrower.
 * The form: email, a Send code Button with its loading state, and a link back to sign in.
 * States: field errors (empty or invalid email), an unknown email (demo: an address containing "unknown") as a
 * jagged accent box that shakes (G8), loading (Button `loading`, the field stays enabled), success as a Stamp
 * "Sent!" with the next step. No network; links call `onNavigate` and never navigate.
 */
import * as React from "react"

import { Button } from "@/components/ui/manga/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/manga/field"
import { Input } from "@/components/ui/manga/input"
import { Manpu } from "@/components/manga/manpu"
import { Panel } from "@/components/manga/panel"
import { Sfx } from "@/components/manga/sfx"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { SpeedLines } from "@/components/manga/speed-lines"
import { Stamp } from "@/components/manga/stamp"
import { cn } from "cn"

export type AuthScreen = "sign-in" | "sign-up" | "forgot-password" | "verify-code" | "reset-password"

export type ForgotPasswordProps = {
  className?: string
  /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */
  titleAs?: "h1" | "h2"
  /** Called by the links and the next-step button. Without it they do nothing (the block never navigates). */
  onNavigate?: (screen: AuthScreen) => void
}

type Mood = "idle" | "error" | "done"

const LINE: Record<Mood, string> = {
  idle: "Forgot it? It happens.",
  error: "Huh?!",
  done: "Yes!",
}

const touch = "max-sm:min-h-11"
const link = "inline-flex items-center font-letter text-sm tracking-wide uppercase hover-underline focus-ink"

function validate(email: string): string | undefined {
  if (!email.trim()) return "Enter the email address of your account."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "That address is missing its @ or its domain."
}

/** The reader of the auth flow, drawn whole for this block: caught off guard, the volume lowered. */
function Reader({ className }: { className?: string }) {
  const id = `tone-${React.useId().replace(/[^\w-]/g, "")}`
  return (
    <svg aria-hidden viewBox="0 0 200 224" className={cn("text-foreground", className)} fill="none">
      <defs>
        <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="currentColor" />
          <circle cx="4.5" cy="4.5" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M52 108C44 62 70 36 102 36s58 26 48 72l-4 22H56z" fill="currentColor" />
        <path d="M88 132v28h24v-28z" fill="var(--background)" />
        <path d="M12 222c6-46 40-64 88-64s82 18 88 64z" fill={`url(#${id})`} />
        <path d="M78 159l22 28 22-28z" fill="var(--background)" />
        <ellipse cx="100" cy="100" rx="38" ry="44" fill="var(--background)" />
        <path
          d="M60 98C57 62 78 46 100 46s43 16 40 52l-10-16-8 12-10-16-10 16-10-16-10 16-10-16z"
          fill="currentColor"
        />
        {/* worried brows, a small round mouth */}
        <path d="M76 95q8 2 16-4M124 95q-8 2-16-4" />
        <ellipse cx="100" cy="128" rx="4" ry="5" strokeWidth="2.5" fill="var(--background)" />
        <path d="M70 121l5-5M76 122l5-5M119 122l5-5M125 121l5-5" strokeWidth="1.5" />
      </g>
      {/* wide eyes: rings with small pupils */}
      <g stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="86" cy="109" rx="6" ry="8" fill="var(--background)" />
        <ellipse cx="114" cy="109" rx="6" ry="8" fill="var(--background)" />
      </g>
      <circle cx="86" cy="110" r="2.5" fill="currentColor" />
      <circle cx="114" cy="110" r="2.5" fill="currentColor" />
      {/* the volume, lowered and tilted */}
      <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M52 206l50-16 50 8v18l-50-8-50 16z" fill="var(--background)" />
        <path d="M102 190v18" />
        <path d="M64 206l28-9M64 212l28-9M112 197l30 5M112 203l30 5" strokeWidth="1.5" />
        <ellipse cx="52" cy="214" rx="9" ry="7" fill="var(--background)" />
        <ellipse cx="152" cy="208" rx="9" ry="7" fill="var(--background)" />
      </g>
    </svg>
  )
}

/** The picture: 4:3 above the form, full height beside it from 48rem of container width. */
function Scene({ mood }: { mood: Mood }) {
  return (
    <aside aria-label="Inkwell" className="grid">
      <Panel className="aspect-[4/3] [@media(orientation:landscape)_and_(max-height:32rem)]:aspect-auto [@media(orientation:landscape)_and_(max-height:32rem)]:h-[80svh] w-full @3xl/main:aspect-auto @3xl/main:h-full @3xl/main:min-h-[36rem]">
        <SpeedLines variant="focus" originX={68} originY={52} hole={0.4} density={0.5} seed={5} className="absolute! inset-0 @3xl/main:hidden" />
        <SpeedLines
          variant="focus"
          originX={60}
          originY={64}
          hole={0.46}
          density={0.55}
          seed={17}
          className="absolute! inset-0 hidden @3xl/main:block"
        />
        <div className="absolute end-[4%] bottom-0 aspect-[200/224] h-[86%] @3xl/main:end-[6%] @3xl/main:h-[58%]">
          <Reader className="size-full" />
          {mood === "done" ? (
            <Manpu kind="sparkle" size="26%" className="absolute! -top-[2%] end-[0%]" />
          ) : (
            <Manpu kind={mood === "error" ? "surprise" : "sweat"} size="26%" className="absolute! top-[2%] end-[2%]" />
          )}
        </div>
        <SpeechBubble
          key={mood}
          variant={mood === "error" ? "shout" : "speech"}
          tail="bottom"
          tailAlign="end"
          className="absolute! start-3 top-3 max-w-[50%]! animate-pop px-4! py-2.5! text-sm! @md/main:text-base! @3xl/main:start-8 @3xl/main:top-8 @3xl/main:max-w-[16rem]! @3xl/main:px-7! @3xl/main:py-5! @3xl/main:text-xl!"
        >
          {LINE[mood]}
        </SpeechBubble>
        <Sfx size="md" rotate={-14} className="absolute! start-[7%] bottom-[10%] @3xl/main:hidden">
          ハッ
        </Sfx>
        <Sfx size="xl" rotate={-14} className="absolute! start-[8%] top-[22%] hidden @3xl/main:block">
          ハッ
        </Sfx>
      </Panel>
    </aside>
  )
}

/** A server error (G8): a jagged accent edge, a "!" mark, a shake when it appears, announced as an alert. */
function ErrorBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="alert" data-manga="auth-error" className="relative animate-shake p-2">
      <span aria-hidden className="absolute inset-0 edge-jagged bg-destructive" />
      <div className="relative grid gap-1 bg-background py-3 ps-4 mark-error">
        <p className="font-letter text-lg leading-tight tracking-wide uppercase">{title}</p>
        <p>{children}</p>
      </div>
    </div>
  )
}

export function ForgotPassword({ className, titleAs: TitleTag = "h1", onNavigate }: ForgotPasswordProps) {
  const uid = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const [email, setEmail] = React.useState("")
  const [tried, setTried] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  /** Failed attempts: a new key replays the shake and the alert. */
  const [failures, setFailures] = React.useState(0)
  const [unknown, setUnknown] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const emailError = (tried ? validate(email) : undefined) ?? (unknown ? "No account uses this email." : undefined)
  const mood: Mood = sent ? "done" : failures > 0 || emailError ? "error" : "idle"

  const go = (screen: AuthScreen) => (e: React.MouseEvent) => {
    e.preventDefault()
    onNavigate?.(screen)
  }
  const focusSoon = (selector: string) =>
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(selector)?.focus())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setTried(true)
    if (validate(email)) {
      focusSoon(`[id="${uid}-email"]`)
      return
    }
    setBusy(true)
    timer.current = setTimeout(() => {
      setBusy(false)
      if (/unknown/i.test(email)) {
        setFailures((n) => n + 1)
        setUnknown(true)
        focusSoon(`[id="${uid}-email"]`)
        return
      }
      setFailures(0)
      setSent(true)
      focusSoon(`[id="${uid}-title"]`)
    }, 900)
  }

  const restart = () => {
    setSent(false)
    setTried(false)
    setUnknown(false)
    focusSoon(`[id="${uid}-email"]`)
  }

  return (
    <div ref={rootRef} data-manga="forgot-password" className={cn("@container/main w-full bg-background text-foreground", className)}>
      <div className="grid gap-5 p-3 @md/main:p-6 @3xl/main:min-h-[40rem] @3xl/main:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @3xl/main:gap-8">
        <Scene mood={mood} />

        <section
          aria-labelledby={`${uid}-title`}
          className="relative grid content-start gap-6 @md/main:mx-auto @md/main:w-full @md/main:max-w-md @md/main:ink-case @md/main:p-8 @3xl/main:self-center"
        >
          <header className="grid gap-3">
            <span className="flex items-center gap-2">
              <span aria-hidden className="grid size-8 shrink-0 place-items-center ink-fill font-sfx text-sm">
                イ
              </span>
              <span className="font-letter text-xl leading-none tracking-wide uppercase">Inkwell</span>
            </span>
            <TitleTag id={`${uid}-title`} tabIndex={-1} className="font-letter text-4xl leading-none tracking-wide uppercase outline-none">
              {sent ? "Check your inbox" : "Forgot password"}
            </TitleTag>
            {!sent && <p>Enter the email of your account. We will send you a code to choose a new password.</p>}
          </header>

          {sent ? (
            <div className="grid justify-items-start gap-5">
              <Stamp aria-hidden rotate={-8} className="text-3xl!">
                Sent!
              </Stamp>
              <p>
                A six-digit code is on its way to <strong className="font-bold break-words">{email.trim()}</strong>. It stays
                valid for 15 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Button size="lg" onClick={() => onNavigate?.("verify-code")}>
                  Enter the code
                </Button>
                <Button variant="link" onClick={restart} className={touch}>
                  Use another email
                </Button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={submit} aria-label="Get a code to reset your password" className="grid gap-6">
              {failures > 0 && (
                <ErrorBox key={failures} title="Unknown email">
                  No account uses this address. Check its spelling, or create an account.
                </ErrorBox>
              )}
              <Field data-invalid={emailError ? "true" : undefined}>
                <FieldLabel htmlFor={`${uid}-email`}>Email</FieldLabel>
                <Input
                  id={`${uid}-email`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@studio.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setUnknown(false)
                  }}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={`${uid}-email-note`}
                  className="max-sm:h-11"
                />
                {emailError ? (
                  <FieldError id={`${uid}-email-note`}>{emailError}</FieldError>
                ) : (
                  <FieldDescription id={`${uid}-email-note`}>Demo: an address containing “unknown” has no account.</FieldDescription>
                )}
              </Field>
              <Button type="submit" size="lg" fullWidth loading={busy}>
                {busy ? "Sending…" : "Send code"}
              </Button>
              <p className="text-center">
                <a href="#" onClick={go("sign-in")} className={cn(link, "text-base", touch)}>
                  ← Back to sign in
                </a>
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
