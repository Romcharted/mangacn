import * as React from "react"
import { OTPInputContext, REGEXP_ONLY_DIGITS, type SlotProps } from "input-otp"

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@registry/manga/ui/input-otp"
import { force, Tile, Tiles } from "../state-grid"

function Six({ separator = true }: { separator?: boolean }) {
  if (!separator)
    return (
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    )
  return (
    <>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </>
  )
}

export function Preview() {
  const [code, setCode] = React.useState("")
  const done = code.length === 6
  return (
    <div className="relative flex w-full max-w-sm flex-col gap-4 sm:ink-case sm:p-5">
      <div>
        <p className="font-letter text-xl tracking-wide uppercase">Unlock chapter 42</p>
        <p className="text-sm">Enter the 6-digit code from the back of volume 9.</p>
      </div>
      <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={code} onChange={setCode} aria-label="Unlock code" aria-invalid={done && code !== "424242" ? true : undefined}>
        <Six separator={false} />
      </InputOTP>
      <p className="flex min-h-6 items-center gap-2 text-sm" aria-live="polite">
        {!done && `${code.length} of 6 digits. (Psst: 424242.)`}
        {done && code === "424242" && (
          <>
            <span aria-hidden className="mark-check text-xl" /> Unlocked. Enjoy the read!
          </>
        )}
        {done && code !== "424242" && "That code does not match. Try again."}
      </p>
    </div>
  )
}

/** Frozen slot states: the real component, with its slots fed by a fixed context (showcase only). */
function Frozen({ chars, active, children }: { chars: string; active?: number; children: React.ReactNode }) {
  const slots: SlotProps[] = Array.from({ length: 6 }, (_, i) => ({
    char: chars[i] ?? null,
    placeholderChar: null,
    isActive: i === active,
    hasFakeCaret: i === active && chars[i] === undefined,
  }))
  return <OTPInputContext.Provider value={{ slots, isFocused: active !== undefined, isHovering: false }}>{children}</OTPInputContext.Provider>
}

/** A tile wide enough for six 44px slots and a separator (21rem), one per row on phones. */
function WideTile({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 grow basis-[21rem] max-sm:col-span-2">
      <Tile label={label} size="lg">
        {children}
      </Tile>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <WideTile label="empty · rest">
        <InputOTP maxLength={6} aria-label="Empty">
          <Six />
        </InputOTP>
      </WideTile>
      <WideTile label="hover">
        <div className="group/otp" {...force("hover")}>
          <InputOTP maxLength={6} aria-label="Hover">
            <Six />
          </InputOTP>
        </div>
      </WideTile>
      <WideTile label="partly filled">
        <InputOTP maxLength={6} value="72" aria-label="Partly filled">
          <Six />
        </InputOTP>
      </WideTile>
      <WideTile label="active slot 3 · focus · caret">
        <InputOTP maxLength={6} value="72" aria-label="Active" {...force("focus")}>
          <Frozen chars="72" active={2}>
            <Six />
          </Frozen>
        </InputOTP>
      </WideTile>
      <WideTile label="active slot 2 · filled">
        <InputOTP maxLength={6} value="728" aria-label="Active filled" {...force("focus")}>
          <Frozen chars="728" active={1}>
            <Six />
          </Frozen>
        </InputOTP>
      </WideTile>
      <WideTile label="complete">
        <InputOTP maxLength={6} value="728104" aria-label="Complete">
          <Six />
        </InputOTP>
      </WideTile>
      <WideTile label="invalid · no separator">
        <InputOTP maxLength={6} value="728105" aria-label="Invalid" aria-invalid>
          <Six separator={false} />
        </InputOTP>
      </WideTile>
      <WideTile label="invalid · active">
        <InputOTP maxLength={6} value="7281" aria-label="Invalid active" aria-invalid {...force("focus")}>
          <Frozen chars="7281" active={4}>
            <Six separator={false} />
          </Frozen>
        </InputOTP>
      </WideTile>
      <WideTile label="disabled">
        <InputOTP maxLength={6} value="728" aria-label="Disabled" disabled>
          <Six />
        </InputOTP>
      </WideTile>
      <WideTile label="4 digits">
        <InputOTP maxLength={4} value="19" aria-label="Four digits">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </WideTile>
    </Tiles>
  )
}

/** Live: type a code. */
export function Thumb() {
  const [value, setValue] = React.useState("42")
  return (
    <InputOTP maxLength={4} value={value} onChange={setValue} aria-label="Code">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  )
}
