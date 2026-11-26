import { useState } from "react"
import { Ruby } from "@registry/manga/signature/ruby"
import { VerticalText } from "@registry/manga/signature/vertical-text"
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
    <div className="grid max-w-2xl gap-6">
      <div className="grid gap-1">
        <p className="font-mono text-xs">reveal="always"</p>
        {SENTENCE("always")}
        <p className="text-sm">“To read kanji.” A reading per character (parts), or one over a whole word (base + reading).</p>
      </div>
      <div className="grid gap-1">
        <p className="font-mono text-xs">reveal="hover" · hover or focus a word</p>
        <p lang="ja" className="text-3xl leading-[2.2]">
          <Ruby reveal="hover" base="明日" reading="あした" />
          は
          <Ruby reveal="hover" base="晴" reading="は" />
          れ
        </p>
        <p className="text-sm">“Tomorrow, clear skies.” The readings keep their room, so nothing moves when they show.</p>
      </div>
      <div className="flex items-start gap-8">
        <div className="grid gap-1">
          <p className="font-mono text-xs">vertical</p>
          <VerticalText className="h-44 text-2xl leading-[2.2]">
            <Ruby base="物語" reading="ものがたり" />
            の
            <Ruby base="始" reading="はじ" />
            まり
          </VerticalText>
        </div>
        <div className="grid gap-1">
          <p className="font-mono text-xs">position="under"</p>
          <p lang="ja" className="text-3xl leading-[2.2]">
            <Ruby position="under" base="東京" reading="とうきょう" />
          </p>
        </div>
      </div>
    </div>
  )
}

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
