import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { CopyForAi } from "./ai"
import { track } from "./visits"
import { Code, CopyButton } from "./copy"
import { CategoryPill, SiteHeader } from "./header"
import { Hero } from "./hero"
import { HomeExample, HomeInterfaces, InterfacePage } from "./interfaces"
import { useNarrow } from "./narrow"
import { useHash, usePrefs } from "./prefs"
import { CATEGORIES, GITHUB_URL, categories, categoryOf, filterItems, installCommand, items, useDemo, type Item } from "./registry"

// Pages other than the gallery load on demand.
const Grammar = lazy(() => import("./grammar").then((m) => ({ default: m.Grammar })))
const Examples = lazy(() => import("./examples").then((m) => ({ default: m.Examples })))
const Legal = lazy(() => import("./legal").then((m) => ({ default: m.Legal })))
const Studio = lazy(() => import("./studio/studio").then((m) => ({ default: m.Studio })))

/** A still placeholder while a chunk loads: a fine frame, no spinner, no layout jump for small parts. */
export function Loading({ className = "min-h-64" }: { className?: string }) {
  return (
    <div role="status" className={`grid place-items-center border-ink-fine font-letter text-sm uppercase ${className}`}>
      Inking…
    </div>
  )
}

/** True once the element is within 400px of the screen (and stays true). */
function useNearScreen<E extends Element>(): [React.RefObject<E | null>, boolean] {
  const ref = useRef<E>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "400px" })
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])
  return [ref, near]
}

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loading className="mt-6 min-h-[60vh]" />}>{children}</Suspense>
}

export function App() {
  const [prefs, set] = usePrefs()
  const hash = useHash()
  const [category, setCategory] = useState<string | null>(null)
  const current = items.find((i) => i.name === hash)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [current?.name, hash])

  useEffect(() => {
    if (current) track("open-item", { item: current.name })
  }, [current])

  const pickCategory = (c: string | null) => {
    setCategory(c)
    if (hash !== "" && hash !== "/") location.hash = "/"
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader hash={hash} category={category} onCategory={pickCategory} prefs={prefs} set={set} />
      <main id="main" className="mx-auto max-w-7xl px-4 pb-24">
        {hash === "grammar" ? (
          <Lazy>
            <Grammar />
          </Lazy>
        ) : hash === "legal" ? (
          <Lazy>
            <Legal />
          </Lazy>
        ) : hash === "studio" ? (
          <Lazy>
            <Studio />
          </Lazy>
        ) : hash === "examples" ? (
          <Lazy>
            <Examples />
          </Lazy>
        ) : hash.startsWith("examples/") ? (
          <InterfacePage slug={hash.slice("examples/".length)} />
        ) : current ? (
          <Detail item={current} />
        ) : (
          <Gallery category={category} onCategory={pickCategory} />
        )}
      </main>
      {/* On a component page, phones keep room for the bottom navigation bar. */}
      <footer
        className={`border-t-[length:var(--mg-bw-panel)] border-border px-4 py-6 text-center text-sm ${current ? "max-sm:pb-24" : ""}`}
      >
        MIT licensed. Not affiliated with shadcn.{" "}
        <a href="./llms.txt" className="underline max-sm:inline-flex max-sm:min-h-11 max-sm:items-center">
          llms.txt
        </a>{" "}
        ·{" "}
        <a
          href={GITHUB_URL}
          className="underline max-sm:inline-flex max-sm:min-h-11 max-sm:items-center"
          onClick={() => track("github", { from: "footer" })}
        >
          GitHub
        </a>{" "}
        ·{" "}
        <a href="#legal" className="underline max-sm:inline-flex max-sm:min-h-11 max-sm:items-center">
          Legal notice / Mentions légales
        </a>
      </footer>
    </>
  )
}

/* ---------- Gallery ---------- */

const FONT_SAMPLE: Record<string, string> = {
  "font-body": "font-sans",
  "font-lettering": "font-letter",
  "font-sfx": "font-sfx",
  "font-japanese": "font-[family-name:var(--font-manga-jp)]",
}
const FONT_TEXT: Record<string, string> = { "font-japanese": "あ字" }

function Gallery({ category, onCategory }: { category: string | null; onCategory: (c: string | null) => void }) {
  const narrow = useNarrow()
  const list = filterItems("", category)
  const showHero = !category
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
              <CopyButton
                text={installCommand("button")}
                onCopied={() => track("copy-install", { item: "button" })}
                className="border-s-[length:var(--mg-bw)]"
              />
            </div>
          </div>
          <div data-demo>
            <Hero />
          </div>
        </section>
      )}
      {showHero && (narrow ? <HomeExample /> : <HomeInterfaces />)}

      <section aria-labelledby="gallery-title" className="mt-6">
        <h2 id="gallery-title" className="font-letter text-3xl uppercase">
          {category ? CATEGORIES[category] : "Components"}
        </h2>
        {/* Phones: one line that scrolls sideways, bleeding to the screen edges. */}
        <nav
          aria-label="Categories"
          className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          <CategoryPill active={category === null} onClick={() => onCategory(null)}>
            All
          </CategoryPill>
          {categories.map((c) => (
            <CategoryPill key={c} active={category === c} onClick={() => onCategory(category === c ? null : c)}>
              {CATEGORIES[c] ?? c}
            </CategoryPill>
          ))}
        </nav>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] sm:gap-4">
          {list.map((i) => (
            <li key={i.name}>{narrow ? <CompactCard item={i} /> : <Card item={i} />}</li>
          ))}
        </ul>
      </section>
    </>
  )
}

