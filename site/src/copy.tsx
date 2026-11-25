import { useState } from "react"

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          setTimeout(() => setDone(false), 1200)
        } catch {
          /* clipboard blocked: the text stays selectable */
        }
      }}
      className={`shrink-0 border-border px-3 font-letter text-sm uppercase hover:ink-fill focus-ink active:animate-impact ${className}`}
    >
      <span aria-live="polite">{done ? "Copied!" : "Copy"}</span>
    </button>
  )
}

/** Code behind a toggle: examples show the result first, the code on demand. */
export function CodeToggle({ text, label = "Show the code" }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false)
  const lines = text.split("\n").length
  return (
    <div className="grid gap-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex w-fit items-center gap-2 border-ink px-3 py-1.5 font-letter text-sm uppercase hover-invert focus-ink aria-expanded:ink-fill after:mark-chevron after:text-xs aria-expanded:after:rotate-180"
      >
        {open ? "Hide the code" : label} <span className="font-mono text-xs normal-case">({lines} lines)</span>
      </button>
      {open && <Code text={text} />}
    </div>
  )
}

export function Code({ text }: { text: string }) {
  return (
    <div className="flex items-start border-ink">
      <pre className="min-w-0 flex-1 overflow-x-auto p-3 text-sm" tabIndex={0}>
        <code>{text}</code>
      </pre>
      <CopyButton text={text} className="h-9 border-s-[length:var(--mg-bw)] border-b-[length:var(--mg-bw)]" />
    </div>
  )
}
