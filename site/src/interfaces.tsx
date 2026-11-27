import { lazy, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react"
import { track } from "./visits"
import { CodeToggle, CopyButton } from "./copy"
import { installCommand } from "./registry"
import { Deferred } from "./load-error"
import { BLOCK_PROPS } from "./block-art"
import { to } from "./router"

/*
 * Full interfaces (registry:block items): each one lives in registry/manga/blocks/<slug>/<slug>.tsx,
 * exports a component named in PascalCase, and is listed here. Routes: /examples/<slug>, /view/<slug>.
 * Blocks and their sources load on demand: an interface's code arrives when it is shown, its source text
 * when "Show the code" is opened.
 */
export type Interface = {
  slug: string
  title: string
  summary: string
  Component: ComponentType<{ titleAs?: "h1" | "h2" }>
  source: () => Promise<string>
  /** Blocks installed by this example when it combines several (Auth); otherwise the slug itself. */
  items?: string[]
}

const modules = import.meta.glob<Record<string, ComponentType>>("../../registry/manga/blocks/*/*.tsx")
const sources = import.meta.glob<string>("../../registry/manga/blocks/*/*.tsx", { query: "?raw", import: "default" })

/** A block while its chunk loads: a frame of about its size, so the page does not jump. */
function Pending({ children }: { children: ReactNode }) {
  return (
    <Deferred
      fallback={
        <div role="status" className="grid min-h-[32rem] place-items-center font-letter text-sm uppercase">
          Inking…
        </div>
      }
    >
      {children}
    </Deferred>
  )
}

/** Order and copy of the interfaces; an entry shows only once its block file exists. */
const CATALOG: { slug: string; title: string; summary: string; screens?: string[] }[] = [
  { slug: "dashboard", title: "Dashboard", summary: "Sidebar, key figures, toned charts, a data table and a command palette." },
  { slug: "tasks", title: "Tasks", summary: "A task board: stamps for statuses, filters and actions on a selection." },
  { slug: "ai-chat", title: "AI chat", summary: "Thinking in a thought bubble, errors shouted, answers typed as they come." },
  { slug: "landing-page", title: "Landing page", summary: "An opening page, features in panels, pricing as a versus, reviews in bubbles." },
  { slug: "story-landing", title: "Story landing", summary: "A product page told as a manga: a magazine cover, a four-panel strip, a guide who talks, chapters." },
  {
    slug: "auth",
    title: "Auth",
    summary: "Sign in, sign up, a forgotten password, a one-time code and a new password: five screens that lead to each other.",
    screens: ["sign-in", "sign-up", "forgot-password", "verify-code", "reset-password"],
  },
  { slug: "manga-reader", title: "Manga reader", summary: "A vertical strip, chapters in a sheet, progress and reading order." },
  { slug: "author-site", title: "Author site", summary: "The site of one series, Mapless: its volumes, the series page, then the chapter read page by page or panel by panel." },
  { slug: "catalog", title: "Catalog", summary: "The books of one series in volume cards, with filters, tabs and search." },
  { slug: "portfolio", title: "Developer portfolio", summary: "Intro, projects in panels, skills as a character sheet, contact." },
]

const pascal = (slug: string) => slug.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

const blockPath = (slug: string) => `../../registry/manga/blocks/${slug}/${slug}.tsx`

/** One block as an interface page: lazy component, source loaded on demand. */
function blockInterface(entry: { slug: string; title: string; summary: string }): Interface[] {
  const path = blockPath(entry.slug)
  const load = modules[path]
  if (!load) return []
  const props = BLOCK_PROPS[entry.slug] ?? {}
  const Component = lazy(() =>
    load().then((mod) => {
      const Block = mod[pascal(entry.slug)] as ComponentType<Record<string, unknown>>
      // the showcase passes its pictures (the blocks ship none)
      return { default: (p: { titleAs?: "h1" | "h2" }) => <Block {...props} {...p} /> }
    }),
  )
  return [{ ...entry, Component, source: () => sources[path]().then(userPaths) }]
}

/*
 * An example made of several blocks (Auth): a site-side flow switches between them (each loads when shown);
 * the code shows every block, one after the other.
 */
function flowInterface(entry: { slug: string; title: string; summary: string; screens: string[] }): Interface[] {
  if (!entry.screens.every((s) => modules[blockPath(s)])) return []
  const Component = lazy(() => import("./examples/auth-flow").then((m) => ({ default: m.AuthFlow })))
  const source = () =>
    Promise.all(entry.screens.map((s) => sources[blockPath(s)]().then((src) => `// ── components/manga/blocks/${s}.tsx ──\n\n${userPaths(src)}`))).then(
      (parts) => parts.join("\n\n"),
    )
  return [{ slug: entry.slug, title: entry.title, summary: entry.summary, Component, source, items: entry.screens }]
}

export const interfaces: Interface[] = CATALOG.flatMap((entry) => (entry.screens ? flowInterface({ ...entry, screens: entry.screens }) : blockInterface(entry)))

/** The screens of a flow also open on their own (/examples/sign-up…), without a card of their own. */
const screenPages: Interface[] = CATALOG.flatMap((entry) =>
  (entry.screens ?? []).flatMap((slug) =>
    blockInterface({ slug, title: slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()), summary: `One screen of the ${entry.title} example.` }),
  ),
)

