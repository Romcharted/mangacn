import { useState } from "react"

import { Bubble, BubbleContent } from "@registry/manga/ui/bubble"
import { Button } from "@registry/manga/ui/button"
import { Message, MessageAvatar, MessageContent, MessageHeader } from "@registry/manga/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@registry/manga/ui/message-scroller"
import { force, Tile, Tiles } from "../state-grid"

type Line = { id: string; who: "editor" | "artist"; text: string }

const START: Line[] = [
  { id: "l1", who: "editor", text: "Chapter 12 is in. Page 14 gave me chills." },
  { id: "l2", who: "artist", text: "The rain panel took three nights." },
  { id: "l3", who: "editor", text: "Can the final splash bleed off the edge?" },
  { id: "l4", who: "artist", text: "Yes. I will push the gutter to the right." },
  { id: "l5", who: "editor", text: "Send the storyboard before noon." },
  { id: "l6", who: "artist", text: "It is in the folder, page 13 is still rough." },
  { id: "l7", who: "editor", text: "Rough is fine. Lettering starts Friday." },
  { id: "l8", who: "artist", text: "Good. Tea first, then pages." },
]

const WHO = {
  editor: { code: "ED", name: "Editor" },
  artist: { code: "AR", name: "Artist" },
} as const

function Line({ line }: { line: Line }) {
  const who = WHO[line.who]
  const mine = line.who === "artist"
  return (
    <Message align={mine ? "end" : "start"}>
      <MessageAvatar>{who.code}</MessageAvatar>
      <MessageContent>
        <MessageHeader>{who.name}</MessageHeader>
        <Bubble variant={mine ? "default" : "secondary"} align={mine ? "end" : "start"}>
          <BubbleContent>{line.text}</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}

export function Preview() {
  const [lines, setLines] = useState<Line[]>(START)
  const add = () =>
    setLines((ls) => [
      ...ls,
      {
        id: `n${ls.length + 1}`,
        who: ls.length % 2 ? "editor" : "artist",
        text: ["Panel nine is locked.", "Adding sound effects now.", "Next page after lunch."][ls.length % 3],
      },
    ])
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="ink-case relative h-80 bg-background">
        <MessageScrollerProvider>
          <MessageScroller className="h-full">
            <MessageScrollerViewport className="p-4">
              <MessageScrollerContent>
                {lines.map((line) => (
                  <MessageScrollerItem key={line.id} messageId={line.id}>
                    <Line line={line} />
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
      <Button variant="outline" onClick={add} className="self-start">
        Add a message
      </Button>
    </div>
  )
}

function JumpTile({ state }: { state?: "hover" | "focus" | "active" }) {
  return (
    <div className="ink-case relative h-44 w-full bg-background">
      <MessageScrollerProvider defaultScrollPosition="start">
        <MessageScroller className="h-full">
          <MessageScrollerViewport className="p-3">
            <MessageScrollerContent>
              {START.slice(0, 3).map((line) => (
                <MessageScrollerItem key={line.id} messageId={line.id} className="[content-visibility:visible]!">
                  <Line line={line} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton {...(state ? force(state) : {})} />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="jump · rest" size="full">
        <JumpTile />
      </Tile>
      <Tile label="jump · hover" size="full">
        <JumpTile state="hover" />
      </Tile>
      <Tile label="jump · focus" size="full">
        <JumpTile state="focus" />
      </Tile>
      <Tile label="jump · pressed" size="full">
        <JumpTile state="active" />
      </Tile>
    </Tiles>
  )
}

/** Live: scroll up; the "back to the latest" button appears. */
export function Thumb() {
  return (
    <div className="ink-case relative h-32 w-56 bg-background text-xs">
      <MessageScrollerProvider>
        <MessageScroller className="h-full">
          <MessageScrollerViewport className="p-2">
            <MessageScrollerContent>
              {START.map((line) => (
                <MessageScrollerItem key={line.id} messageId={line.id}>
                  <Line line={line} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}
