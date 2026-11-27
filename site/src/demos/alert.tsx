import { Alert, AlertDescription, AlertTitle } from "@registry/manga/ui/alert"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <Alert variant="destructive" className="w-80">
      <AlertTitle>Upload failed</AlertTitle>
      <AlertDescription>Page 15 is larger than 20 MB.</AlertDescription>
    </Alert>
  )
}

function Variants() {
  return (
    <div className="grid w-80 gap-4">
      <Alert>
        <AlertTitle>New chapter</AlertTitle>
        <AlertDescription>Chapter 12 of The long night is out.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>Page 15 is larger than 20 MB.</AlertDescription>
      </Alert>
    </div>
  )
}

function TitleOnly() {
  return (
    <Alert className="w-80">
      <AlertTitle>Saved to your library</AlertTitle>
    </Alert>
  )
}

function Errors() {
  return (
    <Alert variant="destructive" className="w-80">
      <AlertTitle>Connection lost</AlertTitle>
      <AlertDescription>Your last page was kept on this device. Try again when you are back online.</AlertDescription>
    </Alert>
  )
}

export const examples: Example[] = [
  { fn: "Variants", title: "Default and destructive", description: "variant=\"default\" is the plain notice; variant=\"destructive\" adds the accent line and the “!” mark.", Component: Variants },
  { fn: "TitleOnly", title: "Title only", description: "AlertTitle alone works for a short notice that needs no description.", Component: TitleOnly },
  { fn: "Errors", title: "A longer error", description: "AlertDescription wraps to several lines under the title when the message needs more room.", Component: Errors },
]

export function States() {
  return (
    <Tiles>
      <Tile label="default" size="lg">
        <Alert className="w-full max-w-xs">
          <AlertTitle>New chapter</AlertTitle>
          <AlertDescription>Chapter 12 is out.</AlertDescription>
        </Alert>
      </Tile>
      <Tile label="destructive" size="lg">
        <Alert variant="destructive" className="w-full max-w-xs">
          <AlertTitle>Upload failed</AlertTitle>
          <AlertDescription>Page 15 is too large.</AlertDescription>
        </Alert>
      </Tile>
      <Tile label="title only" size="lg">
        <Alert className="w-full max-w-xs">
          <AlertTitle>Saved</AlertTitle>
        </Alert>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Alert variant="destructive" className="w-52 py-2">
      <AlertTitle className="text-base">Upload failed</AlertTitle>
    </Alert>
  )
}
