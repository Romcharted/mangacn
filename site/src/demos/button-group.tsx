import { Button } from "@registry/manga/ui/button"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@registry/manga/ui/button-group"
import { Input } from "@registry/manga/ui/input"
import { force, Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <div className="flex flex-col items-start gap-6 pb-48">
      <ButtonGroup aria-label="Pages">
        <Button variant="outline">Prev</Button>
        <ButtonGroupText>Page 4 of 12</ButtonGroupText>
        <Button variant="outline">Next</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Search">
        <Input placeholder="Search the series" className="w-56" />
        <Button>Go</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Reading order">
        <Button variant="outline">Left</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical" aria-label="Chapters">
        <Button variant="outline">Chapter 1</Button>
        <Button variant="outline">Chapter 2</Button>
        <Button variant="outline">Chapter 3</Button>
      </ButtonGroup>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="row · rest" size="lg">
        <ButtonGroup aria-label="Rest">
          <Button variant="outline">Prev</Button>
          <Button variant="outline">Next</Button>
        </ButtonGroup>
      </Tile>
      <Tile label="row · hover" size="lg">
        <ButtonGroup aria-label="Hover">
          <Button variant="outline">Prev</Button>
          <Button variant="outline" {...force("hover")}>
            Next
          </Button>
        </ButtonGroup>
      </Tile>
      <Tile label="row · focus" size="lg">
        <ButtonGroup aria-label="Focus">
          <Button variant="outline">Prev</Button>
          <Button variant="outline" {...force("focus")}>
            Next
          </Button>
        </ButtonGroup>
      </Tile>
      <Tile label="row · disabled" size="lg">
        <ButtonGroup aria-label="Disabled">
          <Button variant="outline">Prev</Button>
          <Button variant="outline" disabled>
            Next
          </Button>
        </ButtonGroup>
      </Tile>
      <Tile label="row · separator" size="lg">
        <ButtonGroup aria-label="Separator">
          <Button variant="outline">Left</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      </Tile>
      <Tile label="row · input + button" size="lg">
        <ButtonGroup aria-label="Input">
          <Input placeholder="Find a page" className="w-40" />
          <Button>Go</Button>
        </ButtonGroup>
      </Tile>
      <Tile label="column · rest" size="lg">
        <ButtonGroup orientation="vertical" aria-label="Column">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </Tile>
      <Tile label="column · hover" size="lg">
        <ButtonGroup orientation="vertical" aria-label="Column hover">
          <Button variant="outline">Top</Button>
          <Button variant="outline" {...force("hover")}>
            Middle
          </Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="pointer-events-none">
      <ButtonGroup aria-label="Pages">
        <Button variant="outline" size="sm" tabIndex={-1}>
          Prev
        </Button>
        <Button variant="outline" size="sm" tabIndex={-1}>
          Next
        </Button>
      </ButtonGroup>
    </div>
  )
}
