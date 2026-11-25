import { useEffect, useState } from "react"

/** Page preferences mirrored on <html>: .dark, data-theme, dir. URL params win (used by screenshots). */
export type Prefs = { dark: boolean; theme: "manga" | "webtoon"; dir: "ltr" | "rtl" }

function initial(): Prefs {
  const url = new URLSearchParams(location.search)
  let saved: Partial<Prefs> = {}
  try {
    saved = JSON.parse(localStorage.getItem("mangacn-prefs") ?? "{}")
  } catch {
    /* storage unavailable */
  }
  const dark = url.has("dark")
    ? url.get("dark") !== "0"
    : (saved.dark ?? matchMedia("(prefers-color-scheme: dark)").matches)
  const theme = (url.get("theme") ?? saved.theme ?? "manga") === "webtoon" ? "webtoon" : "manga"
  const dir = (url.get("dir") ?? saved.dir ?? "ltr") === "rtl" ? "rtl" : "ltr"
  return { dark, theme, dir }
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(initial)
  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle("dark", prefs.dark)
    html.dataset.theme = prefs.theme
    html.dir = prefs.dir
    try {
      localStorage.setItem("mangacn-prefs", JSON.stringify(prefs))
    } catch {
      /* storage unavailable */
    }
  }, [prefs])
  return [prefs, (p: Partial<Prefs>) => setPrefs((s) => ({ ...s, ...p }))] as const
}
