/*
 * Umami, cookieless and anonymous. Two build-time variables (see .env.example):
 *   VITE_UMAMI_SRC         the script address, e.g. https://stats.example.com/script.js
 *   VITE_UMAMI_WEBSITE_ID  the site id from the Umami dashboard
 * If either is empty, nothing loads. Nothing loads either when the browser sends Do Not Track or
 * Global Privacy Control. The script is added once the page is idle, so it never delays the first paint.
 */
type Umami = { track: (event?: string | ((p: Record<string, unknown>) => Record<string, unknown>), data?: Record<string, unknown>) => void }
declare global {
  interface Window {
    umami?: Umami
  }
}

const SRC = (import.meta.env.VITE_UMAMI_SRC as string | undefined)?.trim()
const ID = (import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined)?.trim()

function refused() {
  const n = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string }
  const dnt = n.doNotTrack ?? (window as unknown as { doNotTrack?: string }).doNotTrack ?? n.msDoNotTrack
  return dnt === "1" || dnt === "yes" || n.globalPrivacyControl === true
}

// The showcase routes with the hash, which Umami does not see: page views are sent by hand.
function pageview() {
  window.umami?.track((p) => ({ ...p, url: location.pathname + location.hash }))
}

export function loadAnalytics() {
  if (!SRC || !ID || refused()) return
  const add = () => {
    const s = document.createElement("script")
    s.src = SRC
    s.defer = true
    s.dataset.websiteId = ID
    s.dataset.autoTrack = "false"
    s.dataset.doNotTrack = "true"
    s.onload = pageview
    document.head.append(s)
    addEventListener("hashchange", pageview)
  }
  const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(add, { timeout: 4000 }) : setTimeout(add, 1500))
  if (document.readyState === "complete") idle()
  else addEventListener("load", idle, { once: true })
}

/** Events: copy-install {item}, open-item {item}, github {from}, accent {accent}. No-op without Umami. */
export function track(event: "copy-install" | "open-item" | "github" | "accent" | "copy-ai", data: Record<string, string>) {
  window.umami?.track(event, data)
}
