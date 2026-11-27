import { Bubble, BubbleContent } from "@registry/manga/ui/bubble"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@registry/manga/ui/message"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <MessageGroup className="w-80 gap-5">
      <Message>
        <MessageAvatar>KI</MessageAvatar>
        <MessageContent>
          <MessageHeader>Kite</MessageHeader>
          <Bubble variant="secondary">
            <BubbleContent>Page 14 gave me chills.</BubbleContent>
          </Bubble>
          <MessageFooter>21:04</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>NO</MessageAvatar>
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Wait for chapter 13.</BubbleContent>
          </Bubble>
          <MessageFooter>21:05</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

function SentAndReceived() {
  return (
    <MessageGroup className="w-80 gap-5">
      <Message>
        <MessageAvatar>SU</MessageAvatar>
        <MessageContent>
          <Bubble variant="secondary">
            <BubbleContent>Is the bridge map ready?</BubbleContent>
          </Bubble>
          <MessageFooter>09:12</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageAvatar>KU</MessageAvatar>
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Almost. The lighthouse is still blank.</BubbleContent>
          </Bubble>
          <MessageFooter>09:13</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

function Speakers() {
  return (
    <MessageGroup className="w-80 gap-5">
      <Message>
        <MessageAvatar>SU</MessageAvatar>
        <MessageContent>
          <MessageHeader>Suzu</MessageHeader>
          <Bubble variant="secondary">
            <BubbleContent>Draw the ferry route.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageAvatar>ER</MessageAvatar>
        <MessageContent>
          <MessageHeader>The Eraser</MessageHeader>
          <Bubble variant="secondary">
            <BubbleContent>Not that route.</BubbleContent>
          </Bubble>
          <MessageFooter>09:14</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}

export const examples: Example[] = [
  { fn: "SentAndReceived", title: "Sent and received", description: "align end puts your own line on the right, with the bubble and the avatar on that side.", Component: SentAndReceived },
  { fn: "Speakers", title: "Several speakers", description: "MessageHeader gives the speaker's name in lettering above the bubble; the footer shows the time.", Component: Speakers },
]

export function States() {
  return (
    <Tiles>
      <Tile label="line · received" size="lg">
        <Message>
          <MessageAvatar>SU</MessageAvatar>
          <MessageContent>
            <Bubble variant="secondary">
              <BubbleContent>Hello.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </Tile>
      <Tile label="line · sent" size="lg">
        <Message align="end">
          <MessageAvatar>KU</MessageAvatar>
          <MessageContent>
            <Bubble align="end">
              <BubbleContent>Hello back.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </Tile>
      <Tile label="header and footer" size="lg">
        <Message>
          <MessageAvatar>KI</MessageAvatar>
          <MessageContent>
            <MessageHeader>Kite</MessageHeader>
            <Bubble variant="secondary">
              <BubbleContent>Page 14.</BubbleContent>
            </Bubble>
            <MessageFooter>21:04</MessageFooter>
          </MessageContent>
        </Message>
      </Tile>
      <Tile label="long text wraps" size="lg">
        <Message>
          <MessageAvatar>ER</MessageAvatar>
          <MessageContent>
            <Bubble variant="secondary">
              <BubbleContent>I have been waiting at the bridge since the bell rang, and the map still shows nothing past it.</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Message className="w-52">
      <MessageAvatar>KI</MessageAvatar>
      <MessageContent>
        <Bubble variant="secondary">
          <BubbleContent>Chills.</BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  )
}
