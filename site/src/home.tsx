import { lazy, useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { CopyButton } from "./copy"
import { MANGA_GROUPS } from "./docs/nav"
import { familyItems } from "./docs/components-index"
import { Hero } from "./hero"
import { interfaces } from "./interfaces"
import { Deferred } from "./load-error"
import { installCommand, items } from "./registry"
import { to } from "./router"
import { track } from "./visits"

/*
 * Home page, like the shadcn site: the title and the install command; the ten interfaces in tabs, the chosen
 * one shown large; a wall of live components; the pieces by family. The gallery of every component lives in
 * the documentation (/docs/components).
 */

const HomeWall = lazy(() => import("./home-wall").then((m) => ({ default: m.HomeWall })))

const ORDER = ["dashboard", "tasks", "ai-chat", "landing-page", "story-landing", "auth", "manga-reader", "author-site", "catalog", "portfolio"]

/** True once the element is within 600px of the screen (and stays true). */
function useNear<E extends Element>(): [React.RefObject<E | null>, boolean] {
  const ref = useRef<E>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px" })
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])
  return [ref, near]
}

const Inking = ({ className }: { className: string }) => (
  <div role="status" className={`grid place-items-center font-letter text-sm uppercase ${className}`}>
    Inking…
  </div>
)

function Interfaces() {
  const shown = ORDER.flatMap((slug) => interfaces.filter((i) => i.slug === slug))
  const [tab, setTab] = useState(shown[0]?.slug ?? "")
  if (!shown.length) return null
  const current = shown.find((i) => i.slug === tab) ?? shown[0]
  return (
    <section aria-labelledby="home-ifaces" className="mt-6">
      <h2 id="home-ifaces" className="sr-only">
        Ten interfaces made with the kit
      </h2>
      <Tabs variant="underline" value={tab} onValueChange={(v) => setTab(String(v))}>
        {/* all ten in one row; it scrolls sideways when the screen is narrow */}
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <TabsList aria-label="Interfaces" className="w-max min-w-full flex-nowrap">
            {shown.map((i) => (
              <TabsTrigger key={i.slug} value={i.slug} className="min-h-11 shrink-0 whitespace-nowrap">
                {i.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value={current.slug} className="mt-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="max-w-prose text-sm">{current.summary}</p>
            <div className="flex gap-2">
              <a href={to(`view/${current.slug}`)} className="inline-flex h-11 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink sm:h-9">
                Open full screen
              </a>
              <a href={to(`examples/${current.slug}#code`)} className="inline-flex h-11 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink sm:h-9">
                View code
              </a>
            </div>
          </div>
          <div data-demo className="border-ink-panel bg-background md:overflow-clip">
            <Deferred key={current.slug} resetKey={current.slug} fallback={<Inking className="min-h-[32rem]" />}>
              <current.Component titleAs="h2" />
            </Deferred>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

function Wall() {
  const [ref, near] = useNear<HTMLDivElement>()
  return (
    <section aria-labelledby="home-wall" className="mt-16">
      <h2 id="home-wall" className="font-letter text-3xl leading-none uppercase sm:text-4xl">
        Try them here
      </h2>
      <p className="mt-2 max-w-prose">Real components, live: type, toggle, pick a day, flip a page. Each card links to its page.</p>
      <div ref={ref} className="mt-6 min-h-[40rem]">
        {near && (
          <Deferred fallback={<Inking className="min-h-[40rem]" />}>
            <HomeWall />
          </Deferred>
        )}
      </div>
    </section>
  )
}

/** The pieces by family, each one leading to its part of the documentation. */
function Pieces() {
  const families = [
    { title: "Foundations", count: familyItems("foundations").length, route: "docs/components#foundations" },
    { title: "Actions and input", count: familyItems("actions").length, route: "docs/components#actions" },
    { title: "Feedback", count: familyItems("feedback").length, route: "docs/components#feedback" },
    { title: "Overlays", count: familyItems("overlays").length, route: "docs/components#overlays" },
    { title: "Navigation", count: familyItems("navigation").length, route: "docs/components#navigation" },
    { title: "Display", count: familyItems("display").length, route: "docs/components#display" },
    ...MANGA_GROUPS.map((g) => ({ title: `Manga: ${g.title}`, count: familyItems(g.id).length, route: `docs/components#${g.id}` })),
    { title: "Full interfaces", count: items.filter((i) => i.type === "registry:block").length, route: "examples" },
  ]
  return (
    <section aria-labelledby="home-pieces" className="mt-16">
      <h2 id="home-pieces" className="font-sfx text-4xl uppercase sm:text-5xl">
        {items.length} pieces
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {families.map((f) => (
          <li key={f.title}>
            <a href={to(f.route)} className="flex h-full min-h-20 flex-col justify-between gap-2 border-ink p-3 hover:ink-fill focus-ink">
              <span className="font-letter text-base leading-tight uppercase">{f.title}</span>
              <span className="font-sfx text-3xl leading-none">{f.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Home() {
  useEffect(() => {
    document.title = "mangacn — shadcn/ui, inked like a manga"
  }, [])
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24">
      <section className="grid grid-cols-[minmax(0,1fr)] gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
        <div className="space-y-5">
          <h1 className="font-sfx text-[2rem] leading-[1.05] uppercase sm:text-[2.4rem] lg:text-[1.85rem] xl:text-[2.35rem]">
            shadcn/ui,
            <br />
            inked like a manga.
          </h1>
          <p className="max-w-prose text-lg">
            A shadcn registry that redraws your components in ink and screentone. Same components, same props, new lines.
          </p>
          <div className="flex max-w-xl items-stretch border-ink">
            <code className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{installCommand("button")}</code>
            <CopyButton text={installCommand("button")} onCopied={() => track("copy-install", { item: "button" })} className="border-s-[length:var(--mg-bw)]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={to("docs")} className="inline-flex h-11 items-center ink-fill px-4 font-letter text-base uppercase focus-ink">
              Get started
            </a>
            <a href={to("docs/components")} className="inline-flex h-11 items-center border-ink px-4 font-letter text-base uppercase hover:ink-fill focus-ink">
              Browse components
            </a>
          </div>
        </div>
        <div data-demo>
          <Hero />
        </div>
      </section>
      <Interfaces />
      <Wall />
      <Pieces />
    </div>
  )
}
