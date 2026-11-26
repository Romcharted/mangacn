import { ObiBand } from "@registry/manga/signature/obi-band"
import { Tile } from "../state-grid"

// Covers drawn for this showcase: abstract shapes, no existing work. Ink = currentColor, paper = the background.

function Dusk() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <circle cx="100" cy="110" r="58" fill="currentColor" />
      <path d="M0 210c40-40 80-40 120 0s60 30 80 0v90H0z" fill="var(--background)" stroke="currentColor" strokeWidth="4" />
      <path d="M0 240c50-30 90-30 140 0s40 22 60 6v54H0z" fill="currentColor" />
    </svg>
  )
}

function Stripes() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="currentColor" />
      {[40, 90, 140, 190, 240].map((y) => (
        <path key={y} d={`M-10 ${y}q25 -18 50 0t50 0 50 0 50 0 50 0`} fill="none" stroke="var(--background)" strokeWidth="8" />
      ))}
      <circle cx="150" cy="60" r="16" fill="var(--background)" />
    </svg>
  )
}

function Tower() {
  return (
    <svg viewBox="0 0 200 300" className="size-full" aria-hidden>
      <rect width="200" height="300" fill="var(--background)" />
      <circle cx="140" cy="70" r="28" fill="none" stroke="currentColor" strokeWidth="6" />
      <path d="M0 300V180h34V130h30v50h26V90h30v90h20v-60h40v210z" fill="currentColor" />
      <path d="M0 250h200" stroke="var(--background)" strokeWidth="3" />
    </svg>
  )
}

export function Preview() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
      <ObiBand tone="accent" size="md" headline="Night Rail" caption="Over 2 million copies in print" badge="NEW">
        <Dusk />
      </ObiBand>
      <ObiBand tone="ink" size="lg" headline="Concrete Sky" caption="Winner of the city prize">
        <Tower />
      </ObiBand>
      <ObiBand tone="paper" size="sm" headline="Tidewall" caption="Volume 4 of 6">
        <Stripes />
      </ObiBand>
    </div>
  )
}

export function States() {
  const tones = ["accent", "ink", "paper"] as const
  const sizes = ["sm", "md", "lg"] as const
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tones.flatMap((t) =>
          sizes.map((s) => (
            <Tile key={`${t}-${s}`} label={`${t} · ${s}`}>
              <div className="w-28">
                <ObiBand tone={t} size={s} headline="Night Rail" caption="Volume 2">
                  <Dusk />
                </ObiBand>
              </div>
            </Tile>
          )),
        )}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tones.map((t) => (
          <Tile key={`badge-${t}`} label={`with badge · ${t}`}>
            <div className="w-28">
              <ObiBand tone={t} size="md" headline="Open Road" badge="NEW">
                <Stripes />
              </ObiBand>
            </div>
          </Tile>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Tile label="narrow cover · 120 px · accent" size="lg">
          <div className="w-[120px]">
            <ObiBand tone="accent" size="md" headline="Still Point" caption="Finally in print" badge="NEW">
              <Tower />
            </ObiBand>
          </div>
        </Tile>
        <Tile label="narrow cover · 120 px · ink · lg" size="lg">
          <div className="w-[120px]">
            <ObiBand tone="ink" size="lg" headline="Concrete Sky" caption="Winner of the city prize">
              <Dusk />
            </ObiBand>
          </div>
        </Tile>
      </div>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="w-24">
      <ObiBand tone="accent" size="md" headline="Night Rail">
        <Dusk />
      </ObiBand>
    </div>
  )
}
