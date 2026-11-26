"use client"

/*
 * Sign up — the account screen of the mangacn auth flow, made only with the kit. A manga Panel (the picture you pass for each state (pictures; none ships with the block), focus SpeedLines, a SpeechBubble and an Sfx "ワクワク" that react to
 * the state) sits on the start side of the form from 48rem of container width, and above it in 4:3 when narrower.
 * The form: name, email, password with a show/hide toggle and a PasswordStrength gauge, a terms Checkbox, a Create
 * account Button with its loading state, social buttons behind an "or" divider, and a link to sign in.
 * States: field errors (empty fields, invalid email, weak password, terms unchecked), a taken email (demo: an
 * address starting with "taken") as a jagged accent box that shakes (G8), loading (Button `loading`, fields stay
 * enabled), success as a Stamp with the next step. No network; links call `onNavigate` and never navigate.
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
import { PasswordStrength, passwordScore } from "@/components/manga/password-strength"
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

export type SignUpProps = {
  className?: string
  /** The title's heading level: "h1" when the block is the page, "h2" inside a page that already has its h1. */
  titleAs?: "h1" | "h2"
  /** Called by the links and the next-step button. Without it they do nothing (the block never navigates). */
  onNavigate?: (screen: AuthScreen) => void
  /** Third-party sign-up buttons. The block ships no logo: pass your own marks. */
  providers?: AuthProvider[]
  /** Pictures for the panel, one per state (image URLs): the block ships none. Without them the panel keeps its speed lines. */
  pictures?: AuthPictures
}

type Mood = "idle" | "error" | "done"
type Errors = { name?: string; email?: string; password?: string; terms?: string }

const DEFAULT_PROVIDERS: AuthProvider[] = [
  { id: "google", label: "Continue with Google" },
  { id: "apple", label: "Continue with Apple" },
]
const LINE: Record<Mood, string> = {
  idle: "A new reader!",
  error: "Huh?!",
  done: "Yes!",
}

const touch = "max-sm:min-h-11"
const link = "inline-flex items-center font-letter text-sm tracking-wide uppercase hover-underline focus-ink"
const inline = "underline decoration-2 underline-offset-2 hover:decoration-4 focus-ink"

function validate(name: string, email: string, password: string, terms: boolean): Errors {
  const errors: Errors = {}
  if (!name.trim()) errors.name = "Tell us what to call you."
  if (!email.trim()) errors.email = "Enter your email address."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "That address is missing its @ or its domain."
  if (!password) errors.password = "Choose a password."
  else if (passwordScore(password) < 2) errors.password = "Too weak: use 12 characters, or mix capitals, digits and symbols."
  if (!terms) errors.terms = "Accept the Terms and the Privacy notice to create an account."
  return errors
}

