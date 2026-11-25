import { useEffect, useRef, useState, type ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { Code, CopyButton } from "./copy"
import { Examples } from "./examples"
import { Grammar } from "./grammar"
import { Hero } from "./hero"
import { ACCENTS, useHash, usePrefs, type Accent } from "./prefs"
import { CATEGORIES, GITHUB_URL, categories, categoryOf, demos, filterItems, installCommand, items, type Item } from "./registry"

const ACCENT_LABEL: Record<Accent, string> = { stamp: "Stamp red", indigo: "Indigo", pine: "Pine", ochre: "Ochre" }

export function App() {
  const [prefs, set] = usePrefs()
  const hash = useHash()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const current = items.find((i) => i.name === hash)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [current?.name, hash])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TopBar
        query={query}
        onQuery={(q) => {
          setQuery(q)
          if (current) location.hash = ""
        }}
        category={category}
        onCategory={(c) => {
          setCategory(c)
          if (current) location.hash = ""
        }}
        prefs={prefs}
        set={set}
      />
      <main id="main" className="mx-auto max-w-7xl px-4 pb-24">
        {hash === "grammar" ? (
          <Grammar />
        ) : hash === "examples" ? (
          <Examples />
        ) : current ? (
          <Detail item={current} />
        ) : (
          <Gallery query={query} category={category} />
        )}
      </main>
      <footer className="border-t-[length:var(--mg-bw-panel)] border-border px-4 py-6 text-center text-sm">
        MIT licensed. Not affiliated with shadcn.{" "}
        <a href="./llms.txt" className="underline">
          llms.txt
        </a>{" "}
        ·{" "}
        <a href={GITHUB_URL} className="underline">
          GitHub
        </a>
      </footer>
    </>
  )
}

/* ---------- Top bar ---------- */

function TopBar(props: {
  query: string
  onQuery: (q: string) => void
  category: string | null
  onCategory: (c: string | null) => void
  prefs: ReturnType<typeof usePrefs>[0]
  set: ReturnType<typeof usePrefs>[1]
}) {
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === "/" && !/input|textarea|select/i.test(t.tagName) && !t.isContentEditable) {
        e.preventDefault()
        input.current?.focus()
      }
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [])
  const { prefs, set } = props
  return (
    <header className="relative z-40 sm:sticky sm:top-0 border-b-[length:var(--mg-bw-panel)] border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5">
        <a href="#" className="font-sfx text-xl leading-none focus-ink" aria-label="mangacn, back to the gallery">
          manga<span className="ink-fill px-1">cn</span>
        </a>
        <nav aria-label="Guides" className="flex gap-1.5">
          <a href="#grammar" className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover-invert focus-ink">
            Grammar
          </a>
          <a href="#examples" className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover-invert focus-ink">
            Examples
          </a>
        </nav>
        <label className="relative order-last w-full sm:order-none sm:w-56">
          <span className="sr-only">Filter components by name</span>
          <input
            ref={input}
            type="search"
            value={props.query}
            onChange={(e) => props.onQuery(e.target.value)}
            placeholder="Filter…"
            className="h-9 w-full border-ink bg-background ps-3 pe-8 focus-ink"
          />
          <kbd aria-hidden className="pointer-events-none absolute end-2 top-1/2 -translate-y-1/2 border-ink-fine px-1.5 font-mono text-xs">
            /
          </kbd>
        </label>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <div role="radiogroup" aria-label="Accent colour" className="flex items-center gap-1">
            {ACCENTS.map((a) => (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={prefs.accent === a}
                aria-label={ACCENT_LABEL[a]}
                title={ACCENT_LABEL[a]}
                onClick={() => set({ accent: a })}
                data-accent={a}
                className="grid size-9 place-items-center border-ink-fine focus-ink aria-checked:border-ink"
              >
                <span className="block size-5 bg-[var(--mg-accent)]" />
              </button>
            ))}
          </div>
          <Toggle label="Dark" pressed={prefs.dark} onClick={() => set({ dark: !prefs.dark })} />
          <Toggle
            label={prefs.reading === "rtl" ? "Read ←" : "Read →"}
            title="Manga reading order: panels and bubbles right to left (text stays left to right)"
            pressed={prefs.reading === "rtl"}
            onClick={() => set({ reading: prefs.reading === "ltr" ? "rtl" : "ltr" })}
          />
          <a href={GITHUB_URL} className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink">
            GitHub
          </a>
        </div>
      </div>
      <nav aria-label="Categories" className="mx-auto flex max-w-7xl flex-wrap gap-1.5 px-4 pb-2.5">
        <Pill active={props.category === null} onClick={() => props.onCategory(null)}>
          All
        </Pill>
        {categories.map((c) => (
          <Pill key={c} active={props.category === c} onClick={() => props.onCategory(props.category === c ? null : c)}>
            {CATEGORIES[c] ?? c}
          </Pill>
        ))}
      </nav>
    </header>
  )
}

function Toggle(props: { label: string; pressed: boolean; title?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={props.pressed}
      title={props.title}
      onClick={props.onClick}
      className="h-9 border-ink px-3 font-letter text-sm uppercase hover:border-[3px] hover:px-[11px] focus-ink aria-pressed:ink-fill"
    >
      {props.label}
    </button>
  )
}

function Pill(props: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={props.active}
      onClick={props.onClick}
      className="h-7 border-ink-fine px-2.5 font-letter text-sm uppercase hover:border-ink focus-ink aria-pressed:ink-fill"
    >
      {props.children}
    </button>
  )
}

/* ---------- Gallery ---------- */

