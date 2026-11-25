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
