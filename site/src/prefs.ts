import { useEffect, useState } from "react"

export const ACCENTS = ["stamp", "indigo", "pine", "ochre"] as const
export type Accent = (typeof ACCENTS)[number]

/**
 * Page preferences mirrored on <html>:
 *   .dark · data-accent · data-reading (manga reading order: panels right-to-left, text unchanged)
 * Writing direction (dir="rtl", for Arabic or Hebrew) is separate and only set from the URL (?dir=rtl).
 */
export type Prefs = { dark: boolean; accent: Accent; reading: "ltr" | "rtl" }

function initial(): Prefs {
  const url = new URLSearchParams(location.search)
  let saved: Partial<Prefs> = {}
  try {
    saved = JSON.parse(localStorage.getItem("mangacn-prefs") ?? "{}")
  } catch {
    /* storage unavailable */
  }
  const dark = url.has("dark") ? url.get("dark") !== "0" : (saved.dark ?? matchMedia("(prefers-color-scheme: dark)").matches)
  const a = url.get("accent") ?? saved.accent
  const accent = ACCENTS.includes(a as Accent) ? (a as Accent) : "stamp"
  const reading = (url.get("reading") ?? saved.reading) === "rtl" ? "rtl" : "ltr"
  return { dark, accent, reading }
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(initial)
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle("dark", prefs.dark)
    html.dataset.accent = prefs.accent
    html.dataset.reading = prefs.reading
    html.dir = new URLSearchParams(location.search).get("dir") === "rtl" ? "rtl" : "ltr"
    try {
      localStorage.setItem("mangacn-prefs", JSON.stringify(prefs))
    } catch {
      /* storage unavailable */
    }
  }, [prefs])
  return [prefs, (p: Partial<Prefs>) => setPrefs((s) => ({ ...s, ...p }))] as const
}

/** Current hash without "#", kept in sync with the address bar. */
/** The route after "#": "" and "/" are the gallery. */
function readHash() {
  return decodeURIComponent(location.hash.slice(1)).replace(/^\/$/, "")
}

/**
 * Hash router. A click on a link whose href is exactly "#" (demo links, placeholders) is ignored, so a
 * demo never throws the visitor back to the gallery; links home use "#/". Back and forward still work.
 */
export function useHash() {
  const [hash, setHash] = useState(readHash)
  useEffect(() => {
    const on = () => setHash(readHash())
    const empty = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a")
      if (a?.getAttribute("href") === "#") e.preventDefault()
    }
    addEventListener("hashchange", on)
    document.addEventListener("click", empty)
    return () => {
      removeEventListener("hashchange", on)
      document.removeEventListener("click", empty)
    }
  }, [])
  return hash
}
