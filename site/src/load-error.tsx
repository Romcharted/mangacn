import { Component, Suspense, type ErrorInfo, type ReactNode } from "react"

/*
 * Showcase only. A chunk loaded on demand (a page, an interface, a demo) can fail: the network drops,
 * a new deploy removed the old file. Without a boundary React unmounts the whole tree and the site goes
 * white. The boundary keeps the rest of the page and shows one framed panel with a Reload button: a
 * failed dynamic import stays failed in the browser's module map, so only a reload fetches it again.
 */

/** The panel shown in place of what failed to load. `compact` for a gallery thumbnail. */
export function LoadError({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <span role="alert" className="grid place-items-center gap-1 text-center font-letter text-xs uppercase">
        Didn’t load
        <button
          type="button"
          onClick={() => location.reload()}
          className="pointer-events-auto border-ink px-2 py-0.5 hover:ink-fill focus-ink"
        >
          Reload
        </button>
      </span>
    )
  }
  return (
    <div role="alert" className={`grid min-h-64 place-items-center p-4 ${className}`}>
      <div className="grid max-w-sm justify-items-center gap-3 border-ink-panel bg-background p-6 text-center">
        <p className="font-letter text-2xl leading-none uppercase">This part didn’t load.</p>
        <p className="text-sm">The connection dropped or the site was updated. Reload to try again.</p>
        <button
          type="button"
          onClick={() => location.reload()}
          className="inline-flex h-11 items-center border-ink px-4 font-letter text-sm uppercase hover:ink-fill focus-ink sm:h-9"
        >
          Reload
        </button>
      </div>
    </div>
  )
}

type Props = { children: ReactNode; className?: string; compact?: boolean; resetKey?: unknown }

/** Catches a failed chunk (or any render error) below it and shows <LoadError />. */
export class LoadBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[mangacn] a part of the page failed to load", error, info.componentStack)
  }

  componentDidUpdate(prev: Props) {
    // Another route reuses the same boundary: give it a fresh try.
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false })
  }

  render() {
    if (this.state.failed) return <LoadError compact={this.props.compact} className={this.props.className} />
    return this.props.children
  }
}

/** Suspense plus the boundary: the usual wrapper around anything loaded with lazy(). */
export function Deferred({
  children,
  fallback,
  className,
  resetKey,
}: {
  children: ReactNode
  fallback: ReactNode
  className?: string
  resetKey?: unknown
}) {
  return (
    <LoadBoundary className={className} resetKey={resetKey}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </LoadBoundary>
  )
}
