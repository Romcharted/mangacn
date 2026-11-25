import { useState } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@registry/manga/ui/breadcrumb"
import { DirectionProvider, type Direction } from "@registry/manga/ui/direction"
import { Input } from "@registry/manga/ui/input"
import { Progress } from "@registry/manga/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { Tile, Tiles } from "../state-grid"

/** The same few kit parts, laid out for one direction. `dir` is the writing direction the layout follows. */
function Sample({ direction }: { direction: Direction }) {
  return (
    <DirectionProvider direction={direction}>
      <div dir={direction} className="grid w-full max-w-md gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Library</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Vol. 1</BreadcrumbLink>
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
    <div className="grid w-full max-w-md gap-6">
      <Tabs variant="boxed" value={direction} onValueChange={(v) => setDirection(v === "rtl" ? "rtl" : "ltr")}>
        <TabsList>
          <TabsTrigger value="ltr">Left to right</TabsTrigger>
          <TabsTrigger value="rtl">Right to left</TabsTrigger>
        </TabsList>
      </Tabs>
      <Sample direction={direction} />
      <p className="text-sm">
        The direction is the writing direction (<code className="font-mono">dir</code>): it moves the text, the breadcrumb
        separators and the bubble tail. The manga reading order is another setting (<code className="font-mono">data-reading</code>),
        which moves panels and pages and leaves the English text as it is.
      </p>
    </div>
  )
}

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
