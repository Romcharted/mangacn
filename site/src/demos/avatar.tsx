import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@registry/manga/ui/avatar"

/** A drawn portrait, as a data URL: no external photo. */
const PORTRAIT = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="#c8c8c8"/><path d="M14 120 C20 84 40 78 60 78 C80 78 100 84 106 120Z" fill="#222"/><rect x="50" y="66" width="20" height="18" fill="#333"/><ellipse cx="60" cy="50" rx="24" ry="28" fill="#333"/><path d="M34 46 C32 20 88 18 86 46 C78 34 44 32 34 46Z" fill="#000"/></svg>`,
)}`

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Avatar size="sm">
        <AvatarFallback>NO</AvatarFallback>
      </Avatar>
      <Avatar size="lg" toned={{ pattern: "lines", density: 4 }}>
        <AvatarImage src={PORTRAIT} alt="" />
        <AvatarFallback>MK</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>KI</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>RA</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        {["NO", "KI", "RA"].map((i) => (
          <Avatar key={i}>
            <AvatarFallback>{i}</AvatarFallback>
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
      {["NO", "KI", "RA"].map((i) => (
        <Avatar key={i} size="lg">
          <AvatarFallback>{i}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  )
}
