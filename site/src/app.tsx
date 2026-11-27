import { lazy, useEffect, type ReactNode } from "react"
import { DocsLayout } from "./docs/layout"
import { SiteHeader } from "./header"
import { Home } from "./home"
import { InterfacePage, InterfaceView } from "./interfaces"
import { Deferred } from "./load-error"
import { usePrefs } from "./prefs"
import { GITHUB_URL, items } from "./registry"
import { legacy, navigate, to, useRoute } from "./router"
import { track } from "./visits"

/*
 * Routes (real paths, see router.ts):
 *   /                          home
 *   /docs, /docs/<page>        Get started pages
 *   /docs/components           every component, live
 *   /docs/components/<name>    one component
 *   /examples, /examples/<x>   the interfaces; /view/<x> shows one alone, without the site's header
 *   /studio, /legal
 * Everything but the home page and the docs frame loads on demand.
 */

const Grammar = lazy(() => import("./docs/pages").then((m) => ({ default: m.GrammarPage })))
const Introduction = lazy(() => import("./docs/pages").then((m) => ({ default: m.Introduction })))
const Installation = lazy(() => import("./docs/pages").then((m) => ({ default: m.Installation })))
const Theming = lazy(() => import("./docs/pages").then((m) => ({ default: m.Theming })))
const Fonts = lazy(() => import("./docs/pages").then((m) => ({ default: m.Fonts })))
const ReadingDirection = lazy(() => import("./docs/pages").then((m) => ({ default: m.ReadingDirection })))
const ForAi = lazy(() => import("./docs/pages").then((m) => ({ default: m.ForAi })))
const Changelog = lazy(() => import("./docs/pages").then((m) => ({ default: m.Changelog })))
const ComponentPage = lazy(() => import("./docs/component-page").then((m) => ({ default: m.ComponentPage })))
const ComponentsIndex = lazy(() => import("./docs/components-index").then((m) => ({ default: m.ComponentsIndex })))
const Examples = lazy(() => import("./examples").then((m) => ({ default: m.Examples })))
const Legal = lazy(() => import("./legal").then((m) => ({ default: m.Legal })))
const Studio = lazy(() => import("./studio/studio").then((m) => ({ default: m.Studio })))

const DOC_PAGES: Record<string, React.ComponentType> = {
  docs: Introduction,
  "docs/installation": Installation,
  "docs/grammar": Grammar,
  "docs/theming": Theming,
  "docs/fonts": Fonts,
  "docs/reading-direction": ReadingDirection,
  "docs/ai": ForAi,
  "docs/changelog": Changelog,
  "docs/components": ComponentsIndex,
}

/** A still placeholder while a chunk loads: a fine frame, no spinner, no layout jump for small parts. */
export function Loading({ className = "min-h-64" }: { className?: string }) {
  return (
    <div role="status" className={`grid place-items-center border-ink-fine font-letter text-sm uppercase ${className}`}>
      Inking…
    </div>
  )
}

// A page loaded on demand: a placeholder while it loads, a Reload panel if it fails (see load-error.tsx).
function Lazy({ route, children }: { route: string; children: ReactNode }) {
  return (
    <Deferred resetKey={route} className="mt-6 min-h-[60vh]" fallback={<Loading className="mt-6 min-h-[60vh]" />}>
      {children}
    </Deferred>
  )
}

const kindOf = (name: string) => {
  const item = items.find((i) => i.name === name)
  return item ? (item.type === "registry:block" ? "block" : "component") : null
}

/** Old addresses in "#" (#button, #grammar, #examples/x), opened on the home page, go to their new address. */
export function redirectLegacy() {
  if (location.pathname !== to("") && location.pathname !== `${to("")}index.html`) return
  const next = legacy(location.hash, kindOf)
  if (next !== null && location.hash) navigate(to(next), { replace: true })
}

function NotFound({ route }: { route: string }) {
  useEffect(() => {
    document.title = "Not found — mangacn"
  }, [])
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-letter text-5xl uppercase">Page not found</h1>
      <p className="mt-4 text-lg">
        Nothing at <code className="font-mono">/{route}</code>.{" "}
        <a href={to("docs/components")} className="underline">
          See all components
        </a>
        .
      </p>
    </div>
  )
}

function Page({ route }: { route: string }) {
  if (route === "") return <Home />
  if (route === "docs" || route.startsWith("docs/")) {
    const DocPage = DOC_PAGES[route]
    const name = route.startsWith("docs/components/") ? route.slice("docs/components/".length) : null
    const item = name ? items.find((i) => i.name === name && i.type !== "registry:block") : undefined
    return (
      <DocsLayout route={route}>
        <Lazy route={route}>
          {DocPage ? <DocPage /> : item ? <ComponentPage key={item.name} item={item} /> : <NotFound route={route} />}
        </Lazy>
      </DocsLayout>
    )
  }
  if (route === "examples")
    return (
      <Lazy route={route}>
        <Examples />
      </Lazy>
    )
  if (route.startsWith("examples/")) return <InterfacePage slug={route.slice("examples/".length)} />
  if (route === "studio")
    return (
      <div className="mx-auto max-w-7xl px-4 pb-24">
        <Lazy route={route}>
          <Studio />
        </Lazy>
      </div>
    )
  if (route === "legal")
    return (
      <div className="mx-auto max-w-7xl px-4 pb-24">
        <Lazy route={route}>
          <Legal />
        </Lazy>
      </div>
    )
  return <NotFound route={route} />
}

export function App() {
  const [prefs, set] = usePrefs()
  const route = useRoute()

  useEffect(() => {
    addEventListener("hashchange", redirectLegacy)
    return () => removeEventListener("hashchange", redirectLegacy)
  }, [])

  useEffect(() => {
    const name = route.startsWith("docs/components/") ? route.slice("docs/components/".length) : null
    if (name) track("open-item", { item: name })
  }, [route])

  // /view/<name>: the interface alone, without the site's header and footer
  if (route.startsWith("view/")) return <InterfaceView slug={route.slice("view/".length)} />

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader route={route} prefs={prefs} set={set} />
      <main id="main">
        <Page route={route} />
      </main>
      <footer className="border-t-[length:var(--mg-bw-panel)] border-border px-4 py-6 text-center text-sm">
        MIT licensed. Not affiliated with shadcn. Demo art: Mapless, AI-generated (
        <a href={`${import.meta.env.BASE_URL}art/CREDITS.md`} className="underline max-sm:inline-flex max-sm:min-h-11 max-sm:items-center">
          credits
        </a>
        ).{" "}
        <a href={`${import.meta.env.BASE_URL}llms.txt`} className="underline max-sm:inline-flex max-sm:min-h-11 max-sm:items-center">
          llms.txt
        </a>{" "}
        ·{" "}
        <a href={GITHUB_URL} className="underline max-sm:inline-flex max-sm:min-h-11 max-sm:items-center" onClick={() => track("github", { from: "footer" })}>
          GitHub
        </a>{" "}
        ·{" "}
        <a href={to("legal")} className="underline max-sm:inline-flex max-sm:min-h-11 max-sm:items-center">
          Legal notice / Mentions légales
        </a>
      </footer>
    </>
  )
}
