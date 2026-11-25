"use client"

/*
 * Verify code — the one-time code screen of the auth flow, made only with mangacn. A manga Panel (the reader
 * drawn whole in SVG, holding the email that just arrived, focus SpeedLines around her, a SpeechBubble that
 * reacts to each state, "ピコン" Sfx) sits on the start side when the block is 48rem wide, and above the form
 * in 4:3 on phones. The form: InputOTP (one group of 6 digits), a Button with its loading state, a resend link
 * after a 30 s countdown (only the end is announced) and "Use another email".
 * Gestures: G1 case around the form, G8 error box (accent fill, edge-jagged, "!" mark, shake, role=alert) for
 * the wrong code "000000" with the InputOTP invalid look, G5 the Stamp landing on success.
 * `purpose` changes the copy and the next screen. No network: the check is simulated and nothing navigates
 * unless you pass onNavigate. Container queries (`@container/main`) widen it.
 */
import * as React from "react"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/manga/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/manga/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/manga/input-otp"
import { Panel, PanelCaption } from "@/components/manga/panel"
import { Sfx } from "@/components/manga/sfx"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { SpeedLines } from "@/components/manga/speed-lines"
import { Stamp } from "@/components/manga/stamp"
import { cn } from "cn"

export type AuthScreen = "sign-in" | "sign-up" | "forgot-password" | "verify-code" | "reset-password"
export type VerifyPurpose = "sign-in" | "sign-up" | "reset"

export type VerifyCodeProps = {
  className?: string
  /** Called by the links and the next-step button. Without it they do nothing. */
  onNavigate?: (screen: AuthScreen) => void
  /** What the code confirms: changes the copy and the next screen. */
  purpose?: VerifyPurpose
  /** The address the code was sent to. */
  email?: string
  /** Called by the button shown once a sign-in or sign-up code is accepted. */
  onContinue?: () => void
}

type Mood = "idle" | "error" | "success"

const WAIT = 30
const WRONG_CODE = "000000"
const SLOTS = [0, 1, 2, 3, 4, 5]

const COPY: Record<
  VerifyPurpose,
  { step: string; title: string; lead: string; submit: string; stamp: string; doneStep: string; doneTitle: string; doneText: string; next: string; back: AuthScreen }
> = {
  "sign-in": {
    step: "Step 2 of 2",
    title: "Check your inbox",
    lead: "We sent a six-digit code to",
    submit: "Verify and sign in",
    stamp: "Welcome back!",
    doneStep: "Signed in",
    doneTitle: "You're in",
    doneText: "Three new chapters landed on your shelf since your last visit.",
    next: "Open my shelf",
    back: "sign-in",
  },
  "sign-up": {
    step: "Step 2 of 2",
    title: "Confirm your email",
    lead: "To finish your account, enter the six-digit code we sent to",
    submit: "Verify and create account",
    stamp: "Welcome!",
    doneStep: "Account ready",
    doneTitle: "Your shelf is ready",
    doneText: "It is empty for now: every series starts with a free first chapter.",
    next: "Find a first series",
    back: "sign-up",
  },
  reset: {
    step: "Step 2 of 3",
    title: "Enter your code",
    lead: "To choose a new password, enter the six-digit code we sent to",
    submit: "Verify code",
    stamp: "Verified!",
    doneStep: "Step 2 of 3",
    doneTitle: "Code accepted",
    doneText: "One last step: choose a new password for your account.",
    next: "Choose a new password",
    back: "forgot-password",
  },
}

const BUBBLE: Record<Mood, string> = {
  idle: "Check your inbox!",
  error: "Huh?!",
  success: "Yes!",
}

const touch = "max-sm:min-h-11"

