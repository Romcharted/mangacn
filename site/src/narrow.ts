import { useSyncExternalStore } from "react"

/** Phones: the site switches to its one-line header, two-column gallery and bottom navigation under 640px. */
const QUERY = "(max-width: 639.98px)"

const subscribe = (onChange: () => void) => {
  const media = matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

export function useNarrow() {
  return useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches)
}
