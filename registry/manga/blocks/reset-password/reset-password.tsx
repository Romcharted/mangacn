"use client"

/*
 * Reset password — the last screen of the "forgot password" flow, made only with mangacn. A manga Panel (the
 * reader drawn whole in SVG, a key in her hands, focus SpeedLines around her, a SpeechBubble that reacts to
 * each state, "キラッ" Sfx) sits on the start side when the block is 48rem wide, and above the form in 4:3 on
 * phones. The form: a new password in an InputGroup with a show/hide toggle and a PasswordStrength gauge, a
 * confirmation, a Save Button with its loading state.
 * Gestures: G1 case around the form, Field errors (weak, mismatch, empty) with focus on the first wrong field,
 * G8 error box (accent fill, edge-jagged, "!" mark, shake, role=alert) when the "server" refuses the current
 * password, G5 the Stamp landing on success. No network: the save is simulated and nothing navigates unless
 * you pass onNavigate. Container queries (`@container/main`) widen it.
 */
import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/manga/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/manga/field"
import { Input } from "@/components/ui/manga/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/manga/input-group"
import { Panel, PanelCaption } from "@/components/manga/panel"
import { PasswordStrength, passwordScore } from "@/components/manga/password-strength"
import { Sfx } from "@/components/manga/sfx"
import { SpeechBubble } from "@/components/manga/speech-bubble"
import { SpeedLines } from "@/components/manga/speed-lines"
import { Stamp } from "@/components/manga/stamp"
import { cn } from "cn"

export type AuthScreen = "sign-in" | "sign-up" | "forgot-password" | "verify-code" | "reset-password"

export type ResetPasswordProps = {
  className?: string
  /** Called by "Back to sign in". Without it the button does nothing. */
  onNavigate?: (screen: AuthScreen) => void
  /** The account whose password changes. */
  email?: string
}

type Mood = "idle" | "error" | "success"
type Errors = { password?: string; confirm?: string }

/** Demo only: the "server" refuses the account's current password. */
const CURRENT = "Lanterns42!"

const BUBBLE: Record<Mood, string> = {
  idle: "A fresh start.",
  error: "Huh?!",
  success: "Yes!",
}

function validate(password: string, confirm: string): Errors {
  const errors: Errors = {}
  if (!password) errors.password = "Enter a new password."
  else if (passwordScore(password) < 2)
    errors.password = "Too weak. Use 12 characters or more, or mix capitals, digits and symbols."
  if (!confirm) errors.confirm = "Type the new password again."
  else if (password && confirm !== password) errors.confirm = "The two passwords do not match."
  return errors
}

/** The reader of the auth flow, drawn whole (bust and hands' prop), holding the key to a new password. */
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
      {/* a big key, held up with both hands, and its glint */}
      <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="62" cy="204" r="15" fill="var(--background)" />
        <circle cx="62" cy="204" r="5" />
        <path d="M77 199h75v10h-6v10h-9v-10h-8v7h-9v-7H77z" fill="var(--background)" />
        <path d="M40 196q10-6 14 4v14q-8 6-14-2z M110 196q-10-6-14 4v14q8 6 14-2z" fill="var(--background)" />
        <path d="M166 172v22M155 183h22" strokeWidth="2.5" />
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

