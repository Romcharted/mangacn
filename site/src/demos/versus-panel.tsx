import { VersusPanel, VersusSide } from "@registry/manga/signature/versus-panel"
import { Button } from "@registry/manga/ui/button"
import { artSrc } from "../mapless"
import { Tile } from "../state-grid"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b-[length:var(--mg-bw-fine)] border-current py-1 text-sm">
      <dt>{label}</dt>
      <dd className="font-sfx text-lg">{value}</dd>
    </div>
  )
}

export function Preview() {
  return (
    <div className="grid gap-12">
      <VersusPanel role="group" aria-label="Compare plans">
        <VersusSide aria-labelledby="versus-free">
          <h3 id="versus-free" className="font-letter text-3xl uppercase">
            Free
          </h3>
          <p className="mt-1 font-sfx text-4xl">$0</p>
          <p className="mt-2 text-sm">Three chapters a week, on any device.</p>
          <Button variant="outline" fullWidth className="mt-4">
            Start free
          </Button>
        </VersusSide>
        <VersusSide highlight aria-labelledby="versus-pro">
          <h3 id="versus-pro" className="font-letter text-3xl uppercase">
            Pro
          </h3>
          <p className="mt-1 font-sfx text-4xl">$9</p>
          <p className="mt-2 text-sm">Every chapter the day it drops, and offline reading.</p>
          <Button variant="outline" fullWidth className="mt-4">
            Go Pro
          </Button>
        </VersusSide>
      </VersusPanel>

      <VersusPanel label="VS" role="group" aria-label="Compare two fighters">
        <VersusSide aria-labelledby="versus-suzu">
          <img src={artSrc("suzu-face", 80)} alt="" className="mx-auto size-20 border-ink object-cover" />
          <h3 id="versus-suzu" className="font-letter text-2xl uppercase">
            Suzu
          </h3>
          <dl className="mt-2">
            <Stat label="Power" value="82" />
            <Stat label="Speed" value="6" />
          </dl>
        </VersusSide>
        <VersusSide highlight aria-labelledby="versus-eraser">
          <img src={artSrc("eraser-helmet", 80)} alt="" className="mx-auto size-20 border-ink object-cover" />
          <h3 id="versus-eraser" className="font-letter text-2xl uppercase">
            Eraser
          </h3>
          <dl className="mt-2">
            <Stat label="Power" value="74" />
            <Stat label="Speed" value="9" />
          </dl>
        </VersusSide>
      </VersusPanel>
    </div>
  )
}

function Halves({ highlight }: { highlight: 0 | 1 }) {
  return (
    <VersusPanel>
      <VersusSide highlight={highlight === 0} aria-label="Option A">
        <p className="font-letter text-2xl uppercase">Option A</p>
        <p className="text-sm">Read it now.</p>
      </VersusSide>
      <VersusSide highlight={highlight === 1} aria-label="Option B">
        <p className="font-letter text-2xl uppercase">Option B</p>
        <p className="text-sm">Wait a week.</p>
      </VersusSide>
    </VersusPanel>
  )
}

export function States() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
        <Tile label="stacked · left highlighted" size="full">
          <div className="w-full max-w-sm">
            <Halves highlight={0} />
          </div>
        </Tile>
        <Tile label="stacked · right highlighted" size="full">
          <div className="w-full max-w-sm">
            <Halves highlight={1} />
          </div>
        </Tile>
        <Tile label="side by side (36rem+) · left highlighted" size="full">
          <div className="w-full max-w-[40rem]">
            <Halves highlight={0} />
          </div>
        </Tile>
        <Tile label="side by side (36rem+) · right highlighted" size="full">
          <div className="w-full max-w-[40rem]">
            <Halves highlight={1} />
          </div>
        </Tile>
      </div>
    </div>
  )
}

export function Thumb() {
  return (
    <VersusPanel label="VS" className="w-44" aria-hidden>
      <VersusSide className="text-center">
        <span className="font-letter text-lg uppercase">A</span>
      </VersusSide>
      <VersusSide highlight className="text-center">
        <span className="font-letter text-lg uppercase">B</span>
      </VersusSide>
    </VersusPanel>
  )
}
