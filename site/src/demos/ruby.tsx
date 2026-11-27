import { useState } from "react"
import { Ruby } from "@registry/manga/signature/ruby"
import { VerticalText } from "@registry/manga/signature/vertical-text"
import type { Example } from "../registry"
import { Tile, force } from "../state-grid"

const SENTENCE = (reveal: "always" | "hover" | "never", size = "text-3xl") => (
  <p lang="ja" className={`${size} leading-[2.2] whitespace-nowrap`}>
    <Ruby reveal={reveal} parts={[["漢", "かん"], ["字", "じ"]]} />
    を
    <Ruby reveal={reveal} base="読" reading="よ" />
    む
  </p>
)

export function Preview() {
  return (
    <div className="grid justify-items-center gap-2 text-center">
      {SENTENCE("always")}
      <p className="max-w-prose text-sm">“To read kanji.” A reading per character (parts), or one over a whole word (base + reading).</p>
    </div>
  )
}

function Hover() {
  return (
    <div className="flex w-full justify-center">
      <div className="grid justify-items-center gap-2 text-center">
        <p lang="ja" className="text-3xl leading-[2.2]">
          <Ruby reveal="hover" base="明日" reading="あした" />
          は
          <Ruby reveal="hover" base="晴" reading="は" />
          れ
        </p>
        <p className="max-w-prose text-sm">“Tomorrow, clear skies.” With reveal="hover" the readings show on hover or focus, and keep their room so nothing moves.</p>
      </div>
    </div>
  )
}

function Vertical() {
  return (
    <div className="flex justify-center">
      <VerticalText className="h-44 text-2xl leading-[2.2]">
        <Ruby base="物語" reading="ものがたり" />
        の
        <Ruby base="始" reading="はじ" />
        まり
      </VerticalText>
    </div>
  )
}

function Under() {
  return (
    <div className="flex justify-center">
      <p lang="ja" className="text-3xl leading-[2.2]">
        <Ruby position="under" base="東京" reading="とうきょう" />
      </p>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Hover", title: "Hover to reveal", description: "reveal hover hides the readings for learners until the word is hovered or focused.", Component: Hover },
  { fn: "Vertical", title: "In vertical text", description: "Inside a column the reading falls on the right of the characters, as in printed Japanese.", Component: Vertical },
  { fn: "Under", title: "Under the base", description: "position under puts the reading below the characters instead of above them.", Component: Under },
]

export function States() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <Tile label="reveal · always">{SENTENCE("always", "text-2xl")}</Tile>
      <Tile label="reveal · never">{SENTENCE("never", "text-2xl")}</Tile>
      <Tile label="hover · rest">
        <p lang="ja" className="text-3xl leading-[2.2]">
          <Ruby reveal="hover" base="読" reading="よ" />む
        </p>
      </Tile>
      <Tile label="hover · hover">
        <p lang="ja" className="text-3xl leading-[2.2]">
          <Ruby reveal="hover" base="読" reading="よ" {...force("hover")} />む
        </p>
      </Tile>
      <Tile label="hover · focus">
        <p lang="ja" className="text-3xl leading-[2.2]">
          <Ruby reveal="hover" base="読" reading="よ" {...force("focus")} />む
        </p>
      </Tile>
      <Tile label="position · under">
        <p lang="ja" className="text-3xl leading-[2.2]">
          <Ruby position="under" base="東京" reading="とうきょう" />
        </p>
      </Tile>
      <Tile label="group ruby">
        <p lang="ja" className="text-3xl leading-[2.2]">
          <Ruby base="明日" reading="あした" />
        </p>
      </Tile>
      <Tile label="vertical">
        <VerticalText className="h-28 text-2xl leading-[2.2]">
          <Ruby base="物語" reading="ものがたり" />
        </VerticalText>
      </Tile>
    </div>
  )
}

/** Live: the reading shows on hover (reveal="hover"); a click pins it. */
export function Thumb() {
  const [pinned, setPinned] = useState(false)
  return (
    <button type="button" aria-pressed={pinned} onClick={() => setPinned((p) => !p)} className="cursor-pointer focus-ink">
      <span lang="ja" className="block text-4xl leading-[2.2]">
        <Ruby parts={[["漢", "かん"], ["字", "じ"]]} reveal={pinned ? "always" : "hover"} />
      </span>
    </button>
  )
}
