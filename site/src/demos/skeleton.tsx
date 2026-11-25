import { Skeleton, SkeletonCard } from "@registry/manga/ui/skeleton"

export function Preview() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <SkeletonCard />
      <div className="flex w-64 items-center gap-3">
        <Skeleton shape="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton shape="text" className="w-3/4" />
          <Skeleton shape="text" />
        </div>
      </div>
    </div>
  )
}

export function States() {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {(["text", "avatar", "panel", "block"] as const).map((s) => (
        <figure key={s} className="space-y-2">
          <Skeleton shape={s} className={s === "block" ? "h-20 w-full" : undefined} />
          <figcaption className="font-mono text-xs">shape="{s}"</figcaption>
        </figure>
      ))}
    </div>
  )
}
