import { useState } from "react"
import { ChapterEnd, ChapterNext } from "@registry/manga/signature/chapter-end"
import { Button } from "@/components/ui/manga/button"
import { Tile, force } from "../state-grid"

import { artSrc } from "../mapless"

// The next chapter's cover: a crop from "Mapless" (AI-generated, see public/art/CREDITS.md).
const Cover = () => <img src={artSrc("lighthouse-night", 120)} alt="" className="size-full object-cover" />

const NEXT = { number: 13, title: "The lighthouse keeper", href: "#", cover: <Cover /> }
const NOT_OUT = { number: 13, title: "The lighthouse keeper", date: "Dec 3", cover: <Cover /> }
const ON_SELECT = { number: 13, title: "The lighthouse keeper", onSelect: () => {}, cover: <Cover /> }

function Actions() {
  return (
    <>
      <Button variant="outline" size="sm">
        Back to series
      </Button>
      <Button variant="ghost" size="sm">
        Comments
      </Button>
    </>
  )
}

export function Preview() {
  const [reading, setReading] = useState<"rtl" | "ltr">("rtl")
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Reading order">
        <Button
          variant="outline"
          size="sm"
          aria-pressed={reading === "rtl"}
          onClick={() => setReading("rtl")}
          className="aria-pressed:bg-primary! aria-pressed:text-primary-foreground!"
        >
          Manga RTL
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={reading === "ltr"}
          onClick={() => setReading("ltr")}
          className="aria-pressed:bg-primary! aria-pressed:text-primary-foreground!"
        >
          Western LTR
        </Button>
      </div>
      <div data-reading={reading}>
        <ChapterEnd chapter="Chapter 12 · Echo" next={NEXT}>
          <Actions />
        </ChapterEnd>
      </div>
    </div>
  )
}

export function States() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Tile label="continued · next out" size="full">
          <div className="w-full">
            <ChapterEnd chapter="Chapter 12 · Echo" next={NEXT} />
          </div>
        </Tile>
        <Tile label="continued · next not out yet" size="full">
          <div className="w-full">
            <ChapterEnd chapter="Chapter 12 · Echo" next={NOT_OUT} />
          </div>
        </Tile>
        <Tile label="end of series" size="full">
          <div className="w-full">
            <ChapterEnd variant="end" chapter="Chapter 40 · Last Light">
              <Actions />
            </ChapterEnd>
          </div>
        </Tile>
        <Tile label="narrow · 320px" size="full">
          <div className="mx-auto w-80 max-w-full">
            <ChapterEnd chapter="Chapter 12 · Echo" next={NEXT}>
              <Actions />
            </ChapterEnd>
          </div>
        </Tile>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Tile size="lg" label="next · rest">
          <div className="w-full">
            <ChapterNext next={ON_SELECT} />
          </div>
        </Tile>
        <Tile size="lg" label="next · hover">
          <div className="w-full">
            <ChapterNext next={ON_SELECT} {...force("hover")} />
          </div>
        </Tile>
        <Tile size="lg" label="next · focus">
          <div className="w-full">
            <ChapterNext next={ON_SELECT} {...force("focus")} />
          </div>
        </Tile>
        <Tile size="lg" label="next · pressed">
          <div className="w-full">
            <ChapterNext next={ON_SELECT} {...force("active")} />
          </div>
        </Tile>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Tile label="reading · rtl (manga)" size="full">
          <div className="w-full" data-reading="rtl">
            <ChapterEnd chapter="Chapter 12 · Echo" next={NEXT} />
          </div>
        </Tile>
        <Tile label="reading · ltr (western)" size="full">
          <div className="w-full" data-reading="ltr">
            <ChapterEnd chapter="Chapter 12 · Echo" next={NEXT} />
          </div>
        </Tile>
      </div>
    </div>
  )
}

export function Thumb() {
  return (
    <div className="w-44 pointer-events-none">
      <ChapterEnd chapter="Ch. 12" next={{ number: 13, title: "The lighthouse keeper", href: "#" }} />
    </div>
  )
}
