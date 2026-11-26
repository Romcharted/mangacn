import { RankingList, RankingRow, type RankingEntry } from "@registry/manga/signature/ranking-list"
import { Tile, force } from "../state-grid"

// Covers drawn for this showcase: abstract shapes, no existing work. Ink = currentColor, paper = the background.

function CoverA() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <circle cx="100" cy="112" r="56" fill="currentColor" />
      <path d="M0 220c50-40 90-40 140 0s40 22 60 6v74H0z" fill="currentColor" />
    </svg>
  )
}

function CoverB() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="currentColor" />
      {[70, 120, 170, 220].map((y) => (
        <path key={y} d={`M-10 ${y}q25 -18 50 0t50 0 50 0 50 0 50 0`} fill="none" stroke="var(--background)" strokeWidth="10" />
      ))}
    </svg>
  )
}

function CoverC() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <path d="M-20 300 140 -20h30L-10 300z" fill="currentColor" />
      <circle cx="150" cy="210" r="22" fill="var(--background)" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
}

function CoverD() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <circle cx="100" cy="90" r="30" fill="currentColor" />
      <path d="M62 136c10-18 66-18 76 0l16 92H46z" fill="currentColor" />
    </svg>
  )
}

const COVERS = [<CoverA key="a" />, <CoverB key="b" />, <CoverC key="c" />, <CoverD key="d" />]

const WEEK: RankingEntry[] = [
  { id: "glass-harbour", title: "Glass Harbour", subtitle: "M. Sato", change: 0, score: "1.2M", cover: COVERS[0] },
  { id: "iron-lullaby", title: "Iron Lullaby", subtitle: "K. Hadley", change: 3, score: "1.1M", cover: COVERS[1] },
  { id: "paper-comet", title: "Paper Comet", subtitle: "T. Ruiz", change: -1, score: "980K", cover: COVERS[2] },
  { id: "salt-choir", title: "The Salt Choir", subtitle: "L. Ando", change: "new", score: "940K", cover: COVERS[3] },
  { id: "lantern-street", title: "Lantern Street", subtitle: "R. Okafor", change: 2, score: "911K", cover: COVERS[0] },
  { id: "vesper-mile", title: "Vesper Mile", subtitle: "E. Lund", change: -2, score: "870K", cover: COVERS[1] },
  { id: "quiet-engine", title: "Quiet Engine", subtitle: "J. Park", change: 0, score: "802K", cover: COVERS[2] },
  { id: "ash-and-ember", title: "Ash and Ember", subtitle: "N. Varga", change: 5, score: "777K", cover: COVERS[3] },
  { id: "moss-orchard", title: "Moss Orchard", subtitle: "D. Ilic", change: -4, score: "640K", cover: COVERS[0] },
  { id: "tin-moon", title: "Tin Moon", subtitle: "P. Costa", change: "new", score: "512K", cover: COVERS[1] },
]

const SAMPLE = WEEK[1]

export function Preview() {
  return (
    <div className="max-w-xl">
      <RankingList entries={WEEK.map((e) => ({ ...e, href: "#" }))} />
    </div>
  )
}

function Row({
  entry,
  rank,
  state,
}: {
  entry: RankingEntry
  rank: number
  state?: "hover" | "focus" | "active"
}) {
  return (
    <div className="relative ink-case w-full max-w-md">
      <RankingRow entry={{ ...entry, href: "#" }} rank={rank} big={rank <= 3} rowProps={state ? force(state) : undefined} />
    </div>
  )
}

export function States() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Tile label="row · rest">
        <Row entry={SAMPLE} rank={2} />
      </Tile>
      <Tile label="row · hover">
        <Row entry={SAMPLE} rank={2} state="hover" />
      </Tile>
      <Tile label="row · focus">
        <Row entry={SAMPLE} rank={2} state="focus" />
      </Tile>
      <Tile label="row · pressed">
        <Row entry={SAMPLE} rank={2} state="active" />
      </Tile>
      <Tile label="change · up 3">
        <Row entry={{ ...SAMPLE, change: 3 }} rank={2} />
      </Tile>
      <Tile label="change · down 1">
        <Row entry={{ ...SAMPLE, change: -1 }} rank={3} />
      </Tile>
      <Tile label="change · same">
        <Row entry={{ ...SAMPLE, change: 0 }} rank={7} />
      </Tile>
      <Tile label="change · new">
        <Row entry={{ ...SAMPLE, change: "new" }} rank={4} />
      </Tile>
      <Tile label="without covers">
        <Row entry={{ ...SAMPLE, cover: undefined, change: 2 }} rank={5} />
      </Tile>
      <Tile label="rank 1 · biggest, accent">
        <Row entry={{ ...SAMPLE, change: 0 }} rank={1} />
      </Tile>
      <Tile label="rank 7 · small">
        <Row entry={{ ...SAMPLE, change: 0 }} rank={7} />
      </Tile>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="ink-case relative w-24 px-2 py-1">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-1 border-b-2 border-border py-1 last:border-b-0">
          <span className={n === 1 ? "font-sfx text-2xl leading-none text-destructive" : "font-sfx text-2xl leading-none"}>{n}</span>
          <span className="block h-1 flex-1 bg-foreground" />
        </div>
      ))}
    </div>
  )
}
