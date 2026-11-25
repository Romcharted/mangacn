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

function Sample({ variant, interactive, selected }: { variant: CardVariant; interactive?: boolean; selected?: boolean }) {
  return (
    <Card variant={variant} interactive={interactive} selected={selected} className="w-full max-w-xs">
      {variant === "bleed" && <img alt="" src={`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140"><rect width="320" height="140" fill="#f8f5ef"/><path d="M0 140V92h30V70h26v30h20V56h34v84M120 140V80h28v-20h22v80M190 140V96h40V74h30v66M270 140v-52h50v52" fill="#221d18"/><circle cx="240" cy="44" r="22" fill="none" stroke="#221d18" stroke-width="3"/></svg>')}`} />}
      <CardHeader>
        <CardTitle>Chapter 12</CardTitle>
        <CardDescription>The long night</CardDescription>
        <CardAction>
          <Badge variant={variant === "beta" ? "outline" : "default"}>New</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Three days of rain, a folded map and a door that should not be open.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant={variant === "beta" ? "outline" : "default"}>
          Read
        </Button>
      </CardFooter>
    </Card>
  )
}

export function Preview() {
  return (
    <div className="grid items-start gap-10 sm:grid-cols-2 xl:grid-cols-3">
      <Sample variant="default" interactive />
      <Sample variant="bleed" />
      <Sample variant="tilted" />
    </div>
  )
}

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
  return (
    <Card className="w-44 gap-2 py-3 [--card-spacing:--spacing(3)]">
      <CardHeader>
        <CardTitle className="text-lg">Chapter 12</CardTitle>
        <CardDescription className="text-sm">The long night</CardDescription>
      </CardHeader>
    </Card>
  )
}
