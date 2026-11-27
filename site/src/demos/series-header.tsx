import { SeriesHeader } from "@registry/manga/signature/series-header"
import { Button } from "@registry/manga/ui/button"
import type { Example } from "../registry"
import { Tile, force } from "../state-grid"
import { VolumeCover } from "../mapless"

const SUMMARY =
  "Above the clouds, the islands drift and no map stays true for long. Suzu, an apprentice cartographer, draws the way as she walks: what her brush inks becomes real, bridges included. Kuro, a small dragon made of her ink, keeps watch while she sleeps. But every new road brings the Eraser, a white knight who believes the sky must stay as it was drawn, and whose spear undoes whatever Suzu makes. A journey about mapping a world that keeps moving."

const STATS = [
  { label: "Chapters", value: 17 },
  { label: "Volumes", value: 2 },
  { label: "Readers", value: "12.4k" },
]

export function Preview() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <SeriesHeader
        as="h2"
        title="Mapless"
        altTitle="The cartographer of the drifting sky"
        author="Story and art: Studio Mapless"
        cover={<VolumeCover volume={1} />}
        status="ongoing"
        genres={["Adventure", "Fantasy"]}
        stats={STATS}
        summary={SUMMARY}
        actions={
          <>
            <Button className="min-h-11 sm:min-h-8">Start reading</Button>
            <Button variant="outline" className="min-h-11 sm:min-h-8">
              Add to shelf
            </Button>
          </>
        }
      />
    </div>
  )
}

function ShortSummary() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <SeriesHeader
        title="Mapless, vol. 3"
        author="Studio Mapless"
        cover={<VolumeCover volume={3} />}
        status="new"
        genres={["Adventure"]}
        summary="Coming soon: the knight's side of the sky."
        as="h3"
      />
    </div>
  )
}

function NoCover() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <SeriesHeader title="Mapless: side stories" author="Studio Mapless" status="hiatus" stats={STATS.slice(0, 2)} as="h3" />
    </div>
  )
}

function FoldedSummary() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <SeriesHeader
        title="Mapless"
        author="Studio Mapless"
        cover={<VolumeCover volume={1} />}
        status="ongoing"
        summary={SUMMARY}
        summaryLines={3}
        as="h3"
      />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "ShortSummary", title: "New series, short summary", description: "A short summary has no toggle; status new shows the accent stamp.", Component: ShortSummary },
  { fn: "NoCover", title: "Without a cover", description: "Without a cover, the header shows a screentone where the picture goes.", Component: NoCover },
  { fn: "FoldedSummary", title: "Folded summary", description: "summaryLines sets how many lines show before Read more unfolds the rest.", Component: FoldedSummary },
]

export function States() {
  return (
    <div className="grid gap-3">
      <Tile label="summary folded (Read more)" size="full">
        <div className="w-full max-w-sm">
          <SeriesHeader title="Mapless" author="Studio Mapless" cover={<VolumeCover volume={1} />} status="ongoing" summary={SUMMARY} as="h3" />
        </div>
      </Tile>
      <Tile label="status · new (accent stamp) · short summary (no toggle)" size="full">
        <div className="w-full max-w-sm">
          <SeriesHeader title="Mapless, vol. 3" author="Studio Mapless" cover={<VolumeCover volume={3} />} status="new" genres={["Adventure"]} summary="Coming soon: the knight's side of the sky." as="h3" />
        </div>
      </Tile>
      <Tile label="status · completed · hiatus · no cover (tone)" size="full">
        <div className="grid w-full gap-3 md:grid-cols-2">
          <SeriesHeader title="Mapless, vol. 1" author="Studio Mapless" cover={<VolumeCover volume={1} />} status="completed" stats={STATS.slice(0, 2)} as="h3" />
          <SeriesHeader title="Mapless: side stories" author="Studio Mapless" status="hiatus" stats={STATS.slice(0, 2)} as="h3" />
        </div>
      </Tile>
      <Tile label="Read more · hover / focus" size="full">
        <div className="flex flex-wrap gap-4">
          <Button variant="link" size="sm" className="min-h-11 sm:min-h-8" {...force("hover")}>
            Read more
          </Button>
          <Button variant="link" size="sm" className="min-h-11 sm:min-h-8" {...force("focus")}>
            Read more
          </Button>
        </div>
      </Tile>
    </div>
  )
}

/** Live: the real header, small; "Read more" unfolds the summary. */
/** Thumbnail: a readable detail at real size, cropped. */
export function Thumb() {
  return (
    <div className="w-64 h-28 overflow-hidden">
      <SeriesHeader title="Mapless" author="Studio Mapless" cover={<VolumeCover volume={1} />} status="ongoing" summary={SUMMARY} as="h3" />
    </div>
  )
}
