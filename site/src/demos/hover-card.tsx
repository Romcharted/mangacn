import { Avatar, AvatarFallback } from "@registry/manga/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@registry/manga/ui/hover-card"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

function ProfileCard() {
  return (
    <div className="flex gap-3">
      <Avatar size="lg">
        <AvatarFallback>NO</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-letter text-lg uppercase">Night owl</p>
        <p className="text-sm">Draws The long night. New pages on Fridays.</p>
      </div>
    </div>
  )
}

function Sample({ side = "bottom" }: { side?: "top" | "bottom" }) {
  return (
    <HoverCard>
      <HoverCardTrigger href="#" className="inline-flex min-h-11 items-center font-letter text-lg uppercase hover-underline sm:min-h-8">
        @nightowl
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-64">
        <ProfileCard />
      </HoverCardContent>
    </HoverCard>
  )
}

export function Preview() {
  return <Sample />
}

function AbovePage() {
  return <Sample side="top" />
}

function OnAvatar() {
  return (
    <HoverCard>
      <HoverCardTrigger href="#" className="inline-flex min-h-11 min-w-11 items-center justify-center sm:min-h-8 sm:min-w-8">
        <Avatar size="lg">
          <AvatarFallback>NO</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <ProfileCard />
      </HoverCardContent>
    </HoverCard>
  )
}

function InSentence() {
  return (
    <p className="max-w-xs text-center text-base">
      A series by <Sample />. Hover the name.
    </p>
  )
}

export const examples: Example[] = [
  { fn: "AbovePage", title: "Opens above", description: "side=\"top\" places the card above the trigger, for a name near the bottom of the page.", Component: AbovePage },
  { fn: "OnAvatar", title: "On a picture", description: "Any element can be the trigger; here a round avatar, with the same card on hover.", Component: OnAvatar },
  { fn: "InSentence", title: "Inside a sentence", description: "The trigger sits in running text and keeps a 44px tap height on phones.", Component: InSentence },
]

function NameTrigger({ state }: { state?: "hover" | "focus" }) {
  return (
    <HoverCard>
      <HoverCardTrigger href="#" className="inline-flex min-h-11 items-center font-letter text-lg uppercase sm:min-h-8" {...force(state ?? "")}>
        @nightowl
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <ProfileCard />
      </HoverCardContent>
    </HoverCard>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="trigger · rest" size="lg">
        <NameTrigger />
      </Tile>
      <Tile label="trigger · hover" size="lg">
        <NameTrigger state="hover" />
      </Tile>
      <Tile label="trigger · focus" size="lg">
        <NameTrigger state="focus" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return <Sample />
}
