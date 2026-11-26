import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@registry/manga/ui/avatar"
import { artSrc } from "../mapless"

// The cast of "Mapless", the showcase's series (AI-generated pictures, see public/art/CREDITS.md).
const CAST = [
  { id: "SU", name: "Suzu", src: artSrc("suzu-face", 48) },
  { id: "KU", name: "Kuro", src: artSrc("kuro", 48) },
  { id: "ER", name: "The Eraser", src: artSrc("eraser-helmet", 48) },
]

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Avatar size="sm">
        <AvatarImage src={CAST[1].src} alt={CAST[1].name} />
        <AvatarFallback>KU</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src={CAST[0].src} alt={CAST[0].name} />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src={CAST[2].src} alt={CAST[2].name} />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>RA</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        {CAST.map((c) => (
          <Avatar key={c.id}>
            <AvatarImage src={c.src} alt={c.name} />
            <AvatarFallback>{c.id}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
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