export function ResetPassword({ className, onNavigate, email = "mika@inkwell.app" }: ResetPasswordProps) {
  const uid = React.useId()
  const rootRef = React.useRef<HTMLDivElement>(null)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [shown, setShown] = React.useState(false)
  const [tried, setTried] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)

  const errors = tried ? validate(password, confirm) : {}

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const focusSoon = (selector: string) =>
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(selector)?.focus())

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setTried(true)
    setServerError(null)
    if (Object.keys(validate(password, confirm)).length) {
      focusSoon("[aria-invalid=true]")
      return
    }
    setBusy(true)
    timer.current = setTimeout(() => {
      setBusy(false)
      if (password === CURRENT) {
        setServerError("That is your current password. Pick one you have not used here before.")
        focusSoon(`[id="${uid}-password"]`)
        return
      }
      setDone(true)
      focusSoon(`[id="${uid}-title"]`)
    }, 900)
  }

  const mood: Mood = done ? "success" : serverError || Object.keys(errors).length ? "error" : "idle"
  const type = shown ? "text" : "password"
  const passwordInvalid = Boolean(errors.password || serverError)

  return (
    <div
      ref={rootRef}
      data-manga="reset-password"
      className={cn("@container/main w-full overflow-x-clip bg-background text-foreground", className)}
    >
      <div className="grid gap-5 p-3 @md/main:p-6 @3xl/main:min-h-[40rem] @3xl/main:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @3xl/main:gap-8">
        {/* Start side: the panel. 4:3 above the form on phones, full height beside it when the block is wide. */}
        <aside aria-label="Inkwell" className="grid @md/main:mx-auto @md/main:w-full @md/main:max-w-md @3xl/main:max-w-none">
          <Panel className="aspect-[4/3] [@media(orientation:landscape)_and_(max-height:32rem)]:aspect-auto [@media(orientation:landscape)_and_(max-height:32rem)]:h-[80svh] @3xl/main:aspect-auto @3xl/main:min-h-[36rem]">
            <SpeedLines
              variant="focus"
              originX={66}
              originY={54}
              hole={0.5}
              density={0.45}
              seed={47}
              className="absolute! inset-0 @3xl/main:hidden"
            />
            <SpeedLines
              variant="focus"
              originX={58}
              originY={64}
              hole={0.5}
              density={0.55}
              seed={47}
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
              キラッ
            </Sfx>
            <PanelCaption position="bottom-start" className="hidden @3xl/main:block">
              Inkwell · Chapter 3: a fresh start
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
              <span className="font-mono text-xs">{done ? "Password saved" : "Step 3 of 3"}</span>
            </div>
            <h1
              id={`${uid}-title`}
              tabIndex={-1}
              className="font-letter text-4xl leading-none tracking-wide uppercase outline-none"
            >
              {done ? "All set" : "New password"}
            </h1>
            {!done && (
              <p>
                Choose a new password for <strong className="font-bold wrap-anywhere">{email}</strong>.
              </p>
            )}
          </header>

          {done ? (
            <div className="grid justify-items-start gap-6">
              <Stamp className="ms-2 mt-2">Saved!</Stamp>
              <p>Your password is changed, and every other device was signed out. Sign in again with the new one.</p>
              <Button type="button" size="lg" fullWidth onClick={() => onNavigate?.("sign-in")}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={save} aria-label="Choose a new password" className="grid gap-6">
              {serverError && <ErrorBox>{serverError}</ErrorBox>}
              <FieldGroup>
                <Field data-invalid={passwordInvalid ? "true" : undefined}>
                  <FieldLabel htmlFor={`${uid}-password`}>New password</FieldLabel>
                  <InputGroup className="max-sm:h-11">
                    <InputGroupInput
                      id={`${uid}-password`}
                      type={type}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setServerError(null)
                      }}
                      aria-invalid={passwordInvalid ? true : undefined}
                      aria-describedby={`${uid}-strength ${uid}-password-help`}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        size="icon-sm"
                        aria-pressed={shown}
                        aria-controls={`${uid}-password ${uid}-confirm`}
                        aria-label={shown ? "Hide password" : "Show password"}
                        onClick={() => setShown((s) => !s)}
                        className="relative touch-hit"
                      >
                        {shown ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <PasswordStrength id={`${uid}-strength`} value={password} />
                  {errors.password ? (
                    <FieldError id={`${uid}-password-help`}>{errors.password}</FieldError>
                  ) : (
                    <FieldDescription id={`${uid}-password-help`}>
                      Demo: “{CURRENT}” is the current password.
                    </FieldDescription>
                  )}
                </Field>
                <Field data-invalid={errors.confirm ? "true" : undefined}>
                  <FieldLabel htmlFor={`${uid}-confirm`}>Confirm the new password</FieldLabel>
                  <Input
                    id={`${uid}-confirm`}
                    type={type}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    aria-invalid={errors.confirm ? true : undefined}
                    aria-describedby={errors.confirm ? `${uid}-confirm-help` : undefined}
                    className="max-sm:h-11"
                  />
                  {errors.confirm && <FieldError id={`${uid}-confirm-help`}>{errors.confirm}</FieldError>}
                </Field>
              </FieldGroup>
              <Button type="submit" size="lg" fullWidth loading={busy}>
                {busy ? "Saving…" : "Save password"}
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}
