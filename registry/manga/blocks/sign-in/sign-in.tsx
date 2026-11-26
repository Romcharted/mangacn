"use client"

/*
 * Sign in — the first screen of the mangacn auth flow, made only with the kit. A manga Panel (the picture you pass for each state (pictures; none ships with the block), focus SpeedLines around her, a SpeechBubble and an Sfx "ドキッ" that react to the state) sits on
 * the start side of the form from 48rem of container width, and above it in 4:3 when narrower. The form: email,
 * password with a show/hide toggle, "Keep me signed in", a Sign in Button with its loading state, a "Forgot
 * password?" link, social buttons behind an "or" divider, and a link to create an account.
 * States: field errors (Field), wrong credentials (demo: the password "wrongpass") as a jagged accent box that
 * shakes (G8), loading (Button `loading`, fields stay enabled), success as a Stamp with the next step.
 * No network: everything is simulated; links call `onNavigate` and never navigate.
 */
import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/manga/button"
import { Checkbox } from "@/components/ui/manga/checkbox"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/manga/field"
import { Input } from "@/components/ui/manga/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/manga/input-group"
import { Manpu } from "@/components/manga/manpu"
import { Panel } from "@/components/manga/panel"
import { Sfx } from "@/components/manga/sfx"
import { AuthDivider, SocialButton } from "@/components/manga/social-button"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { SpeedLines } from "@/components/manga/speed-lines"
import { Stamp } from "@/components/manga/stamp"
import { cn } from "cn"

export type AuthScreen = "sign-in" | "sign-up" | "forgot-password" | "verify-code" | "reset-password"
export type AuthProvider = { id: string; label: string; logo?: React.ReactNode }

/** The panel's picture for each state: waiting, after an error, after success. */
export type AuthPictures = { idle?: string; error?: string; done?: string }

export type SignInProps = {
  className?: string
  /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */
  titleAs?: "h1" | "h2"
  /** Called by the links and the next-step button. Without it they do nothing (the block never navigates). */
  onNavigate?: (screen: AuthScreen) => void
  /** Third-party sign-in buttons. The block ships no logo: pass your own marks. */
  providers?: AuthProvider[]
  /** Pictures for the panel, one per state (image URLs): the block ships none. Without them the panel keeps its speed lines. */
  pictures?: AuthPictures
}

type Mood = "idle" | "error" | "done"
type Errors = { email?: string; password?: string }

const WRONG_PASSWORD = "wrongpass"
const DEFAULT_PROVIDERS: AuthProvider[] = [
  { id: "google", label: "Continue with Google" },
  { id: "apple", label: "Continue with Apple" },
]
const LINE: Record<Mood, string> = {
  idle: "Welcome back! Your shelf missed you.",
  error: "Huh?!",
  done: "Yes!",
}

const touch = "max-sm:min-h-11"
const link = "inline-flex items-center font-letter text-sm tracking-wide uppercase hover-underline focus-ink"

function validate(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!email.trim()) errors.email = "Enter your email address."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "That address is missing its @ or its domain."
  if (!password) errors.password = "Enter your password."
  return errors
}

