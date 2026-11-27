import { useEffect, useRef, useState } from "react"
import { LoadBoundary, LoadError } from "../load-error"
import { useNarrow } from "../narrow"
import { useDemo, type Item } from "../registry"
import { to } from "../router"
import { COMPONENT_GROUPS, GROUP_TITLE, MANGA_GROUPS, componentRoute, docItems, familyOf } from "./nav"

/*
 * /docs/components: every component as a card with a live preview, by family, with filters.
 * A filter is also the address's #section (/docs/components#overlays), so the breadcrumb and the home page
 * can point at one family.
 */

const FONT_SAMPLE: Record<string, string> = {
  "font-body": "font-sans",
  "font-lettering": "font-letter",
  "font-sfx": "font-sfx",
  "font-japanese": "font-[family-name:var(--font-manga-jp)]",
}
const FONT_TEXT: Record<string, string> = { "font-japanese": "あ字" }

export const FAMILIES: { id: string; title: string; section: "Components" | "Manga" }[] = [
  ...COMPONENT_GROUPS.map((id) => ({ id, title: GROUP_TITLE[id], section: "Components" as const })),
  ...MANGA_GROUPS.map((g) => ({ id: g.id, title: g.title, section: "Manga" as const })),
]

export const familyItems = (id: string) => docItems.filter((i) => familyOf(i).id === id)

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

// The thumbnail's demo chunk loads when the card comes within 400px of the screen.
function Thumbnail({ item }: { item: Item }) {
  const [ref, near] = useNearScreen<HTMLSpanElement>()
  const { demo, failed } = useDemo(item.name, near)
  const Thumb = demo?.Thumb
  const font = FONT_SAMPLE[item.name]
  return (
    <span ref={ref} className="grid place-items-center">
      {failed ? (
        <LoadError compact />
      ) : Thumb ? (
        <LoadBoundary compact>
          <Thumb />
        </LoadBoundary>
      ) : font ? (
        <span className={`${font} text-5xl`}>{FONT_TEXT[item.name] ?? "Aa"}</span>
      ) : null}
    </span>
  )
}

// The preview is live (click, toggle, hover); only the title and the arrow open the page.
function Card({ item }: { item: Item }) {
  const href = to(componentRoute(item.name))
  return (
    <article data-card={item.name} className="group relative flex h-full flex-col border-ink bg-background has-[a:hover]:tone-shadow has-[a:hover]:[--shadow-x:5px] has-[a:hover]:[--shadow-y:5px]">
      <div data-demo data-thumb className="grid h-36 place-items-center overflow-hidden border-b-[length:var(--mg-bw)] border-border p-3">
        <Thumbnail item={item} />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <a href={href} className="font-letter text-xl leading-none uppercase hover:underline focus-ink">
          {item.title}
        </a>
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

// Phones: the whole card opens the page; the preview is a still, out of the tab order.
function CompactCard({ item }: { item: Item }) {
  return (
    <article data-card={item.name} className="relative flex h-full flex-col border-ink bg-background has-[a:active]:ink-fill">
      <div data-demo data-thumb inert className="pointer-events-none grid h-28 place-items-center overflow-hidden border-b-[length:var(--mg-bw)] border-border p-2">
        <div className="[zoom:0.7]">
          <Thumbnail item={item} />
        </div>
      </div>
      <a
        href={to(componentRoute(item.name))}
        className="flex min-h-11 items-center px-2.5 py-2 font-letter text-base leading-tight uppercase after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
      >
        {item.title}
      </a>
    </article>
  )
}

function readFilter() {
  const h = decodeURIComponent(location.hash.slice(1))
  return FAMILIES.some((f) => f.id === h) ? h : null
}

export function ComponentsIndex() {
  const narrow = useNarrow()
  const [filter, setFilter] = useState<string | null>(readFilter)
  useEffect(() => {
    document.title = "Components — mangacn"
    const on = () => setFilter(readFilter())
    addEventListener("hashchange", on)
    return () => removeEventListener("hashchange", on)
  }, [])
  const pick = (id: string | null) => {
    setFilter(id)
    history.replaceState(null, "", id ? `#${id}` : location.pathname)
  }
  const shown = FAMILIES.filter((f) => (!filter || f.id === filter) && familyItems(f.id).length)
  return (
    <article aria-labelledby="page-title">
      <header className="space-y-3">
        <p className="font-mono text-xs">Components</p>
        <h1 id="page-title" className="font-letter text-4xl leading-none uppercase sm:text-5xl">
          All components
        </h1>
        <p className="text-lg">
          {docItems.length} components, each one live: click, type and toggle in the cards. The title opens its page.
        </p>
      </header>
      <nav aria-label="Families" data-toc-skip className="-mx-4 mt-5 flex gap-1.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        <Pill active={filter === null} onClick={() => pick(null)}>
          All
        </Pill>
        {FAMILIES.map((f) => (
          <Pill key={f.id} active={filter === f.id} onClick={() => pick(filter === f.id ? null : f.id)}>
            {f.title}
          </Pill>
        ))}
      </nav>
      {shown.map((f) => (
        <section key={f.id} aria-labelledby={f.id} className="mt-10">
          <h2 id={f.id} className="scroll-mt-20 font-letter text-3xl leading-none uppercase">
            {f.title} <span className="font-mono text-sm normal-case">{familyItems(f.id).length}</span>
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] sm:gap-4">
            {familyItems(f.id).map((i) => (
              <li key={i.name}>{narrow ? <CompactCard item={i} /> : <Card item={i} />}</li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  )
}

function Pill(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={props.active}
      onClick={props.onClick}
      className="h-11 shrink-0 border-ink-fine px-3 font-letter text-sm uppercase hover:border-ink focus-ink aria-pressed:ink-fill sm:h-8 sm:px-2.5"
    >
      {props.children}
    </button>
  )
}
