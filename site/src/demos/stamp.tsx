import { Stamp } from "@registry/manga/signature/stamp"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-12 py-6">
      <Stamp>Approved</Stamp>
      <Stamp rotate={6} className="text-3xl">
        Sold out
      </Stamp>
      <Stamp orientation="vertical" rotate={-4}>
        完了
      </Stamp>
    </div>
  )
}

export function Thumb() {
  return <Stamp className="text-2xl">Approved</Stamp>
}
