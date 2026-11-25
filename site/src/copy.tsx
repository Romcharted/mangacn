import { useEffect, useRef, useState } from "react"

export function CopyButton({
  text,
  label = "Copy",
  onCopied,
  className = "",
}: {
  text: string
  label?: string
  onCopied?: () => void
  className?: string
}) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          onCopied?.()
          setDone(true)
          setTimeout(() => setDone(false), 1200)
        } catch {
          /* clipboard blocked: the text stays selectable */
        }
      }}
      className={`shrink-0 border-border px-3 font-letter text-sm uppercase hover:ink-fill focus-ink active:animate-impact ${className}`}
    >
      <span aria-live="polite">{done ? "Copied!" : label}</span>
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

/** A code block. When lines run past the edge, an arrow strip on the end side says there is more to scroll. */
export function Code({ text }: { text: string }) {
  const ref = useRef<HTMLPreElement>(null)
  const [more, setMore] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setMore(el.scrollWidth - el.clientWidth - Math.abs(el.scrollLeft) > 4)
    check()
    el.addEventListener("scroll", check, { passive: true })
    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => {
      el.removeEventListener("scroll", check)
      observer.disconnect()
    }
  }, [text])
  return (
    <div className="flex items-start border-ink">
      <div className="relative min-w-0 flex-1">
        <pre
          ref={ref}
          className="overflow-x-auto p-3 text-sm"
          tabIndex={0}
          aria-label={more ? "Code, scroll sideways to read the full lines" : "Code"}
        >
          <code>{text}</code>
        </pre>
        {more && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 end-0 flex w-7 items-start justify-center border-s-[length:var(--mg-bw)] border-border bg-background pt-2.5 font-letter text-lg leading-none"
          >
            →
          </span>
        )}
      </div>
      <CopyButton text={text} className="h-11 border-s-[length:var(--mg-bw)] border-b-[length:var(--mg-bw)] sm:h-9" />
    </div>
  )
}
