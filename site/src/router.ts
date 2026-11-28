import { useSyncExternalStore } from "react"

/*
 * Path router: real addresses (/docs/components/button), served by a fallback to index.html on the host
 * (site/public/.htaccess, docs/deploy.md). Links are plain <a href> built with `to()`: a click on one that
 * stays on the site is caught here and handled without reloading. Back and forward work.
 *
 * Old addresses used the hash (#button, #grammar, #examples/dashboard). Opened on the home page, they are
 * replaced by their new address (see `legacy`).
 */

/** Where the site is served ("/" or "/mangacn/"); a relative base from an old build counts as the root. */
export const BASE = (() => {
  const b = import.meta.env.BASE_URL || "/"
  return b.startsWith("/") ? b.replace(/\/?$/, "/") : "/"
})()

/** A site address from a route: to("docs/components/button") → "/docs/components/button". */
export const to = (route: string) => BASE + route.replace(/^\/+/, "")

/** The current route, without the base nor slashes at the ends: "", "docs", "docs/components/button". */
function readRoute() {
  let path = decodeURIComponent(location.pathname)
  if (path.startsWith(BASE)) path = path.slice(BASE.length)
  else if (path + "/" === BASE) path = ""
  return path.replace(/^\/+|\/+$/g, "").replace(/(^|\/)index\.html$/, "")
}

let route = readRoute()
const listeners = new Set<() => void>()
const emit = () => {
  const next = readRoute()
  if (next === route) return
  route = next
  listeners.forEach((l) => l())
}

/** Go to a route (or a full site path with its #section). Scrolls to the top, or to the section. */
export function navigate(target: string, { replace = false } = {}) {
  const url = new URL(target.startsWith("/") ? target : to(target), location.href)
  if (url.href === location.href) return
  const samePage = url.pathname === location.pathname && url.search === location.search
  history[replace ? "replaceState" : "pushState"](null, "", url.pathname + url.search + url.hash)
  emit()
  if (url.hash) requestAnimationFrame(() => scrollToSection(url.hash.slice(1)))
  else if (!samePage) window.scrollTo({ top: 0 })
}

/** Scroll to an element by id, once it exists (pages load on demand). */
function scrollToSection(id: string, tries = 20) {
  const el = document.getElementById(decodeURIComponent(id))
  if (el) el.scrollIntoView()
  else if (tries > 0) setTimeout(() => scrollToSection(id, tries - 1), 100)
}

/** The old hash routes, mapped to their new address. Null when the hash is not one of them. */
export function legacy(hash: string, isItem: (name: string) => "component" | "block" | null): string | null {
  const h = decodeURIComponent(hash.replace(/^#/, "")).replace(/^\/+/, "")
  if (hash === "#/") return ""
  if (!h) return null
  if (h === "grammar") return "docs/grammar"
  if (h === "legal" || h === "studio" || h === "examples") return h
  if (h.startsWith("examples/")) return h
  const kind = isItem(h)
  if (kind === "component") return `docs/components/${h}`
  // a block was an item page; it is now an example (the Auth screens open on their own too)
  if (kind === "block") return `examples/${h}`
  return null
}

let started = false
function start() {
  if (started) return
  started = true
  // opened with a #section: scroll to it once the page has loaded it
  if (location.hash.length > 1) setTimeout(() => scrollToSection(location.hash.slice(1)), 50)
  addEventListener("popstate", emit)
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = (e.target as Element | null)?.closest?.("a")
    if (!a) return
    const href = a.getAttribute("href")
    // Demo links and placeholders ("#") never leave the page.
    if (href === "#") return e.preventDefault()
    if (!href || a.target || a.hasAttribute("download") || href.startsWith("#")) return
    const url = new URL(a.href, location.href)
    if (url.origin !== location.origin || !url.pathname.startsWith(BASE)) return
    // Files next to the site (llms.txt, r/button.json, art/…) open as files.
    if (/\.[a-z0-9]+$/i.test(url.pathname)) return
    e.preventDefault()
    navigate(url.pathname + url.search + url.hash)
  })
}

const subscribe = (l: () => void) => {
  start()
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Called after each change of page (link, back, forward). Returns the function that stops it. */
export function onRouteChange(l: () => void) {
  start()
  listeners.add(l)
  return () => void listeners.delete(l)
}

/** The current route, kept in sync with the address bar. */
export function useRoute() {
  return useSyncExternalStore(subscribe, () => route)
}