/** The picture: 4:3 above the form, full height beside it from 48rem of container width. */
function Scene({ mood, picture }: { mood: Mood; picture?: string }) {
  return (
    <aside aria-label="Inkwell" className="grid">
      <Panel className="aspect-[4/3] [@media(orientation:landscape)_and_(max-height:32rem)]:aspect-auto [@media(orientation:landscape)_and_(max-height:32rem)]:h-[80svh] w-full @3xl/main:aspect-auto @3xl/main:h-full @3xl/main:min-h-[36rem]">
        <SpeedLines variant="focus" originX={68} originY={52} hole={0.4} density={0.5} seed={11} className="absolute! inset-0 @3xl/main:hidden" />
        <SpeedLines
          variant="focus"
          originX={60}
          originY={64}
          hole={0.46}
          density={0.55}
          seed={31}
          className="absolute! inset-0 hidden @3xl/main:block"
        />
        {picture && <img src={picture} alt="" className="absolute inset-0 size-full object-cover object-[50%_22%]" />}
        <div className="absolute end-[4%] bottom-0 aspect-[200/224] h-[86%] @3xl/main:end-[6%] @3xl/main:h-[58%]">
          {mood === "error" ? (
            <Manpu kind="surprise" size="30%" className="absolute! -top-[6%] start-[2%]" />
          ) : (
            <Manpu kind="sparkle" size="26%" className="absolute! -top-[2%] end-[0%]" />
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
        <Sfx size="md" rotate={-10} className="absolute! start-[5%] bottom-[10%] @3xl/main:hidden">
          ワクワク
        </Sfx>
        <Sfx size="lg" rotate={-10} className="absolute! start-[6%] top-[22%] hidden @3xl/main:block">
          ワクワク
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

export function SignUp({ className, titleAs: TitleTag = "h1", onNavigate, pictures, providers = DEFAULT_PROVIDERS }: SignUpProps) {
  const uid = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [terms, setTerms] = React.useState(false)
  const [tried, setTried] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [provider, setProvider] = React.useState<string | null>(null)
  /** Failed attempts: a new key replays the shake and the alert. */
  const [failures, setFailures] = React.useState(0)
  const [taken, setTaken] = React.useState(false)
  const [done, setDone] = React.useState<{ via: string } | null>(null)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const errors = tried ? validate(name, email, password, terms) : {}
  const emailError = errors.email ?? (taken ? "This email already has an account." : undefined)
  const mood: Mood = done ? "done" : failures > 0 || Object.keys(errors).length ? "error" : "idle"

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
    if (Object.keys(validate(name, email, password, terms)).length) {
      focusSoon("[aria-invalid=true]")
      return
    }
    setBusy(true)
    timer.current = setTimeout(() => {
      setBusy(false)
      if (/^taken/i.test(email.trim())) {
        setFailures((n) => n + 1)
        setTaken(true)
        focusSoon(`[id="${uid}-email"]`)
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
    setTaken(false)
    focusSoon(`[id="${uid}-name"]`)
  }

  return (
    <div ref={rootRef} data-manga="sign-up" className={cn("@container/main w-full bg-background text-foreground", className)}>
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
              {done ? (done.via === "email" ? "Check your inbox" : "Welcome aboard") : "Create an account"}
            </TitleTag>
            {!done && <p>Free forever for your first three series.</p>}
          </header>

          {done ? (
            <div className="grid justify-items-start gap-5">
              <Stamp aria-hidden rotate={-8} className="text-3xl!">
                Created!
              </Stamp>
              {done.via === "email" ? (
                <p>
                  Your shelf is ready, {name.trim()}. To confirm it is you, we sent a six-digit code to{" "}
                  <strong className="font-bold break-words">{email.trim()}</strong>.
                </p>
              ) : (
                <p>Your account is linked to {done.via}. Your shelf is ready.</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {done.via === "email" && (
                  <Button size="lg" onClick={() => onNavigate?.("verify-code")}>
                    Enter the code
                  </Button>
                )}
                <Button variant="link" onClick={restart} className={touch}>
                  Start over
                </Button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={submit} aria-label="Create an account with your email" className="grid gap-6">
              {failures > 0 && (
                <ErrorBox key={failures} title="Email already in use">
                  An account already uses this address.{" "}
                  <a href="#" onClick={go("sign-in")} className={inline}>
                    Sign in instead
                  </a>{" "}
                  or use another email.
                </ErrorBox>
              )}
              <FieldGroup>
                <Field data-invalid={errors.name ? "true" : undefined}>
                  <FieldLabel htmlFor={`${uid}-name`}>Name</FieldLabel>
                  <Input
                    id={`${uid}-name`}
                    autoComplete="name"
                    placeholder="Mika Aoyama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                    className="max-sm:h-11"
                  />
                  {errors.name && <FieldError id={`${uid}-name-error`}>{errors.name}</FieldError>}
                </Field>
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
                      setTaken(false)
                    }}
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={`${uid}-email-note`}
                    className="max-sm:h-11"
                  />
                  {emailError ? (
                    <FieldError id={`${uid}-email-note`}>{emailError}</FieldError>
                  ) : (
                    <FieldDescription id={`${uid}-email-note`}>Demo: an address starting with “taken” is in use.</FieldDescription>
                  )}
                </Field>
                <Field data-invalid={errors.password ? "true" : undefined}>
                  <FieldLabel htmlFor={`${uid}-password`}>Password</FieldLabel>
                  <PasswordInput
                    id={`${uid}-password`}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    invalid={!!errors.password}
                    aria-describedby={`${uid}-password-note`}
                  />
                  <PasswordStrength value={password} />
                  {errors.password ? (
                    <FieldError id={`${uid}-password-note`}>{errors.password}</FieldError>
                  ) : (
                    <FieldDescription id={`${uid}-password-note`}>8 characters at least; “Fair” or better.</FieldDescription>
                  )}
                </Field>
                <Field data-invalid={errors.terms ? "true" : undefined}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3">
                    <Checkbox
                      checked={terms}
                      onCheckedChange={(v) => setTerms(v === true)}
                      aria-invalid={errors.terms ? true : undefined}
                      aria-describedby={errors.terms ? `${uid}-terms-error` : undefined}
                    />
                    <span>
                      I accept the{" "}
                      <a href="#" onClick={(e) => e.preventDefault()} className={inline}>
                        Terms
                      </a>{" "}
                      and the{" "}
                      <a href="#" onClick={(e) => e.preventDefault()} className={inline}>
                        Privacy notice
                      </a>
                    </span>
                  </label>
                  {errors.terms && <FieldError id={`${uid}-terms-error`}>{errors.terms}</FieldError>}
                </Field>
              </FieldGroup>
              <Button type="submit" size="lg" fullWidth loading={busy}>
                {busy ? "Creating…" : "Create account"}
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
                Already have an account?
                <a href="#" onClick={go("sign-in")} className={cn(link, "text-base", touch)}>
                  Sign in
                </a>
              </p>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