/** The picture: 4:3 above the form, full height beside it from 48rem of container width. */
function Scene({ mood, picture }: { mood: Mood; picture?: string }) {
  return (
    <aside aria-label="Inkwell" className="grid">
      <Panel className="aspect-[4/3] [@media(orientation:landscape)_and_(max-height:32rem)]:aspect-auto [@media(orientation:landscape)_and_(max-height:32rem)]:h-[80svh] w-full @3xl/main:aspect-auto @3xl/main:h-full @3xl/main:min-h-[36rem]">
        <SpeedLines variant="focus" originX={68} originY={52} hole={0.4} density={0.5} className="absolute! inset-0 @3xl/main:hidden" />
        <SpeedLines
          variant="focus"
          originX={60}
          originY={64}
          hole={0.46}
          density={0.55}
          seed={23}
          className="absolute! inset-0 hidden @3xl/main:block"
        />
        {picture && <img src={picture} alt="" className="absolute inset-0 size-full object-cover object-[50%_22%]" />}
        <div className="absolute end-[4%] bottom-0 aspect-[200/224] h-[86%] @3xl/main:end-[6%] @3xl/main:h-[58%]">
          {mood === "error" && <Manpu kind="surprise" size="30%" className="absolute! -top-[6%] start-[2%]" />}
          {mood === "done" && <Manpu kind="sparkle" size="26%" className="absolute! -top-[2%] end-[0%]" />}
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
        <Sfx size="md" rotate={-12} className="absolute! start-[6%] bottom-[10%] @3xl/main:hidden">
          ドキッ
        </Sfx>
        <Sfx size="lg" rotate={-12} className="absolute! start-[7%] top-[22%] hidden @3xl/main:block">
          ドキッ
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

/** A password Input with a show/hide toggle inside its end (kit InputGroup). */
function PasswordInput({
  invalid,
  ...props
}: Omit<React.ComponentProps<typeof InputGroupInput>, "type"> & { invalid?: boolean }) {
  const [shown, setShown] = React.useState(false)
  return (
    <InputGroup>
      <InputGroupInput type={shown ? "text" : "password"} aria-invalid={invalid || undefined} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-sm"
          aria-pressed={shown}
          aria-label={shown ? "Hide password" : "Show password"}
          onClick={() => setShown((s) => !s)}
          className="relative touch-hit"
        >
          {shown ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export function SignIn({ className, titleAs: TitleTag = "h1", onNavigate, pictures, providers = DEFAULT_PROVIDERS }: SignInProps) {
  const uid = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [tried, setTried] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [provider, setProvider] = React.useState<string | null>(null)
  /** Failed attempts: a new key replays the shake and the alert. */
  const [failures, setFailures] = React.useState(0)
  const [rejected, setRejected] = React.useState(false)
  const [done, setDone] = React.useState<{ via: string } | null>(null)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const errors = tried ? validate(email, password) : {}
  const passwordError = errors.password ?? (rejected ? "That password does not match this email." : undefined)
  const mood: Mood = done ? "done" : failures > 0 || errors.email || passwordError ? "error" : "idle"

  const go = (screen: AuthScreen) => (e: React.MouseEvent) => {
    e.preventDefault()
    onNavigate?.(screen)
  }
  const focusSoon = (selector: string) =>
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(selector)?.focus())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || provider) return
    setTried(true)
    if (Object.keys(validate(email, password)).length) {
      focusSoon("[aria-invalid=true]")
      return
    }
    setBusy(true)
    timer.current = setTimeout(() => {
      setBusy(false)
      if (password === WRONG_PASSWORD) {
        setFailures((n) => n + 1)
        setRejected(true)
        focusSoon(`[id="${uid}-password"]`)
        return
      }
      setFailures(0)
      setDone({ via: "email" })
      focusSoon(`[id="${uid}-title"]`)
    }, 900)
  }

  const social = (p: AuthProvider) => {
    if (busy || provider) return
    setProvider(p.id)
    timer.current = setTimeout(() => {
      setProvider(null)
      setFailures(0)
      setDone({ via: p.label.replace(/^Continue with /, "") })
      focusSoon(`[id="${uid}-title"]`)
    }, 900)
  }

  const restart = () => {
    setDone(null)
    setPassword("")
    setTried(false)
    setRejected(false)
    focusSoon(`[id="${uid}-email"]`)
  }

  return (
    <div ref={rootRef} data-manga="sign-in" className={cn("@container/main w-full bg-background text-foreground", className)}>
      <div className="grid gap-5 p-3 @md/main:p-6 @3xl/main:min-h-[40rem] @3xl/main:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @3xl/main:gap-8">
        <Scene mood={mood} picture={pictures?.[mood]} />

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
              {done ? (done.via === "email" ? "Almost in" : "You're in") : "Sign in"}
            </TitleTag>
            {!done && <p>Pick up your series where you left them.</p>}
          </header>

          {done ? (
            <div className="grid justify-items-start gap-5">
              <Stamp aria-hidden rotate={-8} className="text-3xl!">
                {done.via === "email" ? "Checked!" : "Welcome!"}
              </Stamp>
              {done.via === "email" ? (
                <p>
                  Password accepted. This account uses a second step: we sent a six-digit code to{" "}
                  <strong className="font-bold break-words">{email.trim()}</strong>.
                </p>
              ) : (
                <p>
                  Signed in with {done.via}. {remember ? "This device stays signed in for 30 days." : "You will be signed out when you close the tab."}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {done.via === "email" && (
                  <Button size="lg" onClick={() => onNavigate?.("verify-code")}>
                    Enter your code
                  </Button>
                )}
                <Button variant="link" onClick={restart} className={touch}>
                  Start over
                </Button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={submit} aria-label="Sign in with your email" className="grid gap-6">
              {failures > 0 && (
                <ErrorBox key={failures} title="Wrong email or password">
                  Check both and try again, or reset your password.
                </ErrorBox>
              )}
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
                    aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                    className="max-sm:h-11"
                  />
                  {errors.email && <FieldError id={`${uid}-email-error`}>{errors.email}</FieldError>}
                </Field>
                <Field data-invalid={passwordError ? "true" : undefined}>
                  <div className="flex flex-wrap items-center justify-between gap-x-3">
                    <FieldLabel htmlFor={`${uid}-password`}>Password</FieldLabel>
                    <a href="#" onClick={go("forgot-password")} className={cn(link, "normal-case", touch)}>
                      Forgot password?
                    </a>
                  </div>
                  <PasswordInput
                    id={`${uid}-password`}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setRejected(false)
                    }}
                    invalid={!!passwordError}
                    aria-describedby={`${uid}-password-note`}
                  />
                  {passwordError ? (
                    <FieldError id={`${uid}-password-note`}>{passwordError}</FieldError>
                  ) : (
                    <FieldDescription id={`${uid}-password-note`}>Demo: the password “wrongpass” is refused.</FieldDescription>
                  )}
                </Field>
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
                  Keep me signed in
                </label>
              </FieldGroup>
              <Button type="submit" size="lg" fullWidth loading={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
              {providers.length > 0 && (
                <>
                  <AuthDivider />
                  <div className="grid gap-3">
                    {providers.map((p) => (
                      <SocialButton
                        key={p.id}
                        type="button"
                        provider={p.id}
                        logo={p.logo}
                        loading={provider === p.id}
                        onClick={() => social(p)}
                      >
                        {p.label}
                      </SocialButton>
                    ))}
                  </div>
                </>
              )}
              <p className="flex flex-wrap items-center justify-center gap-x-2 text-center">
                New here?
                <a href="#" onClick={go("sign-up")} className={cn(link, "text-base", touch)}>
                  Create an account
                </a>
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
