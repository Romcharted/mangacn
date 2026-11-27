import { useState } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@registry/manga/ui/breadcrumb"
import { DirectionProvider, type Direction } from "@registry/manga/ui/direction"
import { Input } from "@registry/manga/ui/input"
import { Progress } from "@registry/manga/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

/* Phones: each toggle and link keeps a 44px target; from sm up they keep their own size. */
const TOUCH = "min-h-11 sm:min-h-8"
const LINK = "min-h-11 sm:min-h-0"

/** The same few kit parts, laid out for one direction. `dir` is the writing direction the layout follows. */
function Sample({ direction }: { direction: Direction }) {
  return (
    <DirectionProvider direction={direction}>
      <div dir={direction} className="grid w-full max-w-md gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className={LINK}>
                Library
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className={LINK}>
                Vol. 1
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Chapter 4</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Input placeholder="Search the volumes" aria-label="Search" />
        <Progress value={60} aria-label="Chapter progress" />
        <SpeechBubble variant="speech" tail="start" className="max-w-64 p-3 text-sm">
          The harbour lights are on again.
        </SpeechBubble>
      </div>
    </DirectionProvider>
  )
}

export function Preview() {
  const [direction, setDirection] = useState<Direction>("ltr")
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <Tabs variant="boxed" value={direction} onValueChange={(v) => setDirection(v === "rtl" ? "rtl" : "ltr")}>
        <TabsList>
          <TabsTrigger value="ltr" className={TOUCH}>
            Left to right
          </TabsTrigger>
          <TabsTrigger value="rtl" className={TOUCH}>
            Right to left
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Sample direction={direction} />
      <p className="text-center text-sm">
        The direction is the writing direction (<code className="font-mono">dir</code>): it moves the text, the breadcrumb
        separators and the bubble tail. The manga reading order is another setting (<code className="font-mono">data-reading</code>),
        which moves panels and pages and leaves the English text as it is.
      </p>
    </div>
  )
}

/** The default: text, separators and the bubble tail run from the left. */
function LeftToRight() {
  return <Sample direction="ltr" />
}

/** The same parts mirrored: the text, separators and the bubble tail run from the right. */
function RightToLeft() {
  return <Sample direction="rtl" />
}

/** Form parts follow the same writing direction: the input and the progress bar start from the right. */
function SearchAndProgress() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="grid w-full max-w-64 gap-3">
        <Input placeholder="Search" aria-label="Search" />
        <Progress value={60} aria-label="Chapter progress" />
      </div>
    </DirectionProvider>
  )
}

export const examples: Example[] = [
  { fn: "LeftToRight", title: "Left to right", description: "The default direction: text, breadcrumb separators and the bubble tail follow the reading from the left.", Component: LeftToRight },
  { fn: "RightToLeft", title: "Right to left", description: "direction=\"rtl\" mirrors the same parts, and the separators and tail turn with them.", Component: RightToLeft },
  { fn: "SearchAndProgress", title: "Input and progress", description: "Form parts use the same setting, so the input and the progress bar start from the right.", Component: SearchAndProgress },
]

export function States() {
  return (
    <Tiles>
      <Tile label="direction · ltr" size="full">
        <Sample direction="ltr" />
      </Tile>
      <Tile label="direction · rtl" size="full">
        <Sample direction="rtl" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="grid w-56 gap-3">
        <Input aria-label="Search" placeholder="Search" />
        <Progress value={60} aria-label="Progress" />
      </div>
    </DirectionProvider>
  )
}
