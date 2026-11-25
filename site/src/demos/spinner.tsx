import { Spinner } from "@registry/manga/ui/spinner"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Spinner className="size-4" />
      <Spinner />
      <Spinner className="size-10" />
      <span className="inline-flex items-center gap-2 text-base">
        <Spinner /> Loading the next chapter…
      </span>
    </div>
  )
}

export function Thumb() {
  return <Spinner className="size-12" />
}
