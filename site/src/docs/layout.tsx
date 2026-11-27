import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { interfaces } from "../interfaces"
import { to } from "../router"
import { docOrder, docSections } from "./nav"

/*
 * Documentation layout, like the shadcn site: on large screens three columns (the navigation on the left,
 * sticky with its own scroll; the page; "On this page" on the right, sticky). On phones one column: the
 * navigation lives in the header's Menu sheet and "On this page" folds at the top of the page.
 * The layout stays mounted from one docs page to the next, so the left column keeps its scroll position.
 */

const sections = () => docSections(interfaces.map((i) => ({ slug: i.slug, title: i.title })))

/** The navigation tree with a filter field. Used in the left column and in the phone menu. */
export function DocsNav({ route, onNavigate, idPrefix = "nav" }: { route: string; onNavigate?: () => void; idPrefix?: string }) {
  const [query, setQuery] = useState("")
  const q = query.trim().toLowerCase()
  const list = sections()
    .map((s) => ({ ...s, groups: s.groups.map((g) => ({ ...g, links: g.links.filter((l) => !q || l.title.toLowerCase().includes(q)) })).filter((g) => g.links.length) }))
    .filter((s) => s.groups.length)
  return (
    <div className="grid gap-5">
      <label className="grid gap-1">
        <span className="sr-only">Filter the documentation</span>
        <input
          type="search"
          id={`${idPrefix}-filter`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter…"
          className="h-11 w-full border-ink bg-background px-2.5 text-base focus-ink lg:h-9 lg:text-sm"
        />
      </label>
      {list.length === 0 && <p className="text-sm">Nothing matches “{query}”.</p>}
      {list.map((s) => (
        <nav key={s.id} aria-label={s.title} className="grid gap-2">
          <p className="font-letter text-base uppercase">{s.title}</p>
          {s.groups.map((g, gi) => (
            <div key={gi} className="grid gap-0.5">
              {g.title && <p className="mt-1 px-2 font-mono text-[0.7rem] uppercase">{g.title}</p>}
              <ul className="grid">
                {g.links.map((l) => {
                  const current = l.route === route
                  return (
                    <li key={l.route}>
                      <a
                        href={to(l.route)}
                        onClick={onNavigate}
                        aria-current={current ? "page" : undefined}
                        data-current={current || undefined}
                        className="flex min-h-11 items-center px-2 text-[0.95rem] leading-tight hover:underline hover:decoration-2 hover:underline-offset-4 focus-ink aria-[current=page]:ink-fill lg:min-h-8 lg:text-sm"
                      >
                        {l.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      ))}
    </div>
  )
}

type Heading = { id: string; text: string; level: number }

/** The h2 and h3 with an id inside the page, kept up to date while parts of it load. */
function useHeadings(root: React.RefObject<HTMLElement | null>, route: string) {
  const [headings, setHeadings] = useState<Heading[]>([])
  useEffect(() => {
    const el = root.current
    if (!el) return
    const read = () => {
      const next = [...el.querySelectorAll<HTMLElement>("h2[id], h3[id]")]
        .filter((h) => !h.closest("[data-demo]") && !h.closest("[data-toc-skip]"))
        .map((h) => ({ id: h.id, text: h.dataset.tocLabel ?? h.textContent ?? "", level: h.tagName === "H2" ? 2 : 3 }))
      setHeadings((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(el, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [root, route])
  return headings
}

/** The section on screen: the last heading whose top has passed a line a third of the way down. */
function useActive(headings: Heading[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!headings.length) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const line = 56 + (innerHeight - 56) / 3
        let current: string | null = headings[0].id
        for (const h of headings) {
          const el = document.getElementById(h.id)
          if (el && el.getBoundingClientRect().top <= line) current = h.id
        }
        // at the very bottom, the last section counts even if its heading never reached the line
        if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) current = headings[headings.length - 1].id
        setActive(current)
      })
    }
    update()
    addEventListener("scroll", update, { passive: true })
    addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      removeEventListener("scroll", update)
      removeEventListener("resize", update)
    }
  }, [headings])
  return active
}

function TocList({ headings, active, onPick }: { headings: Heading[]; active: string | null; onPick?: () => void }) {
  return (
    <ul className="grid">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={onPick}
            aria-current={active === h.id ? "location" : undefined}
            className={`flex min-h-11 items-center border-s-[length:var(--mg-bw-fine)] border-border py-1 text-sm leading-tight hover:underline focus-ink aria-[current=location]:border-s-[length:var(--mg-bw-panel)] aria-[current=location]:font-bold lg:min-h-7 ${h.level === 3 ? "ps-5" : "ps-3"}`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Previous and next page at the bottom of every documentation page. */
function PrevNext({ route }: { route: string }) {
  const order = docOrder()
  const at = order.findIndex((l) => l.route === route)
  if (at < 0) return null
  const prev = order[at - 1]
  const next = order[at + 1]
  return (
    <nav aria-label="Previous and next page" data-toc-skip className="mt-16 grid grid-cols-2 gap-3 border-t-[length:var(--mg-bw-fine)] border-border pt-6">
      {prev ? (
        <a href={to(prev.route)} className="grid min-h-11 content-center gap-0.5 border-ink-fine px-3 py-2 hover:border-ink focus-ink">
          <span className="font-mono text-xs">← Previous</span>
          <span className="font-letter text-base uppercase leading-tight">{prev.title}</span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a href={to(next.route)} className="grid min-h-11 content-center justify-items-end gap-0.5 border-ink-fine px-3 py-2 text-end hover:border-ink focus-ink">
          <span className="font-mono text-xs">Next →</span>
          <span className="font-letter text-base uppercase leading-tight">{next.title}</span>
        </a>
      )}
    </nav>
  )
}

export function DocsLayout({ route, children }: { route: string; children: ReactNode }) {
  const article = useRef<HTMLDivElement>(null)
  const aside = useRef<HTMLElement>(null)
  const headings = useHeadings(article, route)
  const active = useActive(headings)
  const [tocOpen, setTocOpen] = useState(false)
  const tocId = useId()

  // The current link stays in view in the left column (first load, or a page opened from elsewhere).
  useLayoutEffect(() => {
    const box = aside.current
    const link = box?.querySelector<HTMLElement>("[data-current]")
    if (!box || !link) return
    const top = link.offsetTop - box.offsetTop
    if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 40) box.scrollTop = top - box.clientHeight / 3
  }, [route])

  useEffect(() => setTocOpen(false), [route])

  return (
    <div className="mx-auto grid max-w-[90rem] grid-cols-[minmax(0,1fr)] gap-8 px-4 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)_12rem]">
      <aside
        ref={aside}
        aria-label="Documentation"
        className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain py-6 pe-2 lg:block"
      >
        <DocsNav route={route} />
      </aside>

      <div className="min-w-0 pt-6 pb-10">
        {headings.length > 1 && (
          <div className="mb-6 border-ink xl:hidden">
            <button
              type="button"
              aria-expanded={tocOpen}
              aria-controls={tocId}
              onClick={() => setTocOpen((o) => !o)}
              className="flex h-11 w-full items-center justify-between px-3 font-letter text-sm uppercase focus-ink aria-expanded:ink-fill after:mark-chevron after:text-xs aria-expanded:after:rotate-180"
            >
              On this page
            </button>
            {tocOpen && (
              <div id={tocId} className="border-t-[length:var(--mg-bw)] border-border p-2">
                <TocList headings={headings} active={active} onPick={() => setTocOpen(false)} />
              </div>
            )}
          </div>
        )}
        <div ref={article} className="mx-auto max-w-3xl">
          {children}
          <PrevNext route={route} />
        </div>
      </div>

      <aside aria-label="On this page" className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] overflow-y-auto py-6 xl:block">
        {headings.length > 0 && (
          <>
            <p className="mb-2 font-letter text-sm uppercase">On this page</p>
            <TocList headings={headings} active={active} />
          </>
        )}
      </aside>
    </div>
  )
}