/** The install command of an interface: one block, or every block of a flow. */
const installFor = (i: Interface) =>
  i.items ? [installCommand(i.items[0]), ...i.items.slice(1).map((s) => installCommand(s).split(" ").pop())].join(" ") : installCommand(i.slug)

// Show the import paths a user gets after installing, not the showcase's own aliases.
export const userPaths = (src: string) =>
  src
    .replace(/@registry\/manga\/ui\//g, "@/components/ui/manga/")
    .replace(/@registry\/manga\/signature\//g, "@/components/manga/")
    .replace(/@registry\/manga\/blocks\/[\w-]+\//g, "@/components/manga/blocks/")
    .replace(/"\.\.\/art"/g, `"./art" // your own drawings`)

/** Looks an interface up by slug: the ten examples, then the Auth screens on their own. */
export const findInterface = (slug: string) => interfaces.find((i) => i.slug === slug) ?? screenPages.find((i) => i.slug === slug)

function Unknown({ slug }: { slug: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-letter text-4xl uppercase">No interface called “{slug}”</h1>
      <p className="mt-4">
        <a href={to("examples")} className="underline">
          See all examples
        </a>
        .
      </p>
    </div>
  )
}

/**
 * One interface: its install command, then the interface itself, full width and full height (no frame
 * with a scroll of its own), then its code. "Open full screen" shows it alone, without the site header.
 */
export function InterfacePage({ slug }: { slug: string }) {
  const found = findInterface(slug)
  useEffect(() => {
    if (found) document.title = `${found.title} — mangacn examples`
  }, [found])
  if (!found) return <Unknown slug={slug} />
  const { title, summary, Component, source } = found
  return (
    <article aria-labelledby="iface-title">
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <nav aria-label="Breadcrumb" className="font-mono text-xs">
          <a href={to("examples")} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline focus-ink sm:min-h-6">
            Examples
          </a>
          <span aria-hidden> / </span>
          <span>{title}</span>
        </nav>
        <header className="mt-3 max-w-prose space-y-2">
          <h1 id="iface-title" className="font-letter text-4xl leading-none uppercase sm:text-5xl">
            {title}
          </h1>
          <p className="text-lg">{summary}</p>
        </header>
        <div className="mt-5 flex flex-wrap items-stretch gap-2">
          <div className="flex min-w-0 flex-1 basis-72 items-stretch border-ink">
            <code className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{installFor(found)}</code>
            <CopyButton text={installFor(found)} onCopied={() => track("copy-install", { item: slug })} className="border-s-[length:var(--mg-bw)]" />
          </div>
          <a href={to(`view/${slug}`)} className="inline-flex min-h-11 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink sm:min-h-9">
            Open full screen
          </a>
          <a href="#code" className="inline-flex min-h-11 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink sm:min-h-9">
            View code
          </a>
        </div>
      </div>
      {/* the interface takes the whole width of the window and its natural height */}
      <div data-demo data-interface={slug} className="mt-6 border-y-[length:var(--mg-bw-panel)] border-border bg-background">
        <Pending key={slug}>
          <Component titleAs="h2" />
        </Pending>
      </div>
      <section aria-labelledby="code" className="mx-auto max-w-7xl px-4 pt-8">
        <h2 id="code" className="scroll-mt-20 font-letter text-3xl uppercase">
          Code
        </h2>
        <div className="mt-3">
          <CodeToggle load={source} />
        </div>
      </section>
    </article>
  )
}

/** /view/<slug>: the interface alone, as it would look in your app. */
export function InterfaceView({ slug }: { slug: string }) {
  const found = findInterface(slug)
  useEffect(() => {
    if (found) document.title = `${found.title} — mangacn`
  }, [found])
  if (!found) return <Unknown slug={slug} />
  const { title, Component } = found
  return (
    <main id="main" aria-label={title} data-interface={slug}>
      <Pending key={slug}>
        <Component />
      </Pending>
    </main>
  )
}

/** True once the element is within 300px of the screen (and stays true). */
function useNear<E extends Element>(): [React.RefObject<E | null>, boolean] {
  const ref = useRef<E>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "300px" })
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])
  return [ref, near]
}

/**
 * The vignette of an interface: its top corner at real size (a readable detail, not the whole page shrunk),
 * a still out of the tab order. It renders when the card comes near the screen.
 */
function Vignette({ i }: { i: Interface }) {
  const [ref, near] = useNear<HTMLDivElement>()
  const { Component } = i
  return (
    <div ref={ref} data-demo inert aria-hidden className="pointer-events-none relative h-52 overflow-hidden border-b-[length:var(--mg-bw)] border-border [contain:strict] [transform:translateZ(0)]">
      {near && (
        <div className="w-[64rem] max-sm:w-screen">
          <Deferred fallback={null}>
            <Component titleAs="h2" />
          </Deferred>
        </div>
      )}
    </div>
  )
}

/** Cards on the Examples page: vignette, name, one sentence. */
export function InterfaceCards() {
  if (!interfaces.length) return null
  return (
    <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-5">
      {interfaces.map((i) => (
        <li key={i.slug}>
          <article className="relative flex h-full flex-col border-ink bg-background has-[a:hover]:tone-shadow">
            <Vignette i={i} />
            <div className="grid gap-1 p-4">
              <a
                href={to(`examples/${i.slug}`)}
                className="font-letter text-2xl leading-none uppercase after:absolute after:inset-0 hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
              >
                {i.title}
              </a>
              <span className="text-sm">{i.summary}</span>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}
