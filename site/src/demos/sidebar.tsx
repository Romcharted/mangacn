import { useState, type ReactNode } from "react"
import { Bookmark, BookOpen, Library, List, Settings, Star } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@registry/manga/ui/sidebar"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

type View = "library" | "chapters" | "bookmarks"

const chapters = [
  { id: "11", title: "Ch. 11 · The rain" },
  { id: "12", title: "Ch. 12 · Harbour" },
  { id: "13", title: "Ch. 13 · Locked" },
]

/* Phones: 44px rows and toggles; from sm up the sidebar keeps its own compact size. */
const TOUCH_ROW = "min-h-11 sm:min-h-9"
const TOUCH_SUB = "min-h-11 sm:min-h-8"
const TOUCH_TRIGGER = "size-11 sm:size-8"
const FRAME = "absolute! h-full!"

/** A bounded box the sidebar lives in (not the full screen), as in the Preview. */
function Bounded({ open = true, children }: { open?: boolean; children: ReactNode }) {
  return (
    <div className="relative h-80 w-full max-w-md overflow-hidden border-ink-panel bg-background">
      <SidebarProvider defaultOpen={open} className="relative! h-full min-h-0! overflow-hidden">
        {children}
      </SidebarProvider>
    </div>
  )
}

/** A bounded reader: the sidebar lives inside the box (not the full screen), collapsible to icons. */
export function Preview() {
  const [view, setView] = useState<View>("library")
  const [chapter, setChapter] = useState("12")
  const [bookmark, setBookmark] = useState("p4")

  return (
    <div className="relative h-[520px] w-full max-w-3xl overflow-hidden border-ink-panel bg-background">
      <SidebarProvider className="relative! h-full min-h-0! overflow-hidden">
        <Sidebar collapsible="icon" className={FRAME}>
          <SidebarHeader>
            <div className="font-letter text-2xl leading-none tracking-wide uppercase">Reader</div>
            <SidebarInput placeholder="Search the library" aria-label="Search the library" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Browse</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Library" isActive={view === "library"} onClick={() => setView("library")} className={TOUCH_ROW}>
                    <Library />
                    <span>Library</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Chapters" isActive={view === "chapters"} onClick={() => setView("chapters")} className={TOUCH_ROW}>
                    <List />
                    <span>Chapters</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Bookmarks" isActive={view === "bookmarks"} onClick={() => setView("bookmarks")} className={TOUCH_ROW}>
                    <Bookmark />
                    <span>Bookmarks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Volume one</SidebarGroupLabel>
              <SidebarMenu>
                {chapters.map((c) => (
                  <SidebarMenuItem key={c.id}>
                    <SidebarMenuButton
                      tooltip={c.title}
                      disabled={c.id === "13"}
                      isActive={chapter === c.id}
                      onClick={() => setChapter(c.id)}
                      className={TOUCH_ROW}
                    >
                      <BookOpen />
                      <span>{c.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label={`Star ${c.title}`} showOnHover className="size-11 sm:size-5">
                      <Star />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#" isActive={bookmark === "p4"} onClick={() => setBookmark("p4")} className={TOUCH_SUB}>
                    <span>Page 4</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#" isActive={bookmark === "p17"} onClick={() => setBookmark("p17")} className={TOUCH_SUB}>
                    <span>Page 17</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" className={TOUCH_ROW}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="min-h-0 overflow-auto">
          <header className="flex h-12 shrink-0 items-center gap-3 border-b-[length:var(--mg-bw)] border-border px-3">
            <SidebarTrigger aria-label="Toggle sidebar" className={TOUCH_TRIGGER} />
            <span className="font-letter text-lg tracking-wide uppercase">{view}</span>
          </header>
          <div className="space-y-3 p-4">
            <p className="font-letter text-2xl leading-none uppercase">Chapter {chapter}</p>
            <p className="text-base">Collapse the panel to icons with the square button, or open it from the edge.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

/** side="right" moves the panel and its 3px ink edge to the other side of the page. */
function RightSide() {
  return (
    <Bounded>
      <Sidebar side="right" collapsible="icon" className={FRAME}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Notes</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className={TOUCH_ROW}>
                  <Bookmark />
                  <span>Page 4</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={TOUCH_ROW}>
                  <Star />
                  <span>Page 17</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0 overflow-auto">
        <p className="p-4 text-base">The panel sits on the right, and its ink edge moves with it.</p>
      </SidebarInset>
    </Bounded>
  )
}

/** SidebarMenuBadge shows a count; SidebarMenuAction with showOnHover reveals its star on hover. */
function Badges() {
  return (
    <Bounded>
      <Sidebar className={FRAME}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Volume one</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className={TOUCH_ROW}>
                  <List />
                  <span>Chapters</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className={TOUCH_ROW}>
                  <BookOpen />
                  <span>Ch. 12 · Harbour</span>
                </SidebarMenuButton>
                <SidebarMenuAction aria-label="Star Ch. 12" showOnHover className="size-11 sm:size-5">
                  <Star />
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0 overflow-auto">
        <p className="p-4 text-base">Hover a chapter row to reveal its star.</p>
      </SidebarInset>
    </Bounded>
  )
}

/** collapsible="icon" folds the panel to square icon cells; tooltips name each one. */
function IconMode() {
  return (
    <Bounded open={false}>
      <Sidebar collapsible="icon" className={FRAME}>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Library" className={TOUCH_ROW}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Chapters" isActive className={TOUCH_ROW}>
                <List />
                <span>Chapters</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="min-h-0 overflow-auto">
        <div className="flex items-center gap-3 p-3">
          <SidebarTrigger aria-label="Open the sidebar" className={TOUCH_TRIGGER} />
          <span className="font-letter uppercase">Library</span>
        </div>
      </SidebarInset>
    </Bounded>
  )
}

export const examples: Example[] = [
  { fn: "RightSide", title: "On the right", description: "side=\"right\" moves the panel and its ink edge to the other side of the page.", Component: RightSide },
  { fn: "Badges", title: "Badges and actions", description: "SidebarMenuBadge shows a count; SidebarMenuAction reveals a star when the row is hovered.", Component: Badges },
  { fn: "IconMode", title: "Icon mode", description: "collapsible=\"icon\" folds the panel to square cells, and tooltip names each one.", Component: IconMode },
]

/** Frozen tiles: every row is the real component, forced into one state (or set with isActive / disabled). */
export function States() {
  return (
    <SidebarProvider className="block! min-h-0! w-full!">
      <Tiles>
        <Tile size="lg" label="row· rest">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton className={TOUCH_ROW}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· hover">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton className={TOUCH_ROW} {...force("hover")}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· focus">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton className={TOUCH_ROW} {...force("focus")}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· current">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton isActive className={TOUCH_ROW}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· current · hover">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton isActive className={TOUCH_ROW} {...force("hover")}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· disabled">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton disabled className={TOUCH_ROW}>
                <Library />
                <span>Locked</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row · with badge">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton className={TOUCH_ROW}>
                <List />
                <span>Chapters</span>
              </SidebarMenuButton>
              <SidebarMenuBadge>3</SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="action· rest">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton className={TOUCH_ROW}>
                <span>Ch. 12</span>
              </SidebarMenuButton>
              <SidebarMenuAction aria-label="Star" showOnHover={false} className="size-11 sm:size-5">
                <Star />
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="action· hover">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton className={TOUCH_ROW}>
                <span>Ch. 12</span>
              </SidebarMenuButton>
              <SidebarMenuAction aria-label="Star" className="size-11 sm:size-5" {...force("hover")}>
                <Star />
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile label="group label">
          <div className="w-full max-w-44">
            <SidebarGroupLabel>Volume one</SidebarGroupLabel>
          </div>
        </Tile>
        <Tile label="sub-row · current" size="lg">
          <SidebarMenuSub className="w-56">
            <SidebarMenuSubItem>
              <SidebarMenuSubButton href="#" isActive className={TOUCH_SUB}>
                <span>Page 4</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton href="#" className={TOUCH_SUB}>
                <span>Page 17</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </Tile>
        <Tile size="lg" label="input · rest">
          <div className="w-full min-w-0 max-w-56">
            <SidebarInput placeholder="Search" aria-label="Search" />
          </div>
        </Tile>
        <Tile size="lg" label="input · focus">
          <div className="w-full min-w-0 max-w-56">
            <SidebarInput placeholder="Search" aria-label="Search" className="focus-ink" />
          </div>
        </Tile>
        <Tile label="trigger · rest">
          <SidebarTrigger aria-label="Toggle sidebar" className={TOUCH_TRIGGER} />
        </Tile>
        <Tile label="trigger · hover">
          <SidebarTrigger aria-label="Toggle sidebar" className={TOUCH_TRIGGER} {...force("hover")} />
        </Tile>
        <Tile label="icon mode · rest">
          <div className="group" data-collapsible="icon" data-state="collapsed" data-side="left">
            <SidebarMenu className="w-12">
              <SidebarMenuItem>
                <SidebarMenuButton aria-label="Library" className={TOUCH_ROW}>
                  <Library />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton aria-label="Chapters" isActive className={TOUCH_ROW}>
                  <List />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </Tile>
      </Tiles>
    </SidebarProvider>
  )
}

export function Thumb() {
  const [at, setAt] = useState("library")
  return (
    <SidebarProvider className="block! min-h-0! w-full!">
      <div className="ink-case relative mx-auto w-56 p-2">
        <SidebarGroupLabel>Browse</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={at === "library"} onClick={() => setAt("library")}>
              <Library />
              <span>Library</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={at === "chapters"} onClick={() => setAt("chapters")}>
              <List />
              <span>Chapters</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </SidebarProvider>
  )
}
