import { Yonkoma } from "@registry/manga/signature/yonkoma"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { Sfx } from "@registry/manga/signature/sfx"
import { Beat } from "../story-art"
import { Tile } from "../state-grid"

const LABELS: [string, string, string, string] = ["A seed is planted.", "It rains.", "Nothing grows. A sigh.", "Overnight, a flower."]

function Story({ size = "md" }: { size?: "sm" | "md" }) {
  const art = "absolute inset-x-0 bottom-0 mx-auto h-[88%] w-full"
  const md = size === "md"
  return [
      <div key="1">
        <Beat step={1} className={art} />
        {md && (
          <span className="absolute end-2 top-2">
            <SpeechBubble tail="bottom" tailAlign="end" className="px-4! py-2! text-sm">
              Grow!
            </SpeechBubble>
          </span>
        )}
      </div>,
      <div key="2">
        <Beat step={2} className={art} />
      </div>,
      <div key="3">
        <Beat step={3} className={art} />
        {md && (
          <span className="absolute start-8 top-2">
            <SpeechBubble variant="thought" tail="none" className="px-5! py-3! text-sm">
              …any day now.
            </SpeechBubble>
          </span>
        )}
      </div>,
      <div key="4">
        <Beat step={4} className={art} />
        {md && (
          <span className="absolute end-3 top-3">
            <Sfx size="sm" rotate={10}>
              ポン
            </Sfx>
          </span>
        )}
      </div>,
  ]
}

export function Preview() {
  return (
    <div className="grid gap-10">
      <Yonkoma title="Patience" labels={LABELS}>
        {Story({})}
      </Yonkoma>
      <div className="grid gap-2">
        <p className="font-mono text-xs">orientation="auto": a column on phones, four in a row from 40rem (follows the reading order)</p>
        <Yonkoma orientation="auto" labels={LABELS} title="Patience, wide">
          {Story({})}
        </Yonkoma>
      </div>
    </div>
  )
}

export function States() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Tile label="vertical · numbered" size="lg">
        <Yonkoma className="w-48" labels={LABELS}>
          {Story({ size: "sm" })}
        </Yonkoma>
      </Tile>
      <Tile label="vertical · title, no numbers" size="lg">
        <Yonkoma className="w-48" title="Patience" numbered={false} labels={LABELS}>
          {Story({ size: "sm" })}
        </Yonkoma>
      </Tile>
      <Tile label="square panels" size="lg">
        <Yonkoma className="w-40" aspect="1" labels={LABELS}>
          {Story({ size: "sm" })}
        </Yonkoma>
      </Tile>
      <Tile label="horizontal" size="full">
        <Yonkoma orientation="horizontal" labels={LABELS}>
          {Story({ size: "sm" })}
        </Yonkoma>
      </Tile>
    </div>
  )
}

export function Thumb() {
  return (
    <Yonkoma className="w-20" numbered={false} labels={LABELS}>
      {Story({ size: "sm" })}
    </Yonkoma>
  )
}