/** The reader of the auth flow, drawn whole (bust and hands' prop), holding the email that just arrived. */
function Reader({ mood, className }: { mood: Mood; className?: string }) {
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
        {/* hair behind the head */}
        <path d="M52 108C44 62 70 36 102 36s58 26 48 72l-4 22H56z" fill="currentColor" />
        {/* neck and jacket */}
        <path d="M88 132v28h24v-28z" fill="var(--background)" />
        <path d="M12 222c6-46 40-64 88-64s82 18 88 64z" fill={`url(#${id})`} />
        <path d="M78 159l22 28 22-28z" fill="var(--background)" />
        {/* head, fringe */}
        <ellipse cx="100" cy="100" rx="38" ry="44" fill="var(--background)" />
        <path
          d="M60 98C57 62 78 46 100 46s43 16 40 52l-10-16-8 12-10-16-10 16-10-16-10 16-10-16z"
          fill="currentColor"
        />
        {/* brows, mouth, blush: they follow the mood */}
        {mood === "error" ? (
          <path d="M76 92l17-4M124 92l-17-4" />
        ) : (
          <path d="M76 97l17 3M124 97l-17 3" />
        )}
        {mood === "success" ? (
          <path d="M91 124q9 11 18 0z" fill="var(--background)" strokeWidth="2.5" />
        ) : mood === "error" ? (
          <ellipse cx="100" cy="127" rx="4" ry="5" fill="var(--background)" strokeWidth="2.5" />
        ) : (
          <path d="M94 127q6 6 12 0" strokeWidth="2.5" />
        )}
        <path d="M70 121l5-5M76 122l5-5M119 122l5-5M125 121l5-5" strokeWidth="1.5" />
        {mood === "error" && <path d="M146 74q7 9 0 14q-7-5 0-14z" fill="var(--background)" strokeWidth="2" />}
        {mood === "success" && <path d="M79 111q7-9 14 0M107 111q7-9 14 0" />}
      </g>
      {mood === "idle" && (
        <>
          <ellipse cx="86" cy="109" rx="5" ry="8" fill="currentColor" />
          <ellipse cx="114" cy="109" rx="5" ry="8" fill="currentColor" />
          <circle cx="88" cy="105" r="1.8" fill="var(--background)" />
          <circle cx="116" cy="105" r="1.8" fill="var(--background)" />
        </>
      )}
      {mood === "error" && (
        <>
          <circle cx="86" cy="109" r="3.5" fill="currentColor" />
          <circle cx="114" cy="109" r="3.5" fill="currentColor" />
        </>
      )}
      {/* the email that just arrived, held up with both hands */}
      <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M54 182h92v40H54z" fill="var(--background)" />
        <path d="M54 182l46 24 46-24" />
        <path d="M44 196q10-6 14 4v14q-8 6-14-2z M156 196q-10-6-14 4v14q8 6 14-2z" fill="var(--background)" />
        <path d="M150 170l8-8M156 176l10-2M144 166l2-10" strokeWidth="2.5" />
      </g>
    </svg>
  )
}

/** G8: an accent box with a jagged edge, a "!" mark and a shake, announced as an alert. */
function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="relative isolate flex animate-shake items-center gap-3 p-4 text-primary-foreground before:absolute before:inset-0 before:-z-10 before:bg-destructive before:content-[''] before:edge-jagged"
    >
      <span aria-hidden className="block size-8 shrink-0 bg-background mark-error" />
      <p className="min-w-0">{children}</p>
    </div>
  )
}

