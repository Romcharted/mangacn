"use client"

/*
 * Sign in — a two-step sign-in made only with mangacn. A big manga Panel on the start side (a reader drawn in
 * SVG, focus SpeedLines around her, a SpeechBubble that reacts to each step, Sfx lettering) and the form on
 * the end side; on phones the panel shrinks to a short banner above the form. Step 1: email and password
 * (Field, Input, Checkbox, a Button with its loading state), a divider, a link to sign up. Step 2: a one-time
 * code (InputOTP, 6 digits) with a resend link that counts down; the code "000000" shows the error look.
 * No network: everything is simulated and nothing navigates. Container queries (`@container/main`) widen it.
 */
import * as React from "react"

import { Button } from "@/components/ui/manga/button"
import { Checkbox } from "@/components/ui/manga/checkbox"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/manga/field"
import { Input } from "@/components/ui/manga/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/manga/input-otp"
import { Panel, PanelCaption } from "@/components/manga/panel"
import { Sfx } from "@/components/manga/sfx"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { SpeedLines } from "@/components/manga/speed-lines"
import { cn } from "cn"

type Step = "account" | "code" | "done"
type Errors = { email?: string; password?: string }

const WAIT = 30
const WRONG_CODE = "000000"

const BUBBLE: Record<Step, string> = {
  account: "Welcome back! Your shelf missed you.",
  code: "A code? Quick, check your inbox!",
  done: "You're in! Three new chapters wait.",
}

const noNav = (e: React.MouseEvent) => e.preventDefault()
const touch = "max-sm:min-h-11"
const link = "font-letter text-sm tracking-wide uppercase hover-underline focus-ink inline-flex items-center"

function validate(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!email.trim()) errors.email = "Enter your email address."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "That address is missing its @ or its domain."
  if (password.length < 8) errors.password = "Passwords here have 8 characters at least."
  return errors
}

/** A reader holding an open volume, drawn for this block: ink lines, paper fills, a screentone jacket. */
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
        {/* hair behind the head */}
        <path d="M52 108C44 62 70 36 102 36s58 26 48 72l-4 22H56z" fill="currentColor" />
        {/* neck and jacket */}
        <path d="M88 132v28h24v-28z" fill="var(--background)" />
        <path d="M12 224c6-46 40-66 88-66s82 20 88 66z" fill={`url(#${id})`} />
        <path d="M78 159l22 28 22-28z" fill="var(--background)" />
        {/* head, fringe, face */}
        <ellipse cx="100" cy="100" rx="38" ry="44" fill="var(--background)" />
        <path
          d="M60 98C57 62 78 46 100 46s43 16 40 52l-10-16-8 12-10-16-10 16-10-16-10 16-10-16z"
          fill="currentColor"
        />
        <path d="M76 97l17 3M124 97l-17 3" />
        <path d="M94 127q6 6 12 0" strokeWidth="2.5" />
        <path d="M70 121l5-5M76 122l5-5M119 122l5-5M125 121l5-5" strokeWidth="1.5" />
      </g>
      <ellipse cx="86" cy="109" rx="5" ry="8" fill="currentColor" />
      <ellipse cx="114" cy="109" rx="5" ry="8" fill="currentColor" />
      <circle cx="88" cy="105" r="1.8" fill="var(--background)" />
      <circle cx="116" cy="105" r="1.8" fill="var(--background)" />
      {/* the open volume */}
      <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
        <path d="M46 206l54-12 54 12v18l-54-12-54 12z" fill="var(--background)" />
        <path d="M100 194v18" />
        <path d="M58 208l32-7M58 214l32-7M110 201l32 7M110 207l32 7" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

