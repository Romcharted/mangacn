import { Burst } from "@registry/manga/signature/burst"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-10 py-4">
      <Burst className="text-2xl">NEW!</Burst>
      <Burst variant="paper" points={18} seed={9} className="text-xl">
        Vol. 4
        <br />
        is out
      </Burst>
      <Burst variant="accent" animated="always" seed={3} className="text-3xl">
        -50%
      </Burst>
    </div>
  )
}

export function Thumb() {
  return <Burst className="text-xl">NEW!</Burst>
}
