import { useState } from "react"
import { SearchIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@registry/manga/ui/input-group"
import { Kbd } from "@registry/manga/ui/kbd"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const MAX = 140

function Comment() {
  const [text, setText] = useState("")
  const [sent, setSent] = useState<string | null>(null)
  return (
    <div className="space-y-2">
      <InputGroup>
        <InputGroupTextarea
          aria-label="Comment on chapter 12"
          placeholder="Say something about chapter 12…"
          maxLength={MAX}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="me-auto" aria-live="polite">
            {text.length} / {MAX}
          </InputGroupText>
          <InputGroupButton
            size="sm"
            disabled={!text.trim()}
            onClick={() => {
              setSent(text.trim())
              setText("")
            }}
          >
            Send
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {sent && <p className="text-sm">Posted: “{sent}”</p>}
    </div>
  )
}

export function Preview() {
  return (
    <InputGroup className="w-72">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput aria-label="Search the library" placeholder="Search series, authors…" />
      <InputGroupAddon align="inline-end">
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}

function Website() {
  return (
    <InputGroup className="w-72">
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Circle website" placeholder="your-circle.example" />
    </InputGroup>
  )
}

function Tip() {
  return (
    <InputGroup className="w-72">
      <InputGroupAddon>
        <InputGroupText>¥</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Tip for the artist" inputMode="decimal" defaultValue="500" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>JPY</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  )
}

function CommentBox() {
  return (
    <div className="w-72">
      <Comment />
    </div>
  )
}

export const examples: Example[] = [
  { fn: "Website", title: "With a text addon", description: "InputGroupAddon with an InputGroupText puts a fixed prefix inside the same line.", Component: Website },
  { fn: "Tip", title: "Prefix and suffix", description: "Addons at both ends: a currency sign in front, its unit behind.", Component: Tip },
  { fn: "CommentBox", title: "With a button and a counter", description: "A textarea with a counter and an InputGroupButton in a block-end addon. Send it to try.", Component: CommentBox },
]

function Search(props: { group?: object; input?: object; invalid?: boolean; disabled?: boolean; value?: string }) {
  return (
    <InputGroup className="w-full max-w-64" {...props.group}>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Search"
        placeholder="Search…"
        aria-invalid={props.invalid || undefined}
        disabled={props.disabled}
        defaultValue={props.value}
        {...props.input}
      />
      <InputGroupAddon align="inline-end">
        <Kbd>/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}

function WithButton({ state, disabled }: { state?: string; disabled?: boolean }) {
  return (
    <InputGroup className="w-full max-w-64">
      <InputGroupInput aria-label="Pen name" defaultValue="Inkwell" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton disabled={disabled} {...force(state ?? "")}>
          Save
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="group · rest" size="lg">
        <Search />
      </Tile>
      <Tile label="group · hover" size="lg">
        <Search group={force("hover")} />
      </Tile>
      <Tile label="group · focus" size="lg">
        <Search input={force("focus")} />
      </Tile>
      <Tile label="group · error" size="lg">
        <Search invalid value="??" />
      </Tile>
      <Tile label="group · disabled" size="lg">
        <Search disabled value="Locked" />
      </Tile>
      <Tile label="prefix · text addon" size="lg">
        <InputGroup className="w-full max-w-64">
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput aria-label="Website" defaultValue="ink.example" />
        </InputGroup>
      </Tile>
      <Tile label="button · rest" size="lg">
        <WithButton />
      </Tile>
      <Tile label="button · hover" size="lg">
        <WithButton state="hover" />
      </Tile>
      <Tile label="button · pressed" size="lg">
        <WithButton state="active" />
      </Tile>
      <Tile label="button · focus" size="lg">
        <WithButton state="focus" />
      </Tile>
      <Tile label="button · disabled" size="lg">
        <WithButton disabled />
      </Tile>
      <Tile label="textarea · block-end addon" size="lg">
        <InputGroup className="w-full max-w-72">
          <InputGroupTextarea aria-label="Comment" defaultValue="The rooftop panel hit hard." />
          <InputGroupAddon align="block-end">
            <InputGroupText className="me-auto">27 / 140</InputGroupText>
            <InputGroupButton size="sm">Send</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Tile>
      <Tile label="textarea · error" size="lg">
        <InputGroup className="w-full max-w-72">
          <InputGroupTextarea aria-label="Comment" aria-invalid defaultValue="" placeholder="A comment is required" />
          <InputGroupAddon align="block-end">
            <InputGroupText className="me-auto">0 / 140</InputGroupText>
            <InputGroupButton size="sm" disabled>
              Send
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Tile>
      <Tile label="block-start addon" size="lg">
        <InputGroup className="w-full max-w-72">
          <InputGroupAddon align="block-start">
            <InputGroupText>Chapter title</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput aria-label="Chapter title" defaultValue="Night shift at the print shop" />
        </InputGroup>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="w-56">
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search series…" />
        <InputGroupAddon align="inline-end">
          <Kbd>/</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