// The thumbnail's demo chunk loads when the card comes within 400px of the screen.
function Thumbnail({ item }: { item: Item }) {
  const [ref, near] = useNearScreen<HTMLSpanElement>()
  const { demo } = useDemo(item.name, near)
  const Thumb = demo?.Thumb
  const font = FONT_SAMPLE[item.name]
  return (
    <span ref={ref} className="grid place-items-center">
      {Thumb ? <Thumb /> : font ? <span className={`${font} text-5xl`}>{FONT_TEXT[item.name] ?? "Aa"}</span> : null}
    </span>
  )
}

// The preview is live (click, toggle, hover); only the title and the arrow open the detail page.
function Card({ item }: { item: Item }) {
  const href = `#${item.name}`
  return (
    <article className="group relative flex h-full flex-col border-ink bg-background has-[a:hover]:tone-shadow has-[a:hover]:[--shadow-x:5px] has-[a:hover]:[--shadow-y:5px]">
      <div data-demo className="grid h-36 place-items-center overflow-hidden border-b-[length:var(--mg-bw)] border-border p-3">
        <Thumbnail item={item} />
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

// Phones: the whole card opens the page (the title link stretches over it); the preview is a still, scaled
// down and out of the tab order. No link wraps the preview: some previews hold links of their own.
function CompactCard({ item }: { item: Item }) {
  return (
    <article className="relative flex h-full flex-col border-ink bg-background has-[a:active]:ink-fill">
      <div data-demo inert className="pointer-events-none grid h-24 place-items-center overflow-hidden border-b-[length:var(--mg-bw)] border-border p-2">
        <div className="[zoom:0.6]">
          <Thumbnail item={item} />
        </div>
      </div>
      <a
        href={`#${item.name}`}
        className="flex min-h-11 items-center px-2.5 py-2 font-letter text-base leading-tight uppercase after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
      >
        {item.title}
      </a>
    </article>
  )
}

/* ---------- Detail ---------- */

function Detail({ item }: { item: Item }) {
  const { demo, ready } = useDemo(item.name)
  const narrow = useNarrow()
  const list = items.filter((i) => i.type !== "registry:block")
  const index = list.indexOf(item)
  const prev = list[index - 1]
  const next = list[index + 1]
  const props = item.meta?.props ?? []
  return (
    <article aria-labelledby="detail-title" className="pt-6">
      <nav aria-label="Component navigation" className="flex flex-wrap items-center justify-between gap-2">
        <a href="#/" className="inline-flex h-11 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink sm:h-9">
          ← All components
        </a>
        {!narrow && (
          <span className="flex gap-2">
            {prev && <NavLink href={`#${prev.name}`} label={`← ${prev.title}`} />}
            {next && <NavLink href={`#${next.name}`} label={`${next.title} →`} />}
          </span>
        )}
      </nav>

      <header className="mt-6 space-y-2">
        <p className="font-mono text-xs">{CATEGORIES[categoryOf(item)]}</p>
        <h1 id="detail-title" className="font-letter text-4xl leading-none uppercase break-words sm:text-5xl">
          {item.title}
        </h1>
        <p className="max-w-prose text-lg">{item.meta?.tagline ?? item.description}</p>
      </header>

      <div className="mt-5 flex flex-wrap items-stretch gap-2">
        <div className="flex min-w-0 flex-1 basis-64 items-stretch border-ink">
          <code className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{installCommand(item.name)}</code>
          <CopyButton
            text={installCommand(item.name)}
            onCopied={() => track("copy-install", { item: item.name })}
            className="border-s-[length:var(--mg-bw)]"
          />
        </div>
        <CopyForAi item={item} />
      </div>

      <Tabs variant="underline" defaultValue="preview" className="mt-6">
        <TabsList>
          <TabsTrigger value="preview" className="max-sm:min-h-11">
            Preview
          </TabsTrigger>
          {item.meta?.usage && (
            <TabsTrigger value="usage" className="max-sm:min-h-11">
              Usage
            </TabsTrigger>
          )}
          {props.length > 0 && (
            <TabsTrigger value="props" className="max-sm:min-h-11">
              Props
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="preview">
          <div data-demo className="relative border-ink-fine bg-background p-4 sm:p-6">
            {!ready ? <Loading /> : demo?.Preview ? <demo.Preview /> : <p>No live preview for this item.</p>}
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
          <div data-demo>
            <demo.States />
          </div>
        </section>
      )}

      {/* Phones: previous / next in a bar along the bottom edge, within thumb reach. */}
      {narrow && (prev || next) && (
        <nav
          aria-label="Previous and next component"
          className="fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-2 border-t-[length:var(--mg-bw-panel)] border-border bg-background"
        >
          {prev ? (
            <a href={`#${prev.name}`} className="flex min-w-0 items-center gap-1 px-4 font-letter text-sm uppercase focus-ink active:ink-fill">
              <span aria-hidden>←</span>
              <span className="truncate">{prev.title}</span>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a
              href={`#${next.name}`}
              className="flex min-w-0 items-center justify-end gap-1 border-s-[length:var(--mg-bw)] border-border px-4 text-end font-letter text-sm uppercase focus-ink active:ink-fill"
            >
              <span className="truncate">{next.title}</span>
              <span aria-hidden>→</span>
            </a>
          )}
        </nav>
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