export function VerifyCode({
  className,
  onNavigate,
  purpose = "sign-in",
  email = "mika@inkwell.app",
  onContinue,
}: VerifyCodeProps) {
  const uid = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const copy = COPY[purpose]

  const [done, setDone] = React.useState(false)
  const [code, setCode] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [fieldError, setFieldError] = React.useState<string | null>(null)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [wait, setWait] = React.useState(WAIT)
  const [notice, setNotice] = React.useState("")

  React.useEffect(() => () => clearTimeout(timer.current), [])

  // The resend countdown: one tick per second; only its end is announced.
  React.useEffect(() => {
    if (done) return
    if (wait <= 0) {
      setNotice("You can ask for a new code now.")
      return
    }
    const id = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(id)
  }, [done, wait])

  const focusSoon = (selector: string) =>
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(selector)?.focus())

  const check = (value: string) => {
    if (busy) return
    if (value.length < 6) {
      setFieldError("Enter all six digits of the code.")
      focusSoon("[data-manga=input-otp]")
      return
    }
    setBusy(true)
    timer.current = setTimeout(() => {
      setBusy(false)
      if (value === WRONG_CODE) {
        setServerError("That code does not match. Check the latest email, or ask for a new code.")
        focusSoon("[data-manga=input-otp]")
        return
      }
      setDone(true)
      focusSoon(`[id="${uid}-title"]`)
    }, 800)
  }

  const resend = () => {
    setWait(WAIT)
    setCode("")
    setFieldError(null)
    setServerError(null)
    setNotice(`A new code is on its way to ${email}.`)
    focusSoon("[data-manga=input-otp]")
  }

  const go = (screen: AuthScreen) => (e: React.MouseEvent) => {
    e.preventDefault()
    onNavigate?.(screen)
  }

  const mood: Mood = done ? "success" : serverError ? "error" : "idle"
  const invalid = Boolean(fieldError || serverError)
  const clock = `0:${String(wait).padStart(2, "0")}`

  return (
    <div
      ref={rootRef}
      data-manga="verify-code"
      className={cn("@container/main w-full overflow-x-clip bg-background text-foreground", className)}
    >
      <div className="grid gap-5 p-3 @md/main:p-6 @3xl/main:min-h-[40rem] @3xl/main:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @3xl/main:gap-8">
        {/* Start side: the panel. 4:3 above the form on phones, full height beside it when the block is wide. */}
        <aside aria-label="Inkwell" className="grid @md/main:mx-auto @md/main:w-full @md/main:max-w-md @3xl/main:max-w-none">
          <Panel className="aspect-[4/3] @3xl/main:aspect-auto @3xl/main:min-h-[36rem]">
            <SpeedLines
              variant="focus"
              originX={66}
              originY={54}
              hole={0.5}
              density={0.45}
              seed={31}
              className="absolute! inset-0 @3xl/main:hidden"
            />
            <SpeedLines
              variant="focus"
              originX={58}
              originY={64}
              hole={0.5}
              density={0.55}
              seed={31}
              className="absolute! inset-0 hidden @3xl/main:block"
            />
            <Reader
              mood={mood}
              className="absolute end-[4%] bottom-0 h-[84%] @3xl/main:end-[6%] @3xl/main:h-[62%]"
            />
            <SpeechBubble
              key={mood}
              variant={mood === "error" ? "shout" : "speech"}
              tail="bottom"
              tailAlign="end"
              className="absolute! start-3 top-3 max-w-[46%]! animate-pop px-4! py-2.5! text-sm! @md/main:text-base! @3xl/main:start-8 @3xl/main:top-8 @3xl/main:max-w-[16rem]! @3xl/main:px-7! @3xl/main:py-5! @3xl/main:text-xl!"
            >
              {BUBBLE[mood]}
            </SpeechBubble>
            <Sfx
              rotate={-12}
              className="absolute! start-4 bottom-4 @3xl/main:start-[8%] @3xl/main:top-[40%] @3xl/main:bottom-auto @3xl/main:text-5xl!"
            >
              ピコン
            </Sfx>
            <PanelCaption position="bottom-start" className="hidden @3xl/main:block">
              Inkwell · Chapter 2: the code
            </PanelCaption>
          </Panel>
        </aside>

        {/* End side: the form, on paper on phones, in a case (G1) when there is room. */}
        <section
          aria-labelledby={`${uid}-title`}
          className="relative grid content-start gap-6 @md/main:mx-auto @md/main:w-full @md/main:max-w-md @md/main:ink-case @md/main:p-8 @3xl/main:self-center"
        >
          <header className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span aria-hidden className="grid size-8 shrink-0 place-items-center ink-fill font-sfx text-sm">
                  イ
                </span>
                <span className="font-letter text-xl leading-none tracking-wide uppercase">Inkwell</span>
              </span>
              <span className="font-mono text-xs">{done ? copy.doneStep : copy.step}</span>
            </div>
            <h1
              id={`${uid}-title`}
              tabIndex={-1}
              className="font-letter text-4xl leading-none tracking-wide uppercase outline-none"
            >
              {done ? copy.doneTitle : copy.title}
            </h1>
            {!done && (
              <p className="flex flex-wrap items-center gap-x-2">
                <span>{copy.lead}</span>
                <span className="inline-flex min-w-0 items-center gap-1.5 font-bold break-all">
                  <Mail aria-hidden className="size-4 shrink-0" />
                  {email}
                </span>
              </p>
            )}
          </header>

          {done ? (
            <div className="grid justify-items-start gap-6">
              <Stamp className="ms-2 mt-2">{copy.stamp}</Stamp>
              <p>{copy.doneText}</p>
              <Button
                type="button"
                size="lg"
                fullWidth
                onClick={() => (purpose === "reset" ? onNavigate?.("reset-password") : onContinue?.())}
              >
                {copy.next}
              </Button>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                check(code)
              }}
              aria-label="Enter the one-time code"
              className="grid gap-6"
            >
              {serverError && <ErrorBox>{serverError}</ErrorBox>}
              <Field data-invalid={invalid ? "true" : undefined}>
                <FieldLabel htmlFor={`${uid}-code`}>One-time code</FieldLabel>
                <InputOTP
                  id={`${uid}-code`}
                  maxLength={6}
                  pattern="^\d+$"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(v) => {
                    setCode(v)
                    setFieldError(null)
                    setServerError(null)
                  }}
                  onComplete={check}
                  aria-invalid={invalid ? true : undefined}
                  aria-describedby={`${uid}-code-help`}
                >
                  <InputOTPGroup>
                    {SLOTS.map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {fieldError ? (
                  <FieldError id={`${uid}-code-help`}>{fieldError}</FieldError>
                ) : (
                  <FieldDescription id={`${uid}-code-help`}>Demo: any six digits work, except 000000.</FieldDescription>
                )}
              </Field>
              <Button type="submit" size="lg" fullWidth loading={busy}>
                {busy ? "Checking…" : copy.submit}
              </Button>
              <div className="grid gap-1">
                {/* Announced: the end of the countdown and the resend, never each tick. */}
                <p aria-live="polite" className="text-sm">
                  {notice}
                </p>
                {/* pe-4: the link buttons' invisible impact lines must not push past the edge */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 pe-4">
                  {wait > 0 ? (
                    <span className={cn("inline-flex items-center gap-1 font-letter text-sm tracking-wide uppercase", touch)}>
                      Resend in <span className="font-mono tabular-nums">{clock}</span>
                    </span>
                  ) : (
                    <Button type="button" variant="link" onClick={resend} className={touch}>
                      Resend code
                    </Button>
                  )}
                  <Button type="button" variant="link" onClick={go(copy.back)} className={touch}>
                    Use another email
                  </Button>
                </div>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
