import { useState } from "react"
import { Button } from "@registry/manga/ui/button"
import {
  Drawer,
  DrawerCard,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@registry/manga/ui/drawer"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const bookmarks = [
  { page: "p. 14", title: "The long night", note: "The lantern scene" },
  { page: "p. 37", title: "After the rain", note: "Rooftop chase" },
  { page: "p. 62", title: "Harbour", note: "First letter" },
]

const chapters = ["The long night", "After the rain", "Harbour", "Paper lanterns"]

/** The reading goal: − / + kit buttons around a big number. */
function GoalPicker({ goal, setGoal }: { goal: number; setGoal: (n: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-6 px-4 py-6">
      <Button variant="outline" size="icon" aria-label="One chapter less" disabled={goal <= 1} onClick={() => setGoal(goal - 1)} className="max-sm:size-11">
        <span aria-hidden className="font-letter text-2xl leading-none">−</span>
      </Button>
      <p className="grid min-w-24 text-center" aria-live="polite">
        <span className="font-sfx text-7xl leading-none tabular-nums">{goal}</span>
        <span className="mt-1 font-letter text-base tracking-wide uppercase">chapters a day</span>
      </p>
      <Button variant="outline" size="icon" aria-label="One chapter more" disabled={goal >= 12} onClick={() => setGoal(goal + 1)} className="max-sm:size-11">
        <span aria-hidden className="font-letter text-2xl leading-none">+</span>
      </Button>
    </div>
  )
}

function GoalDrawer() {
  const [goal, setGoal] = useState(3)
  const [draft, setDraft] = useState(3)
  return (
    <Drawer showSwipeHandle onOpenChange={(open) => open && setDraft(goal)}>
      <DrawerTrigger render={<Button className="min-h-11 sm:min-h-8" />}>Reading goal · {goal}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-md flex-col">
          <DrawerHeader>
            <DrawerTitle>Daily reading goal</DrawerTitle>
            <DrawerDescription>How many chapters a day? Streaks count from tomorrow.</DrawerDescription>
          </DrawerHeader>
          <GoalPicker goal={draft} setGoal={setDraft} />
          <DrawerFooter>
            <DrawerClose render={<Button fullWidth className="min-h-11 sm:min-h-8" />} onClick={() => setGoal(draft)}>
              Set the goal
            </DrawerClose>
            <DrawerClose render={<Button variant="outline" fullWidth className="min-h-11 sm:min-h-8" />}>Cancel</DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function BookmarkList() {
  return (
    <ol className="grid gap-3 px-4 pb-4">
      {bookmarks.map((b) => (
        <li key={b.page} className="flex items-baseline gap-3 border-b-[length:var(--mg-bw-fine)] border-border pb-2">
          <span className="font-mono text-sm">{b.page}</span>
          <span className="grid">
            <span className="font-letter text-lg tracking-wide uppercase">{b.title}</span>
            <span>{b.note}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

function Bookmarks() {
  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger render={<Button variant="outline" className="min-h-11 sm:min-h-8" />}>Bookmarks</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bookmarks</DrawerTitle>
          <DrawerDescription>Vol. 3 · three pages saved.</DrawerDescription>
        </DrawerHeader>
        <BookmarkList />
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" fullWidth className="min-h-11 sm:min-h-8" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ChapterIndex() {
  return (
    <Drawer swipeDirection="left">
      <DrawerTrigger render={<Button variant="outline" className="min-h-11 sm:min-h-8" />}>Chapters</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Chapters</DrawerTitle>
          <DrawerDescription>The long night, Vol. 3.</DrawerDescription>
        </DrawerHeader>
        <ol className="grid gap-2 px-4 pb-4 text-base">
          {chapters.map((c, i) => (
            <li key={c} className="flex gap-3">
              <span className="font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
              {c}
            </li>
          ))}
        </ol>
      </DrawerContent>
    </Drawer>
  )
}

function Confirm() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button className="min-h-11 sm:min-h-8" />}>Finish volume</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Mark Vol. 3 as read?</DrawerTitle>
          <DrawerDescription>Your bookmarks stay where they are.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button fullWidth className="min-h-11 sm:min-h-8" />}>Mark as read</DrawerClose>
          <DrawerClose render={<Button variant="outline" fullWidth className="min-h-11 sm:min-h-8" />}>Not yet</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function Preview() {
  return <GoalDrawer />
}

export const examples: Example[] = [
  { fn: "Bookmarks", title: "From the right", description: "swipeDirection=\"right\" docks the drawer to the right edge, for a list that is read beside the page.", Component: Bookmarks },
  { fn: "ChapterIndex", title: "From the left", description: "swipeDirection=\"left\" slides the drawer in from the left, with the 3px line on its open side.", Component: ChapterIndex },
  { fn: "Confirm", title: "A confirmation", description: "A bottom drawer with a title, a line of text and two choices in the footer; a tap on either closes it.", Component: Confirm },
]

export function States() {
  return (
    <Tiles>
      <Tile label="open · bottom (static twin)" size="lg">
        <div className="w-full pt-2">
          <DrawerCard
            title="Daily reading goal"
            description="How many chapters a day?"
            footer={
              <>
                <Button fullWidth className="min-h-11 sm:min-h-8">
                  Set the goal
                </Button>
                <Button variant="outline" fullWidth className="min-h-11 sm:min-h-8">
                  Cancel
                </Button>
              </>
            }
          >
            <GoalPicker goal={3} setGoal={() => {}} />
          </DrawerCard>
        </div>
      </Tile>
      <Tile label="open · right (static twin)" size="lg">
        <div className="flex w-full justify-end ps-4">
          <DrawerCard
            side="right"
            title="Bookmarks"
            description="Vol. 3 · three pages saved."
            footer={
              <Button variant="outline" fullWidth className="min-h-11 sm:min-h-8">
                Close
              </Button>
            }
            className="w-full max-w-72"
          >
            <BookmarkList />
          </DrawerCard>
        </div>
      </Tile>
      <Tile label="handle · 2px ink bar, 64px" size="lg">
        <div className="w-full pt-2">
          <DrawerCard title="Goal" className="w-full" />
        </div>
      </Tile>
      <Tile label="footer · 2px rule" size="lg">
        <div className="w-full pt-2">
          <DrawerCard handle={false} footer={<Button fullWidth className="min-h-11 sm:min-h-8">Set the goal</Button>} className="w-full" />
        </div>
      </Tile>
      <Tile label="stepper · at the minimum" size="lg">
        <GoalPicker goal={1} setGoal={() => {}} />
      </Tile>
      <Tile label="trigger · hover" size="lg">
        <Button className="min-h-11 sm:min-h-8" {...force("hover")}>
          Reading goal · 3
        </Button>
      </Tile>
      <Tile label="trigger · focus" size="lg">
        <Button className="min-h-11 sm:min-h-8" {...force("focus")}>
          Reading goal · 3
        </Button>
      </Tile>
    </Tiles>
  )
}

/** Live: the drawer's counter works; the button opens the real drawer. */
export function Thumb() {
  const [n, setN] = useState(3)
  const step = "grid size-8 cursor-pointer place-items-center border-[length:var(--mg-bw)] border-border font-letter text-lg hover-invert focus-ink"
  return (
    <div className="flex h-36 w-52 items-end overflow-hidden pt-3">
      <DrawerCard handle className="w-full">
        <div className="flex items-center justify-center gap-3 px-3 pt-2 pb-4">
          <button type="button" aria-label="Fewer" onClick={() => setN((v) => Math.max(0, v - 1))} className={step}>
            −
          </button>
          <span aria-live="polite" className="font-sfx text-4xl leading-none">
            {n}
          </span>
          <button type="button" aria-label="More" onClick={() => setN((v) => v + 1)} className={step}>
            +
          </button>
        </div>
      </DrawerCard>
    </div>
  )
}
