import type { ComponentType } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { track } from "./visits"
import { CodeToggle, CopyButton } from "./copy"
import { installCommand } from "./registry"

/*
 * Full interfaces (registry:block items): each one lives in registry/manga/blocks/<slug>/<slug>.tsx,
 * exports a component named in PascalCase, and is listed here. Route: #examples/<slug>.
 */
export type Interface = { slug: string; title: string; summary: string; Component: ComponentType; source: string }

const modules = import.meta.glob<Record<string, ComponentType>>("../../registry/manga/blocks/*/*.tsx", { eager: true })
const sources = import.meta.glob<string>("../../registry/manga/blocks/*/*.tsx", { eager: true, query: "?raw", import: "default" })

/** Order and copy of the interfaces; an entry shows only once its block file exists. */
const CATALOG: { slug: string; title: string; summary: string }[] = [
  { slug: "dashboard", title: "Dashboard", summary: "Sidebar, key figures, toned charts, a data table and a command palette." },
  { slug: "tasks", title: "Tasks", summary: "A task board: stamps for statuses, filters and actions on a selection." },
  { slug: "ai-chat", title: "AI chat", summary: "Thinking in a thought bubble, errors shouted, answers typed as they come." },
  { slug: "landing-page", title: "Landing page", summary: "An opening page, features in panels, pricing as a versus, reviews in bubbles." },
  { slug: "sign-in", title: "Sign in", summary: "A big manga panel beside the form, with a one-time code." },
  { slug: "manga-reader", title: "Manga reader", summary: "A vertical strip, chapters in a sheet, progress and reading order." },
  { slug: "catalog", title: "Catalog", summary: "Volume cards, filters, tabs and search." },
  { slug: "portfolio", title: "Developer portfolio", summary: "Intro, projects in panels, skills as a character sheet, contact." },
]

const pascal = (slug: string) => slug.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())

export const interfaces: Interface[] = CATALOG.flatMap((entry) => {
  const path = `../../registry/manga/blocks/${entry.slug}/${entry.slug}.tsx`
  const Component = modules[path]?.[pascal(entry.slug)]
  return Component ? [{ ...entry, Component, source: sources[path] }] : []
})

// Show the import paths a user gets after installing, not the showcase's own aliases.
export const userPaths = (src: string) =>
  src
    .replace(/@registry\/manga\/ui\//g, "@/components/ui/manga/")
    .replace(/@registry\/manga\/signature\//g, "@/components/manga/")
    .replace(/@registry\/manga\/blocks\/[\w-]+\//g, "@/components/manga/blocks/")
    .replace(/"\.\.\/art"/g, `"./art" // your own drawings`)

/** One interface, full width: install, live render, code on demand. */
export function InterfacePage({ slug }: { slug: string }) {
  const found = interfaces.find((i) => i.slug === slug)
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
        <a href="#examples" className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink">
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
        <code className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{installCommand(slug)}</code>
        <CopyButton text={installCommand(slug)} onCopied={() => track("copy-install", { item: slug })} className="border-s-[length:var(--mg-bw)]" />
      </div>
      <div className="mt-6 overflow-hidden border-ink-panel bg-background">
        <Component />
      </div>
      <div className="mt-4">
        <CodeToggle text={userPaths(source)} />
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
            <div className="overflow-hidden border-ink-panel bg-background">
              <i.Component />
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
