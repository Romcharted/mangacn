// Gestures: G7 running lines (fill-lines) fill the segments; G2 bar growth (animate-bar-in) fills them one
// after the other in steps; level 4 is an ink flat (ink-fill). No accent, no tone: the label sits on paper.
import * as React from "react"
import { cn } from "cn"

export type PasswordScore = 0 | 1 | 2 | 3 | 4

const DEFAULT_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"]

/**
 * Local estimate, no dictionary and no network:
 * - shorter than minLength: 0
 * - minLength or more: 1
 * - +1 at minLength + 4 characters
 * - +1 with three of the four classes (lower case, upper case, digit, symbol)
 * - +1 with 16 characters or more and three classes (capped at 4)
 * - a run of three identical characters caps the score at 1
 */
export function passwordScore(password: string, minLength = 8): PasswordScore {
  if (password.length < minLength) return 0
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((re) => re.test(password)).length
  let score = 1
  if (password.length >= minLength + 4) score++
  if (classes >= 3) score++
  if (password.length >= 16 && classes >= 3) score++
  if (/(.)\1\1/.test(password)) score = Math.min(score, 1)
  return Math.min(score, 4) as PasswordScore
}

export type PasswordStrengthProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** The password to estimate. Ignored when `score` is given. */
  value?: string
  /** A score from the app's own estimate (0-4). Overrides `value`. */
  score?: PasswordScore
  /** Five labels for the scores 0-4. Default: Too short, Weak, Fair, Good, Strong. */
  labels?: string[]
  /** Passwords shorter than this score 0. Default 8. */
  minLength?: number
}

/** A four-segment gauge beside its label. Filled segments grow in steps, one after the other. */
function PasswordStrength({ value = "", score, labels = DEFAULT_LABELS, minLength = 8, className, ...props }: PasswordStrengthProps) {
  const raw = score ?? passwordScore(value, minLength)
  const level = Math.max(0, Math.min(4, Math.round(raw))) as PasswordScore
  const text = labels[level] ?? DEFAULT_LABELS[level]
  return (
    <div
      data-manga="password-strength"
      data-score={level}
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <div
        role="meter"
        aria-label="Password strength"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={level}
        aria-valuetext={text}
        className="grid min-w-0 flex-1 grid-cols-4 gap-1"
      >
        {[0, 1, 2, 3].map((i) => {
          const on = i < level
          return (
            <span
              key={i}
              aria-hidden
              data-on={on || undefined}
              style={on ? { animationDelay: `${i * 83}ms` } : undefined}
              className={cn(
                "block h-6 border-[length:var(--mg-bw)] border-border",
                on ? (level === 4 ? "ink-fill animate-bar-in" : "fill-lines animate-bar-in") : "bg-background",
              )}
            />
          )
        })}
      </div>
      <p aria-live="polite" className="w-24 shrink-0 font-letter text-sm tracking-wide uppercase">
        {text}
      </p>
    </div>
  )
}

export { PasswordStrength }
