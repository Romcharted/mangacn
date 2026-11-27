import { useId, useState } from "react"
import { PasswordStrength, type PasswordScore } from "@registry/manga/signature/password-strength"
import { Button } from "@registry/manga/ui/button"
import { Input } from "@registry/manga/ui/input"
import { Tile, Tiles } from "../state-grid"
import type { Example } from "../registry"

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="square">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {hidden && <path d="M3 3l18 18" />}
    </svg>
  )
}

function PasswordField() {
  const id = useId()
  const [password, setPassword] = useState("")
  const [shown, setShown] = useState(false)
  return (
    <div className="grid w-80 max-w-full gap-2">
      <label htmlFor={id} className="font-letter text-base tracking-wide uppercase">
        Password
      </label>
      <div className="flex items-stretch gap-2">
        <Input
          id={id}
          type={shown ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          className="h-11! min-w-0 flex-1 sm:h-10!"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-pressed={shown}
          aria-label={shown ? "Hide password" : "Show password"}
          onClick={() => setShown((s) => !s)}
          className="size-11! shrink-0 sm:size-10!"
        >
          <EyeIcon hidden={shown} />
        </Button>
      </div>
      <PasswordStrength value={password} />
    </div>
  )
}

export function Preview() {
  return <PasswordField />
}

function MinLength() {
  const [value, setValue] = useState("")
  return (
    <div className="grid w-80 max-w-full gap-2">
      <Input
        aria-label="New password"
        type="password"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="At least 12 characters"
        autoComplete="new-password"
        className="h-11! sm:h-10!"
      />
      <PasswordStrength value={value} minLength={12} />
    </div>
  )
}

function OwnScore() {
  const [score, setScore] = useState<PasswordScore>(2)
  return (
    <div className="grid w-80 max-w-full justify-items-center gap-4">
      <PasswordStrength score={score} className="w-full" />
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          className="min-h-11 sm:min-h-8"
          disabled={score === 0}
          onClick={() => setScore((s) => Math.max(0, s - 1) as PasswordScore)}
        >
          Weaker
        </Button>
        <Button className="min-h-11 sm:min-h-8" disabled={score === 4} onClick={() => setScore((s) => Math.min(4, s + 1) as PasswordScore)}>
          Stronger
        </Button>
      </div>
    </div>
  )
}

function CustomLabels() {
  const labels = ["Empty", "Poor", "OK", "Good", "Great"]
  return (
    <div className="grid w-80 max-w-full gap-4">
      <PasswordStrength value="ink" labels={labels} />
      <PasswordStrength score={4} labels={labels} />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "MinLength", title: "Minimum length", description: "minLength sets the shortest password that can score above zero; here it asks for twelve characters.", Component: MinLength },
  { fn: "OwnScore", title: "Your own score", description: "score takes your own estimate from 0 to 4 and overrides the password you type.", Component: OwnScore },
  { fn: "CustomLabels", title: "Custom labels", description: "labels replaces the five words; a short word reads Empty and a full score reads Great.", Component: CustomLabels },
]

const SCORES: PasswordScore[] = [0, 1, 2, 3, 4]
const NAMES = ["Too short", "Weak", "Fair", "Good", "Strong"]

export function States() {
  return (
    <Tiles>
      <Tile size="lg" label="empty">
        <PasswordStrength value="" className="w-full" />
      </Tile>
      {SCORES.map((s) => (
        <Tile key={s} size="lg" label={`score ${s} · ${NAMES[s]}`}>
          <PasswordStrength score={s} className="w-full" />
        </Tile>
      ))}
    </Tiles>
  )
}

/** Live: type a password, the gauge follows. */
export function Thumb() {
  const [value, setValue] = useState("ink")
  const score = Math.min(4, Math.floor(value.length / 3) + (/\d/.test(value) ? 1 : 0)) as PasswordScore
  return (
    <div className="grid w-48 gap-2">
      <Input aria-label="Password" value={value} onChange={(e) => setValue(e.target.value)} className="h-8" />
      <PasswordStrength score={value ? score : 0} />
    </div>
  )
}
