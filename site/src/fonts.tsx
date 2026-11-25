import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { usePrefs } from "./prefs"
import { installCommand } from "./registry"
import "./index.css"

// Temporary page: the page headline and logo in the two candidate faces, side by side.
const CANDIDATES = [
  {
    id: "letter",
    name: "A — Patrick Hand SC (lettering face)",
    face: "font-letter",
    title: "text-5xl sm:text-6xl leading-[0.95]",
    logo: "text-3xl tracking-wide",
  },
  {
    id: "sfx",
    name: "B — Dela Gothic One (SFX face)",
    face: "font-sfx",
    title: "text-4xl sm:text-5xl leading-[1.05]",
    logo: "text-2xl",
  },
]

function Page() {
  const [prefs, set] = usePrefs()
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-letter text-4xl uppercase">Pick the headline face</h1>
          <p className="mt-2 max-w-prose">
            Body: Atkinson Hyperlegible Next · lettering: Patrick Hand SC · SFX: Dela Gothic One. Open: the face of the
            logo and of the big page title. Everything else is identical.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={prefs.dark}
          onClick={() => set({ dark: !prefs.dark })}
          className="h-9 border-ink px-3 font-letter uppercase hover:border-[3px] focus-ink aria-pressed:ink-fill"
        >
          Dark
        </button>
      </header>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2">
        {CANDIDATES.map((c) => (
          <section key={c.id} aria-labelledby={`h-${c.id}`} className="relative space-y-6 border-ink-panel bg-background p-6 tone-shadow">
            <p id={`h-${c.id}`} className="inline-block ink-fill px-2 py-0.5 font-letter text-sm uppercase">
              {c.name}
            </p>
            <div className="flex items-center justify-between border-b-[length:var(--mg-bw-panel)] border-border pb-3">
              <span className={`${c.face} ${c.logo} leading-none`}>
                manga<span className="ink-fill px-1">cn</span>
              </span>
              <span className="font-letter text-sm uppercase">Logo</span>
            </div>
            <h2 className={`${c.face} ${c.title} uppercase`}>
              shadcn/ui,
              <br />
              inked like a manga.
            </h2>
            <p className="max-w-prose text-lg">
              A shadcn registry that redraws your components in ink and screentone. Same components, same props, new
              lines.
            </p>
            <code className="block truncate border-ink px-3 py-2 text-sm">{installCommand("button")}</code>
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
