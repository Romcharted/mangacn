import { useEffect, useState } from "react"
import { Progress, ProgressLabel, ProgressValue } from "@registry/manga/ui/progress"

export function Preview() {
  const [value, setValue] = useState(20)
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 10 : v + 15)), 1200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="grid max-w-md gap-6">
      <Progress value={value}>
        <ProgressLabel>Downloading Vol. 3</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={100}>
        <ProgressLabel>Vol. 2</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}

export function Thumb() {
  return <Progress value={62} className="w-48" aria-label="Download" />
}
