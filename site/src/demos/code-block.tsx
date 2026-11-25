import type { ReactNode } from "react"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@registry/manga/ui/code-block"
import { force, Tile, Tiles } from "../state-grid"

const install = `npx shadcn@latest add button`

const usage = `import { Button } from "@/components/ui/manga/button"

export function Hero() {
  return <Button variant="shout" size="lg">Start reading!</Button>
}`

export function Preview() {
  return (
    <div className="grid w-full max-w-2xl gap-6">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>hero.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={usage} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{usage}</CodeBlockContent>
        <CodeBlockFooter>tsx · 5 lines</CodeBlockFooter>
      </CodeBlock>

      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>chapter.diff</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value="return `Page ${page}`" />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          <CodeBlockLine>{"export function pageTitle(page: number) {"}</CodeBlockLine>
          <CodeBlockLine variant="removed">{'  return "Page " + page'}</CodeBlockLine>
          <CodeBlockLine variant="added">{"  return `Page ${page}`"}</CodeBlockLine>
          <CodeBlockLine>{"}"}</CodeBlockLine>
        </CodeBlockContent>
      </CodeBlock>

      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>config.ts</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers startLine={12}>
          <CodeBlockLine>{"export const panel = {"}</CodeBlockLine>
          <CodeBlockLine variant="highlighted">{"  border: 3, // the panel line"}</CodeBlockLine>
          <CodeBlockLine>{"  tone: 'shadow',"}</CodeBlockLine>
          <CodeBlockLine>{"}"}</CodeBlockLine>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  )
}

/** A static block for the frozen states (the copy button is the interactive part). */
function Frame({ children }: { children: ReactNode }) {
  return <div className="w-full max-w-72">{children}</div>
}

export function States() {
  return (
    <Tiles>
      <Tile label="copy · rest" size="lg">
        <Frame>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>install</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={install} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{install}</CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="copy · hover" size="lg">
        <Frame>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>install</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={install} {...force("hover")} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{install}</CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="copy · focus" size="lg">
        <Frame>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>install</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={install} {...force("focus")} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{install}</CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="copy · pressed" size="lg">
        <Frame>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>install</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={install} {...force("active")} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{install}</CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="copied · for 1.5 s" size="lg">
        <Frame>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>install</CodeBlockTitle>
              <CodeBlockActions>
                <span aria-hidden className="mark-check inline-flex size-7 items-center justify-center text-base" />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>{install}</CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="content · focus" size="lg">
        <Frame>
          <CodeBlock>
            <CodeBlockContent {...force("focus")}>{install}</CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="line · highlighted" size="lg">
        <Frame>
          <CodeBlock>
            <CodeBlockContent lineNumbers>
              <CodeBlockLine>{"const a = 1"}</CodeBlockLine>
              <CodeBlockLine variant="highlighted">{"const b = 2"}</CodeBlockLine>
            </CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="line · added / removed" size="lg">
        <Frame>
          <CodeBlock>
            <CodeBlockContent>
              <CodeBlockLine variant="removed">{"old()"}</CodeBlockLine>
              <CodeBlockLine variant="added">{"next()"}</CodeBlockLine>
            </CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="variant · destructive" size="lg">
        <Frame>
          <CodeBlock variant="destructive">
            <CodeBlockContent>
              <CodeBlockLine variant="removed">{"rm -rf chapters/"}</CodeBlockLine>
            </CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
      <Tile label="size · sm" size="lg">
        <Frame>
          <CodeBlock size="sm">
            <CodeBlockHeader>
              <CodeBlockTitle>install</CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent>{install}</CodeBlockContent>
          </CodeBlock>
        </Frame>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <CodeBlock size="sm" className="w-56">
      <CodeBlockHeader>
        <CodeBlockTitle>install</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent>{install}</CodeBlockContent>
    </CodeBlock>
  )
}
