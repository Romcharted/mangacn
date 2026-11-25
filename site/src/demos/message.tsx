import { Bubble, BubbleContent } from "@registry/manga/ui/bubble"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@registry/manga/ui/message"

export function Preview() {
  return (
    <MessageGroup className="max-w-lg gap-5">
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
