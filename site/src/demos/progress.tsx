import { useEffect, useState } from "react"
import { Progress } from "@registry/manga/ui/progress"

function Row({ id, label, value }: { id: string; label: string; value: number }) {
  return (
    <div className="grid gap-2">
      <div className="flex justify-between">
        <span id={id} className="font-letter text-base tracking-wide uppercase">
          {label}
        </span>
        <span className="font-mono text-sm">{value} %</span>
      </div>
      <Progress value={value} aria-labelledby={id} />
    </div>
  )
}

export function Preview() {
  const [value, setValue] = useState(20)
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 10 : v + 15)), 1200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="grid max-w-md gap-6">
      <Row id="p-vol3" label="Downloading Vol. 3" value={Math.min(value, 100)} />
      <Row id="p-vol2" label="Vol. 2" value={100} />
    </div>
  )
}

export function Thumb() {
  return <Progress value={62} className="w-48" aria-label="Download" />
}
