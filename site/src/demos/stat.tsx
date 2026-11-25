import { Stat } from "@registry/manga/signature/stat"

export function Preview() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-6">
      <Stat label="Readers" value="12.4k" delta="+8% this week" trend="up" emphasis />
      <Stat label="Chapters" value="48" delta="+2" trend="up" />
      <Stat label="Drop-off" value="3.1%" delta="-0.4 pt" trend="down" />
    </div>
  )
}

export function Thumb() {
  return <Stat label="Readers" value="12.4k" delta="+8%" trend="up" className="w-44" />
}
