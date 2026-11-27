import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@registry/manga/ui/avatar"
import { artSrc } from "../mapless"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

// The cast of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md).
const CAST = [
  { id: "SU", name: "Suzu", src: artSrc("suzu-face", 48) },
  { id: "KU", name: "Kuro", src: artSrc("kuro", 48) },
  { id: "ER", name: "The Eraser", src: artSrc("eraser-helmet", 48) },
]

export function Preview() {
  return (
    <Avatar size="lg">
      <AvatarImage src={CAST[0].src} alt={CAST[0].name} />
      <AvatarFallback>SU</AvatarFallback>
    </Avatar>
  )
}

function Sizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar size="sm">
        <AvatarImage src={CAST[1].src} alt={CAST[1].name} />
        <AvatarFallback>KU</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src={CAST[0].src} alt={CAST[0].name} />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={CAST[2].src} alt={CAST[2].name} />
        <AvatarFallback>ER</AvatarFallback>
      </Avatar>
    </div>
  )
}

function WithBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar size="lg">
        <AvatarImage src={CAST[2].src} alt={CAST[2].name} />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge />
      </Avatar>
    </div>
  )
}

function Group() {
  return (
    <AvatarGroup>
      {CAST.map((c) => (
        <Avatar key={c.id}>
          <AvatarImage src={c.src} alt={c.name} />
          <AvatarFallback>{c.id}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  )
}

function Initials() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar size="lg">
        <AvatarFallback>RA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MA</AvatarFallback>
      </Avatar>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Sizes", title: "Sizes", description: "size=\"sm\", the default and \"lg\" set the square; the initials scale with it.", Component: Sizes },
  { fn: "WithBadge", title: "With a badge", description: "AvatarBadge adds a small ink square at the corner, for a status.", Component: WithBadge },
  { fn: "Group", title: "Group", description: "AvatarGroup overlaps the faces with a paper gap; AvatarGroupCount shows how many are left.", Component: Group },
  { fn: "Initials", title: "Initials", description: "Without a picture, AvatarFallback shows the initials on paper.", Component: Initials },
]

export function States() {
  return (
    <Tiles>
      <Tile label="picture · rest" size="lg">
        <Avatar size="lg">
          <AvatarImage src={CAST[0].src} alt={CAST[0].name} />
          <AvatarFallback>SU</AvatarFallback>
        </Avatar>
      </Tile>
      <Tile label="fallback · initials" size="lg">
        <Avatar size="lg">
          <AvatarFallback>RA</AvatarFallback>
        </Avatar>
      </Tile>
      <Tile label="badge · status" size="lg">
        <Avatar size="lg">
          <AvatarFallback>KU</AvatarFallback>
          <AvatarBadge />
        </Avatar>
      </Tile>
      <Tile label="group · overlap" size="lg">
        <AvatarGroup>
          {CAST.map((c) => (
            <Avatar key={c.id}>
              <AvatarFallback>{c.id}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </Tile>
      <Tile label="group · count" size="lg">
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>SU</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+9</AvatarGroupCount>
        </AvatarGroup>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <AvatarGroup>
      {CAST.map((c) => (
        <Avatar key={c.id} size="lg">
          <AvatarImage src={c.src} alt="" />
          <AvatarFallback>{c.id}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  )
}