export function SignIn({ className }: { className?: string }) {
  const uid = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const [step, setStep] = React.useState<Step>("account")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [tried, setTried] = React.useState(false)
  const [busy, setBusy] = React.useState(false)

  const [code, setCode] = React.useState("")
  const [codeError, setCodeError] = React.useState<string | null>(null)
  const [wait, setWait] = React.useState(WAIT)
  const [notice, setNotice] = React.useState("")

  const errors = tried ? validate(email, password) : {}

  React.useEffect(() => () => clearTimeout(timer.current), [])

  // The resend countdown: one tick per second while the code step is shown.
  React.useEffect(() => {
    if (step !== "code" || wait <= 0) return
    const id = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(id)
  }, [step, wait])

  /** After a step change, move the caret or the reader to the right place. */
  const focusSoon = (selector: string) =>
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(selector)?.focus())

  const signIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setTried(true)
    if (Object.keys(validate(email, password)).length) {
      focusSoon("[aria-invalid=true]")
      return
    }
    setBusy(true)
    timer.current = setTimeout(() => {
      setBusy(false)
      setCode("")
      setCodeError(null)
      setWait(WAIT)
      setNotice("")
      setStep("code")
    }, 900)
  }

  const verify = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (code.length < 6) {
      setCodeError("Enter all six digits of the code.")
      focusSoon("[data-manga=input-otp]")
      return
    }
    setBusy(true)
    timer.current = setTimeout(() => {
      setBusy(false)
      if (code === WRONG_CODE) {
        setCodeError("That code does not match. Check the latest email and try again.")
        focusSoon("[data-manga=input-otp]")
        return
      }
      setStep("done")
      focusSoon(`[id="${uid}-title"]`)
    }, 700)
  }

  const resend = () => {
    setWait(WAIT)
    setCode("")
    setCodeError(null)
    setNotice(`A new code is on its way to ${email.trim()}.`)
    focusSoon("[data-manga=input-otp]")
  }

  const back = () => {
    clearTimeout(timer.current)
    setBusy(false)
    setStep("account")
    focusSoon(`[id="${uid}-email"]`)
  }

  const signOut = () => {
    setPassword("")
    setTried(false)
    setStep("account")
    focusSoon(`[id="${uid}-title"]`)
  }

  const clock = `0:${String(wait).padStart(2, "0")}`

  return (
    <div
      ref={rootRef}
      data-manga="sign-in"
      className={cn("@container/main w-full bg-background text-foreground", className)}
    >
      <div className="grid gap-5 p-3 @md/main:p-6 @3xl/main:min-h-[40rem] @3xl/main:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @3xl/main:gap-8">
        {/* Start side: the panel. A short banner on phones, a full-height panel when the block is wide. */}
        <aside aria-label="Inkwell" className="grid">
          <Panel className="h-40 @md/main:h-52 @3xl/main:h-auto @3xl/main:min-h-[36rem]">
            <SpeedLines
              variant="focus"
              originX={76}
              originY={48}
              hole={0.42}
              density={0.45}
              className="absolute! inset-0 @3xl/main:hidden"
            />
            <SpeedLines
              variant="focus"
              originX={60}
              originY={56}
              hole={0.5}
              density={0.55}
              seed={23}
              className="absolute! inset-0 hidden @3xl/main:block"
            />
            <Reader className="absolute end-3 bottom-0 h-[92%] @3xl/main:end-[6%] @3xl/main:h-[64%]" />
            <SpeechBubble
              key={step}
              tail="bottom"
              tailAlign="end"
              className="absolute! start-3 top-3 max-w-[50%]! animate-pop px-4! py-2.5! text-sm! @md/main:text-base! @3xl/main:start-8 @3xl/main:top-8 @3xl/main:max-w-[16rem]! @3xl/main:px-7! @3xl/main:py-5! @3xl/main:text-xl!"
            >
              {BUBBLE[step]}
            </SpeechBubble>
            <Sfx size="lg" rotate={-12} className="absolute! top-[42%] start-[8%] hidden @3xl/main:block">
              {step === "done" ? "パッ" : "ドキッ"}
            </Sfx>
            <PanelCaption position="bottom-start" className="hidden @3xl/main:block">
              Inkwell · Chapter 1: the return
            </PanelCaption>
          </Panel>
        </aside>

        {/* End side: the form, on paper on phones, in a case when there is room. */}
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
              <span className="font-mono text-xs">
                {step === "account" ? "Step 1 of 2" : step === "code" ? "Step 2 of 2" : "Signed in"}
              </span>
            </div>
            <h1
              id={`${uid}-title`}
              tabIndex={-1}
              className="font-letter text-4xl leading-none tracking-wide uppercase outline-none"
            >
              {step === "account" ? "Sign in" : step === "code" ? "Check your inbox" : "You're in"}
            </h1>
            {step === "account" && <p>Pick up your series where you left them.</p>}
            {step === "code" && (
              <p>
                We sent a six-digit code to <strong className="font-bold break-words">{email.trim()}</strong>.
              </p>
            )}
          </header>

          {step === "account" && (
            <form noValidate onSubmit={signIn} aria-label="Sign in with your email" className="grid gap-6">
              <FieldGroup>
                <Field data-invalid={errors.email ? "true" : undefined}>
                  <FieldLabel htmlFor={`${uid}-email`}>Email</FieldLabel>
                  <Input
                    id={`${uid}-email`}
                    type="email"
                    autoComplete="email"
                    placeholder="you@studio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    className="max-sm:h-11"
                  />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </Field>
                <Field data-invalid={errors.password ? "true" : undefined}>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor={`${uid}-password`}>Password</FieldLabel>
                    <a href="#" onClick={noNav} className={cn(link, "normal-case", touch)}>
                      Forgot it?
                    </a>
                  </div>
                  <Input
                    id={`${uid}-password`}
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={errors.password ? true : undefined}
                    className="max-sm:h-11"
                  />
                  {errors.password ? (
                    <FieldError>{errors.password}</FieldError>
                  ) : (
                    <FieldDescription>Demo: any email, any password of 8 characters.</FieldDescription>
                  )}
                </Field>
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
                  Keep me signed in for 30 days
                </label>
              </FieldGroup>
              <Button type="submit" size="lg" fullWidth loading={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
              <FieldSeparator>New here?</FieldSeparator>
              <p className="text-center">
                <a href="#" onClick={noNav} className={cn(link, "text-base", touch)}>
                  Create a free account
                </a>
              </p>
            </form>
          )}

          {step === "code" && (
            <form noValidate onSubmit={verify} aria-label="Enter the one-time code" className="grid gap-6">
              <Field data-invalid={codeError ? "true" : undefined}>
                <FieldLabel htmlFor={`${uid}-code`}>One-time code</FieldLabel>
                <InputOTP
                  id={`${uid}-code`}
                  maxLength={6}
                  pattern="^\d+$"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  value={code}
                  onChange={(v) => {
                    setCode(v)
                    setCodeError(null)
                  }}
                  aria-invalid={codeError ? true : undefined}
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {codeError ? (
                  <FieldError>{codeError}</FieldError>
                ) : (
                  <FieldDescription>Demo: any six digits work, except 000000.</FieldDescription>
                )}
              </Field>
              <Button type="submit" size="lg" fullWidth loading={busy}>
                {busy ? "Checking…" : "Verify and sign in"}
              </Button>
              <div className="grid gap-1">
                {/* Only the resend notice is announced, not every tick of the countdown. */}
                <p aria-live="polite" className="text-sm">
                  {notice}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-x-4">
                  {wait > 0 ? (
                    <span className={cn("inline-flex items-center gap-1 font-letter text-sm tracking-wide uppercase", touch)}>
                      Resend in <span className="font-mono tabular-nums">{clock}</span>
                    </span>
                  ) : (
                    <Button type="button" variant="link" onClick={resend} className={touch}>
                      Resend code
                    </Button>
                  )}
                  <Button type="button" variant="link" onClick={back} className={touch}>
                    Use another email
                  </Button>
                </div>
              </div>
            </form>
          )}

          {step === "done" && (
            <div className="grid justify-items-start gap-5">
              <span aria-hidden className="mark-check text-6xl" />
              <p>
                Three new chapters landed on your shelf since your last visit.
                {remember ? " This device stays signed in for 30 days." : " You will be signed out when you close the tab."}
              </p>
              <Button variant="outline" onClick={signOut} className={touch}>
                Sign out
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
