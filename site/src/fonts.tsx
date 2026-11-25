import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { usePrefs } from "./prefs"
import { installCommand } from "./registry"
import "./index.css"

// Temporary page: the page headline in the two candidate faces, side by side.
const CANDIDATES = [
  { id: "letter", name: "A — Patrick Hand SC (lettering face)", className: "font-letter text-5xl sm:text-6xl leading-[0.95]" },
  { id: "sfx", name: "B — Dela Gothic One (SFX face)", className: "font-sfx text-4xl sm:text-5xl leading-[1.05]" },
]

function Page() {
  const [prefs, set] = usePrefs()
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-letter text-4xl uppercase">Pick the headline face</h1>
          <p className="mt-2 max-w-prose">
            Body: Atkinson Hyperlegible Next · lettering: Patrick Hand SC · SFX: Dela Gothic One. Only the big page
            title is still open.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={prefs.dark}
          onClick={() => set({ dark: !prefs.dark })}
          className="h-9 border-ink px-3 font-letter uppercase hover:tone-20 focus-ink aria-pressed:ink-fill"
        >
          Dark
        </button>
      </header>
      <div className="grid gap-8 lg:grid-cols-2">
        {CANDIDATES.map((c) => (
          <section key={c.id} aria-labelledby={`h-${c.id}`} className="relative space-y-5 border-ink-panel bg-background p-6 tone-shadow">
            <p id={`h-${c.id}`} className="inline-block ink-fill px-2 py-0.5 font-letter text-sm uppercase">
              {c.name}
            </p>
            <h2 className={`${c.className} uppercase`}>
              shadcn/ui,
              <br />
              inked like a manga.
            </h2>
            <p className="max-w-prose text-lg">
              An open source registry that redraws shadcn/ui in ink and screentone — with a soft, full-colour webtoon
              theme. Same components, same props, new lines.
            </p>
            <code className="block overflow-x-auto border-ink px-3 py-2 text-sm whitespace-nowrap">
              {installCommand("base")}
            </code>
          </section>
        ))}
      </div>
    </main>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
