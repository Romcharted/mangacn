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
import type { Example } from "../registry"
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

// On phones the outline button is 44px tall (sm: the kit size).
const TOUCH = "min-h-11 self-center sm:min-h-8"

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
    <div className="flex w-80 flex-col gap-3">
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
      <Button variant="outline" onClick={add} className={TOUCH}>
        Add a message
      </Button>
    </div>
  )
}

function JumpToFirst() {
  return (
    <div className="ink-case relative h-64 w-80 bg-background">
      <MessageScrollerProvider defaultScrollPosition="end">
        <MessageScroller className="h-full">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent>
              {START.map((line) => (
                <MessageScrollerItem key={line.id} messageId={line.id}>
                  <Line line={line} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="start" />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

function ShortThread() {
  return (
    <div className="ink-case relative h-64 w-80 bg-background">
      <MessageScrollerProvider>
        <MessageScroller className="h-full">
          <MessageScrollerViewport className="p-4">
            <MessageScrollerContent>
              {START.slice(0, 2).map((line) => (
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

function Replying() {
  const [lines, setLines] = useState<Line[]>(START.slice(0, 3))
  const reply = () =>
    setLines((ls) => [...ls, { id: `r${ls.length + 1}`, who: "artist", text: "Noted, I will fix it tonight." }])
  return (
    <div className="flex w-80 flex-col gap-3">
      <div className="ink-case relative h-64 bg-background">
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
      <Button variant="outline" onClick={reply} className={TOUCH}>
        Send a reply
      </Button>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "JumpToFirst", title: "Jump to the first line", description: "The column opens on the latest line; direction=\"start\" makes the button jump back to the first one.", Component: JumpToFirst },
  { fn: "ShortThread", title: "Short thread", description: "When every line fits, nothing to scroll: the button stays hidden until the reader scrolls up.", Component: ShortThread },
  { fn: "Replying", title: "Replying", description: "Each reply is appended; when the reader has scrolled up, the jump button pops in to come back.", Component: Replying },
]

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
