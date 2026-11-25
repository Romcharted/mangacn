import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@registry/manga/ui/avatar"

export function Preview() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Avatar size="sm">
        <AvatarFallback>NO</AvatarFallback>
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
