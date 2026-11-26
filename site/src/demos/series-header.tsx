import { SeriesHeader } from "@registry/manga/signature/series-header"
import { Button } from "@registry/manga/ui/button"
import { Tile, force } from "../state-grid"
import { coverUrl } from "./reader-art"

const SUMMARY =
  "Every autumn the night market on Lantern Street sells lanterns that hold one wish each. Mio mends the broken ones in her grandmother's stall, until a lantern comes back with a wish that is not hers, written in a hand she has never seen. To find its owner she has to follow the lanterns past the river, where the market stays open long after the street goes dark. A quiet story about repairs, debts and the people who keep a street lit."

const STATS = [
  { label: "Chapters", value: 38 },
  { label: "Volumes", value: 4 },
  { label: "Readers", value: "12.4k" },
]

export function Preview() {
  return (
    <SeriesHeader
      as="h2"
      title="Lantern Street"
      altTitle="The night market stories"
      author="Story and art: N. Arai"
      cover={coverUrl(1, "Lantern St.")}
      status="ongoing"
      genres={["Slice of life", "Mystery", "Fantasy"]}
      stats={STATS}
      summary={SUMMARY}
      actions={
        <>
          <Button>Start reading</Button>
          <Button variant="outline">Add to shelf</Button>
        </>
      }
    />
  )
}

export function States() {
  return (
    <div className="grid gap-3">
      <Tile label="summary folded (Read more)" size="full">
        <div className="w-full max-w-sm">
          <SeriesHeader title="Lantern Street" author="N. Arai" cover={coverUrl(1)} status="ongoing" summary={SUMMARY} as="h3" />
        </div>
      </Tile>
      <Tile label="status · new (accent stamp) · short summary (no toggle)" size="full">
        <div className="w-full max-w-sm">
          <SeriesHeader title="Paper Boats" author="K. Ueno" cover={coverUrl(4)} status="new" genres={["Adventure"]} summary="Two kids fold a fleet." as="h3" />
        </div>
      </Tile>
      <Tile label="status · completed · hiatus · no cover (tone)" size="full">
        <div className="grid w-full gap-3 md:grid-cols-2">
          <SeriesHeader title="Tidal Forge" author="R. Sato" cover={coverUrl(6)} status="completed" stats={STATS.slice(0, 2)} as="h3" />
          <SeriesHeader title="Still Water" author="L. Moreau" status="hiatus" stats={STATS.slice(0, 2)} as="h3" />
        </div>
      </Tile>
      <Tile label="Read more · hover / focus" size="full">
        <div className="flex flex-wrap gap-4">
          <Button variant="link" size="sm" {...force("hover")}>
            Read more
          </Button>
          <Button variant="link" size="sm" {...force("focus")}>
            Read more
          </Button>
        </div>
      </Tile>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="flex w-32 gap-2 ink-case p-1.5">
      <img src={coverUrl(1)} alt="" className="w-10 border-ink" />
      <div className="grid content-start gap-1">
        <span className="font-letter text-xs leading-none uppercase">Lantern Street</span>
        <span className="h-1.5 w-12 bg-foreground" />
        <span className="h-1 w-14 bg-foreground" />
        <span className="h-1 w-10 bg-foreground" />
      </div>
    </div>
  )
}
