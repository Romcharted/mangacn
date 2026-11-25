import { Avatar, AvatarFallback } from "@registry/manga/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@registry/manga/ui/hover-card"

function Sample() {
  return (
    <HoverCard>
      <HoverCardTrigger href="#" className="font-letter text-lg uppercase hover-underline">
        @nightowl
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="flex gap-3">
          <Avatar size="lg">
            <AvatarFallback>NO</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-letter text-lg uppercase">Night owl</p>
            <p className="text-sm">Draws The long night. New pages on Fridays.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export function Preview() {
  return (
    <div className="pb-40">
      <p className="text-base">
        A series by <Sample />. Hover the name.
      </p>
    </div>
  )
}

export function Thumb() {
  return <Sample />
}
