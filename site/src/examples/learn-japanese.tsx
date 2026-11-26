import { useId, useState } from "react"
import { BilingualBubble } from "@registry/manga/signature/bilingual-bubble"
import { Ruby, type RubyPart } from "@registry/manga/signature/ruby"
import { VerticalText } from "@registry/manga/signature/vertical-text"
import { Button } from "@registry/manga/ui/button"
import { Label } from "@registry/manga/ui/label"
import { Switch } from "@registry/manga/ui/switch"

/* A vocabulary card: the word written vertically with its furigana, its meaning, and an example line in a
   bubble that flips between Japanese and English. Readings can be hidden to test yourself (they then show on
   hover or focus). */

type Word = { parts: RubyPart[]; meaning: string; kind: string; line: string; translation: string }

const WORDS: Word[] = [
  { parts: [["物", "もの"], ["語", "がたり"]], meaning: "story", kind: "noun", line: "この物語はまだ始まったばかり。", translation: "This story has only just begun." },
  { parts: [["毎", "まい"], ["日", "にち"]], meaning: "every day", kind: "noun, adverb", line: "毎日、少しずつ描く。", translation: "I draw a little every day." },
  { parts: [["約", "やく"], ["束", "そく"]], meaning: "promise", kind: "noun", line: "明日また会う約束だよ。", translation: "We promised to meet again tomorrow." },
]

export function LearnJapanese() {
  const [at, setAt] = useState(0)
  const [readings, setReadings] = useState(true)
  const id = useId()
  const word = WORDS[at]
  const go = (step: number) => setAt((n) => (n + step + WORDS.length) % WORDS.length)

  return (
    <article aria-labelledby={`${id}-word`} className="relative mx-auto grid w-full max-w-xl gap-5 ink-case p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-letter text-sm tracking-widest uppercase">Vocabulary · card {at + 1} of {WORDS.length}</p>
        <div className="flex items-center gap-3">
          <Switch id={`${id}-readings`} checked={readings} onCheckedChange={(on: boolean) => setReadings(on)} />
          <Label htmlFor={`${id}-readings`}>Readings</Label>
        </div>
      </header>

      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5 sm:gap-8">
        <div className="relative border-ink px-3 py-4">
          <VerticalText as="h3" id={`${id}-word`} className="text-5xl leading-[1.6]">
            <Ruby key={`${at}-${readings}`} parts={word.parts} reveal={readings ? "always" : "hover"} />
          </VerticalText>
        </div>
        <div className="grid min-w-0 gap-3">
          <p className="font-mono text-xs">{word.kind}</p>
          <p className="font-letter text-3xl leading-none tracking-wide uppercase">{word.meaning}</p>
          <p className="text-sm">{readings ? "Readings shown over the word." : "Readings hidden: hover or focus the word to check."}</p>
        </div>
      </div>

      <BilingualBubble key={at} original={word.line} translation={word.translation} tail="none" variant="narration" switchAlign="start" className="w-full" />

      <footer className="flex items-center justify-between gap-3">
        <Button variant="outline" className="max-sm:min-h-11" onClick={() => go(-1)}>
          ← Previous
        </Button>
        <Button className="max-sm:min-h-11" onClick={() => go(1)}>
          Next card →
        </Button>
      </footer>
    </article>
  )
}
