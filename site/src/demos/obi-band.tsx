import { ObiBand } from "@registry/manga/signature/obi-band"
import { Tile } from "../state-grid"
import { VolumeCover } from "../mapless"

// Covers of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md).
const Dusk = () => <VolumeCover volume={1} />
const Stripes = () => <VolumeCover volume={3} />
const Tower = () => <VolumeCover volume={2} />

export function Preview() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
      <ObiBand tone="accent" size="md" headline="Mapless" caption="Over 2 million copies in print" badge="NEW">
        <Dusk />
      </ObiBand>
      <ObiBand tone="ink" size="lg" headline="The Eraser" caption="Volume 2, out now">
        <Tower />
      </ObiBand>
      <ObiBand tone="paper" size="sm" headline="Coming soon" caption="Volume 3">
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
                <ObiBand tone={t} size={s} headline="Mapless" caption="Volume 2">
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
              <ObiBand tone={t} size="md" headline="Volume 3" badge="NEW">
                <Stripes />
              </ObiBand>
            </div>
          </Tile>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Tile label="narrow cover · 120 px · accent" size="lg">
          <div className="w-[120px]">
            <ObiBand tone="accent" size="md" headline="Mapless" caption="Finally in print" badge="NEW">
              <Tower />
            </ObiBand>
          </div>
        </Tile>
        <Tile label="narrow cover · 120 px · ink · lg" size="lg">
          <div className="w-[120px]">
            <ObiBand tone="ink" size="lg" headline="The Eraser" caption="Volume 2, out now">
              <Tower />
            </ObiBand>
          </div>
        </Tile>
      </div>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="w-28">
      <ObiBand tone="accent" size="sm" headline="Mapless">
        <Dusk />
      </ObiBand>
    </div>
  )
}
