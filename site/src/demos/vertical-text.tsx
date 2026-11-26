import { Tcy, VerticalText } from "@registry/manga/signature/vertical-text"
import { Tile } from "../state-grid"

const LINE = "夜の町に、静かな雨が降っている。"

export function Preview() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <figure className="grid gap-2">
        <VerticalText as="p" height="12rem" className="text-2xl">
          雨の夜、
          <Tcy>12</Tcy>
          時。駅のホームで、まだ電車を待っている。
        </VerticalText>
        <figcaption className="max-w-44 text-sm">“A rainy night, 12 o’clock. Still waiting for the train on the platform.” Columns run right to left; the 12 stands in one cell.</figcaption>
      </figure>
      <figure className="grid gap-2">
        <VerticalText as="h3" font="sfx" className="text-4xl">
          第三話
        </VerticalText>
        <figcaption className="font-mono text-xs">font="sfx"</figcaption>
      </figure>
      <figure className="grid gap-2">
        <VerticalText font="letter" upright lang="en" className="text-2xl leading-none tracking-[0.2em] uppercase">
          Fin
        </VerticalText>
        <figcaption className="font-mono text-xs">upright, Latin</figcaption>
      </figure>
      <figure className="grid gap-2">
        <VerticalText ruled height="10rem" className="text-xl">
          {LINE}
        </VerticalText>
        <figcaption className="font-mono text-xs">ruled</figcaption>
      </figure>
    </div>
  )
}

export function States() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      <Tile label="font · reading">
        <VerticalText height="8rem" className="text-xl">
          {LINE}
        </VerticalText>
      </Tile>
      <Tile label="font · letter">
        <VerticalText font="letter" lang="en" className="h-32 text-xl">
          Chapter one
        </VerticalText>
      </Tile>
      <Tile label="font · sfx">
        <VerticalText font="sfx" className="text-3xl">
          ドドド
        </VerticalText>
      </Tile>
      <Tile label="upright">
        <VerticalText font="letter" upright lang="en" className="text-xl leading-none uppercase">
          Wow
        </VerticalText>
      </Tile>
      <Tile label="tate-chū-yoko">
        <VerticalText className="text-2xl">
          第<Tcy>24</Tcy>巻
        </VerticalText>
      </Tile>
      <Tile label="ruled">
        <VerticalText ruled height="8rem" className="text-xl">
          {LINE}
        </VerticalText>
      </Tile>
    </div>
  )
}

export function Thumb() {
  return (
    <VerticalText height="6rem" className="text-xl">
      縦書きの物語
    </VerticalText>
  )
}