const FONT_SAMPLE: Record<string, string> = { "font-body": "font-sans", "font-lettering": "font-letter", "font-sfx": "font-sfx" }

function Gallery({ query, category }: { query: string; category: string | null }) {
  const list = filterItems(query, category)
  const showHero = !query && !category
  return (
    <>
      {showHero && (
        <section className="grid grid-cols-[minmax(0,1fr)] gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
          <div className="space-y-5">
            <h1 className="font-sfx text-[2rem] leading-[1.05] uppercase sm:text-[2.4rem] lg:text-[1.85rem] xl:text-[2.35rem]">
              shadcn/ui,
              <br />
              inked like a manga.
            </h1>
            <p className="max-w-prose text-lg">
              A shadcn registry that redraws your components in ink and screentone. Same components, same props, new
              lines.
            </p>
            <div className="flex max-w-xl items-stretch border-ink">
              <code className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{installCommand("button")}</code>
              <CopyButton text={installCommand("button")} className="border-s-[length:var(--mg-bw)]" />
            </div>
          </div>
          <Hero />
        </section>
      )}
      <h2 className="sr-only">Components</h2>
      {list.length === 0 ? (
        <p className="mt-8 border-ink p-6 font-letter text-lg uppercase">No component matches “{query}”.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4">
          {list.map((i) => (
            <li key={i.name}>
              <Card item={i} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

// The preview is live (click, toggle, hover); only the title and the arrow open the detail page.
function Card({ item }: { item: Item }) {
  const Thumb = demos[item.name]?.Thumb
  const font = FONT_SAMPLE[item.name]
  const href = `#${item.name}`
  return (
    <article className="group relative flex h-full flex-col border-ink bg-background has-[a:hover]:tone-shadow has-[a:hover]:[--shadow-x:5px] has-[a:hover]:[--shadow-y:5px]">
      <div className="grid h-36 place-items-center overflow-hidden border-b-[length:var(--mg-bw)] border-border p-3">
        {Thumb ? <Thumb /> : font ? <span className={`${font} text-5xl`}>Aa</span> : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="flex items-baseline justify-between gap-2">
          <a href={href} className="font-letter text-xl leading-none uppercase hover:underline focus-ink">
            {item.title}
          </a>
          <span className="shrink-0 font-mono text-[0.7rem]">{CATEGORIES[categoryOf(item)]}</span>
        </span>
        <span className="text-sm">{item.meta?.tagline ?? item.description}</span>
        <a
          href={href}
          tabIndex={-1}
          aria-hidden
          className="mt-auto ms-auto inline-grid size-8 place-items-center border-ink font-letter text-lg leading-none hover:ink-fill"
        >
          →
        </a>
      </div>
    </article>
  )
}

/* ---------- Detail ---------- */

function Detail({ item }: { item: Item }) {
  const demo = demos[item.name]
  const index = items.indexOf(item)
  const prev = items[index - 1]
  const next = items[index + 1]
  const props = item.meta?.props ?? []
  return (
    <article aria-labelledby="detail-title" className="pt-6">
      <nav aria-label="Component navigation" className="flex flex-wrap items-center justify-between gap-2">
        <a href="#" className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink">
          ← All components
        </a>
        <span className="flex gap-2">
          {prev && <NavLink href={`#${prev.name}`} label={`← ${prev.title}`} />}
          {next && <NavLink href={`#${next.name}`} label={`${next.title} →`} />}
        </span>
      </nav>

      <header className="mt-6 space-y-2">
        <p className="font-mono text-xs">{CATEGORIES[categoryOf(item)]}</p>
        <h1 id="detail-title" className="font-letter text-5xl leading-none uppercase">
          {item.title}
        </h1>
        <p className="max-w-prose text-lg">{item.meta?.tagline ?? item.description}</p>
      </header>

      <div className="mt-5 flex items-stretch border-ink">
        <code className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{installCommand(item.name)}</code>
        <CopyButton text={installCommand(item.name)} className="border-s-[length:var(--mg-bw)]" />
      </div>

      <Tabs variant="underline" defaultValue="preview" className="mt-6">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          {item.meta?.usage && <TabsTrigger value="usage">Usage</TabsTrigger>}
          {props.length > 0 && <TabsTrigger value="props">Props</TabsTrigger>}
        </TabsList>
        <TabsContent value="preview">
          <div className="relative border-ink-fine bg-background p-6">
            {demo?.Preview ? <demo.Preview /> : <p>No live preview for this item.</p>}
          </div>
        </TabsContent>
        {item.meta?.usage && (
          <TabsContent value="usage">
            <Code text={item.meta.usage} />
          </TabsContent>
        )}
        {props.length > 0 && (
          <TabsContent value="props">
            <dl className="divide-y-[length:var(--mg-bw-fine)] divide-border border-ink">
              {props.map((p) => (
                <div key={p.name} className="grid gap-1 p-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <dt className="font-mono text-sm font-bold break-words">{p.name}</dt>
                  <dd className="text-sm">
                    <code className="font-mono break-words">{p.type}</code>
                    {p.default && <span> · default {p.default}</span>}
                    <span className="block">{p.description}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </TabsContent>
        )}
      </Tabs>

      {demo?.States && (
        <section aria-labelledby="states-title" className="mt-10">
          <h2 id="states-title" className="mb-3 font-letter text-2xl uppercase">
            States
          </h2>
          <demo.States />
        </section>
      )}
    </article>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex h-9 items-center border-ink-fine px-3 font-letter text-sm uppercase hover:border-ink focus-ink">
      {label}
    </a>
  )
}
