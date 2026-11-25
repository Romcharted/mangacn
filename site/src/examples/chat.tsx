import { useState } from "react"
import { Bubble, BubbleContent, BubbleGroup } from "@registry/manga/ui/bubble"
import { Button } from "@registry/manga/ui/button"
import { Input } from "@registry/manga/ui/input"
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } from "@registry/manga/ui/message"
import { Manpu } from "@registry/manga/signature/manpu"

type Line = { id: number; who: "kite" | "me"; text: string; time: string }

const start: Line[] = [
  { id: 1, who: "kite", text: "Did you read chapter 12?", time: "21:02" },
  { id: 2, who: "kite", text: "The last page!!", time: "21:02" },
  { id: 3, who: "me", text: "Twice. I need to talk about the harbour scene.", time: "21:04" },
  { id: 4, who: "kite", text: "No spoilers, I'm on page 9.", time: "21:05" },
]

// Consecutive lines from the same speaker form one group; only the last bubble keeps its tail.
function groups(lines: Line[]) {
  const out: Line[][] = []
  for (const l of lines) {
    const last = out[out.length - 1]
    if (last && last[0].who === l.who) last.push(l)
    else out.push([l])
  }
  return out
}

export function Chat() {
  const [lines, setLines] = useState(start)
  const [draft, setDraft] = useState("")
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`
    setLines((l) => [...l, { id: l.length + 1, who: "me", text: draft.trim(), time }])
    setDraft("")
  }
  return (
    <div className="mx-auto grid w-full max-w-lg gap-4 border-ink-panel bg-background p-4">
      <header className="flex items-center gap-3 border-b-[length:var(--mg-bw)] border-border pb-3">
        <h3 className="font-letter text-2xl uppercase">Kite</h3>
        <span className="text-sm">reading Vol. 3</span>
        <Manpu kind="sparkle" size="1.4rem" className="ms-auto" />
      </header>
      <MessageGroup className="gap-5" aria-live="polite">
        {groups(lines).map((g) => {
          const mine = g[0].who === "me"
          return (
            <Message key={g[0].id} align={mine ? "end" : "start"}>
              <MessageAvatar>{mine ? "NO" : "KI"}</MessageAvatar>
              <MessageContent>
                {!mine && <MessageHeader>Kite</MessageHeader>}
                <BubbleGroup>
                  {g.map((l) => (
                    <Bubble key={l.id} variant={mine ? "default" : "secondary"} align={mine ? "end" : "start"}>
                      <BubbleContent>{l.text}</BubbleContent>
                    </Bubble>
                  ))}
                </BubbleGroup>
                <MessageFooter>{g[g.length - 1].time}</MessageFooter>
              </MessageContent>
            </Message>
          )
        })}
      </MessageGroup>
      <form onSubmit={send} className="flex gap-2 border-t-[length:var(--mg-bw)] border-border pt-3">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Say something…" aria-label="Message" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
