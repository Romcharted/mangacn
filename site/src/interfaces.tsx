import { Suspense, lazy, useId, useState, type ComponentType, type ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { track } from "./visits"
import { CodeToggle, CopyButton } from "./copy"
import { installCommand } from "./registry"

/*
 * Full interfaces (registry:block items): each one lives in registry/manga/blocks/<slug>/<slug>.tsx,
 * exports a component named in PascalCase, and is listed here. Route: #examples/<slug>.
 * Blocks and their sources load on demand: an interface's code arrives when it is shown, its source text
 * when "Show the code" is opened.
 */
export type Interface = {
  slug: string
  title: string
  summary: string
  Component: ComponentType
  source: () => Promise<string>
  /** Blocks installed by this example when it combines several (Auth); otherwise the slug itself. */
  items?: string[]
}

const modules = import.meta.glob<Record<string, ComponentType>>("../../registry/manga/blocks/*/*.tsx")
const sources = import.meta.glob<string>("../../registry/manga/blocks/*/*.tsx", { query: "?raw", import: "default" })

/** A block while its chunk loads: a frame of about its size, so the page does not jump. */
function Pending({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div role="status" className="grid min-h-[32rem] place-items-center font-letter text-sm uppercase">
          Inking…
        </div>
      }
    >
      {children}
    </Suspense>
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
  { slug: "catalog", title: "Catalog", summary: "Volume cards, filters, tabs and search." },
  { slug: "portfolio", title: "Developer portfolio", summary: "Intro, projects in panels, skills as a character sheet, contact." },
]

const pascal = (slug: string) => slug.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

const blockPath = (slug: string) => `../../registry/manga/blocks/${slug}/${slug}.tsx`

/** One block as an interface page: lazy component, source loaded on demand. */
function blockInterface(entry: { slug: string; title: string; summary: string }): Interface[] {
  const path = blockPath(entry.slug)
  const load = modules[path]
  if (!load) return []
  const Component = lazy(() => load().then((mod) => ({ default: mod[pascal(entry.slug)] })))
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

/** The screens of a flow also open on their own (#examples/sign-up…), without a card of their own. */
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

/** One interface, full width: install, live render, code on demand. */
export function InterfacePage({ slug }: { slug: string }) {
  const found = interfaces.find((i) => i.slug === slug) ?? screenPages.find((i) => i.slug === slug)
  if (!found) {
    return (
      <p className="mt-8 border-ink p-6 font-letter text-lg uppercase">
        No interface called “{slug}”. <a href="#examples" className="underline">See all examples</a>.
      </p>
    )
  }
  const { title, summary, Component, source } = found
  return (
    <article aria-labelledby="iface-title" className="pt-6">
      <nav aria-label="Examples navigation" className="flex flex-wrap gap-2">
        <a href="#examples" className="inline-flex h-11 items-center border-ink px-3 sm:h-9 font-letter text-sm uppercase hover:ink-fill focus-ink">
          ← All examples
        </a>
      </nav>
      <header className="mt-6 max-w-prose space-y-2">
        <h1 id="iface-title" className="font-letter text-5xl leading-none uppercase">
          {title}
        </h1>
        <p className="text-lg">{summary}</p>
      </header>
      <div className="mt-5 flex max-w-2xl items-stretch border-ink">
        <code className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{installFor(found)}</code>
        <CopyButton text={installFor(found)} onCopied={() => track("copy-install", { item: slug })} className="border-s-[length:var(--mg-bw)]" />
      </div>
      <div data-demo className="mt-6 border-ink-panel bg-background md:overflow-clip">
        <Pending>
          <Component />
        </Pending>
      </div>
      <div className="mt-4">
        <CodeToggle load={source} />
      </div>
    </article>
  )
}

/** Home page: tabs that switch between live interfaces, like the shadcn site does. */
export function HomeInterfaces() {
  const shown = interfaces.filter((i) => ["dashboard", "ai-chat", "landing-page", "manga-reader", "tasks"].includes(i.slug)).slice(0, 4)
  if (!shown.length) return null
  return (
    <section aria-labelledby="home-ifaces" className="mt-4 mb-10">
      <h2 id="home-ifaces" className="sr-only">
        Interfaces made with the kit
      </h2>
      <Tabs variant="underline" defaultValue={shown[0].slug}>
        <TabsList className="flex-wrap">
          {shown.map((i) => (
            <TabsTrigger key={i.slug} value={i.slug}>
              {i.title}
            </TabsTrigger>
          ))}
          <a href="#examples" className="ms-auto self-center font-letter text-sm uppercase underline decoration-2 underline-offset-4 focus-ink">
            All examples →
          </a>
        </TabsList>
        {shown.map((i) => (
          <TabsContent key={i.slug} value={i.slug}>
            <div data-demo className="border-ink-panel bg-background md:overflow-clip">
              <Pending>
                <i.Component />
              </Pending>
            </div>
            <a href={`#examples/${i.slug}`} className="mt-3 inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink">
              Open {i.title} with its code →
            </a>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

/** Cards on the Examples page. */
export function InterfaceCards() {
  if (!interfaces.length) return null
  return (
    <ul className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
      {interfaces.map((i) => (
        <li key={i.slug}>
          <a href={`#examples/${i.slug}`} className="flex h-full flex-col gap-1 border-ink p-4 hover-lift focus-ink">
            <span className="font-letter text-2xl uppercase">{i.title}</span>
            <span className="text-sm">{i.summary}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Phones, home page: one interface, folded. The button unfolds it in place, the page keeps scrolling. */
export function HomeExample() {
  const [open, setOpen] = useState(false)
  const id = useId()
  const first = interfaces[0]
  if (!first) return null
  const { Component } = first
  return (
    <section aria-labelledby={`${id}-title`} className="mt-2 border-ink-panel bg-background">
      <div className="grid gap-2 p-4">
        <p className="font-mono text-xs">Made only with the kit</p>
        <h2 id={`${id}-title`} className="font-letter text-3xl leading-none uppercase">
          {first.title}
        </h2>
        <p>{first.summary}</p>
        <div className="mt-1 flex flex-wrap gap-2">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${id}-body`}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-11 items-center gap-2 border-ink px-3 font-letter text-sm uppercase focus-ink aria-expanded:ink-fill after:mark-chevron after:text-xs aria-expanded:after:rotate-180"
          >
            {open ? "Fold the example" : "Open the example"}
          </button>
          <a href="#examples" className="inline-flex h-11 items-center px-2 font-letter text-sm uppercase underline decoration-2 underline-offset-4 focus-ink">
            All examples →
          </a>
        </div>
      </div>
      {open && (
        <div id={`${id}-body`} data-demo className="border-t-[length:var(--mg-bw-panel)] border-border">
          <Pending>
            <Component />
          </Pending>
        </div>
      )}
    </section>
  )
}
