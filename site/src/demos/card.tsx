import { useState } from "react"
import { Button } from "@registry/manga/ui/button"
import { Badge } from "@registry/manga/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardVariant,
} from "@registry/manga/ui/card"
import { artSrc } from "../mapless"
import type { Example } from "../registry"

function Sample({ variant, interactive, selected }: { variant: CardVariant; interactive?: boolean; selected?: boolean }) {
  return (
    <Card variant={variant} interactive={interactive} selected={selected} className="w-full max-w-xs">
      {variant === "bleed" && <img alt="" src={artSrc("bridge-far", 320)} className="aspect-[320/140] w-full object-cover" />}
      <CardHeader>
        <CardTitle>Chapter 1</CardTitle>
        <CardDescription>The ink bridge</CardDescription>
        <CardAction>
          <Badge variant={variant === "beta" ? "outline" : "default"}>New</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Three days of rain, a folded map and a door that should not be open.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant={variant === "beta" ? "outline" : "default"} className="min-h-11 sm:min-h-8">
          Read
        </Button>
      </CardFooter>
    </Card>
  )
}

export function Preview() {
  return (
    <div className="w-80">
      <Sample variant="default" interactive />
    </div>
  )
}

function Bleed() {
  return (
    <div className="w-80">
      <Sample variant="bleed" />
    </div>
  )
}

function Tilted() {
  return (
    <div className="w-80">
      <Sample variant="tilted" />
    </div>
  )
}

function Splash() {
  return (
    <div className="w-80">
      <Sample variant="splash" />
    </div>
  )
}

function Selected() {
  return (
    <div className="w-80">
      <Card variant="default" selected className="w-full max-w-xs">
        <CardHeader>
          <CardTitle>Chapter 12</CardTitle>
          <CardDescription>Chosen for the next read</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Bleed", title: "Bleed", description: "variant=\"bleed\" runs the first image to the edges of the panel, with its frame below.", Component: Bleed },
  { fn: "Tilted", title: "Tilted", description: "variant=\"tilted\" slants the bottom edge; the text stays upright inside the panel.", Component: Tilted },
  { fn: "Splash", title: "Splash", description: "variant=\"splash\" drops the frame for focus lines around the title, for a big moment.", Component: Splash },
  { fn: "Selected", title: "Selected", description: "selected draws a double ink frame around the chosen panel.", Component: Selected },
]

export function States() {
  return (
    <div className="grid items-start gap-10 sm:grid-cols-2 xl:grid-cols-3">
      {(["default", "bleed", "tilted", "splash", "beta"] as const).map((v) => (
        <figure key={v} className="space-y-3">
          <Sample variant={v} />
          <figcaption className="font-mono text-xs">variant="{v}"</figcaption>
        </figure>
      ))}
      <figure className="space-y-3">
        <div data-force="hover">
          <Card variant="default" interactive className="w-full max-w-xs" data-force="hover">
            <CardHeader>
              <CardTitle>Hover</CardTitle>
              <CardDescription>interactive, lifted</CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Card variant="default" selected className="mt-8 w-full max-w-xs">
          <CardHeader>
            <CardTitle>Selected</CardTitle>
            <CardDescription>double ink frame</CardDescription>
          </CardHeader>
        </Card>
        <figcaption className="font-mono text-xs">interactive · selected</figcaption>
      </figure>
    </div>
  )
}

export function Thumb() {
  const [selected, setSelected] = useState(false)
  return (
    <Card
      interactive
      selected={selected}
      onClick={() => setSelected((x) => !x)}
      className="w-44 cursor-pointer gap-2 py-3 [--card-spacing:--spacing(3)]"
    >
      <CardHeader>
        <CardTitle className="text-lg">Chapter 12</CardTitle>
        <CardDescription className="text-sm">{selected ? "Selected" : "Click to select"}</CardDescription>
      </CardHeader>
    </Card>
  )
}
