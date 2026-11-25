import { useState } from "react"
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
import { force, Tile, Tiles } from "../state-grid"

type View = "library" | "chapters" | "bookmarks"

const chapters = [
  { id: "11", title: "Ch. 11 · The rain" },
  { id: "12", title: "Ch. 12 · Harbour" },
  { id: "13", title: "Ch. 13 · Locked" },
]

/** A bounded reader: the sidebar lives inside the box (not the full screen), collapsible to icons. */
export function Preview() {
  const [view, setView] = useState<View>("library")
  const [chapter, setChapter] = useState("12")
  const [bookmark, setBookmark] = useState("p4")

  return (
    <div className="relative h-[520px] w-full max-w-3xl overflow-hidden border-ink-panel bg-background">
      <SidebarProvider className="relative! h-full min-h-0! overflow-hidden">
        <Sidebar collapsible="icon" className="absolute! h-full!">
          <SidebarHeader>
            <div className="font-letter text-2xl leading-none tracking-wide uppercase">Reader</div>
            <SidebarInput placeholder="Search the library" aria-label="Search the library" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Browse</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Library" isActive={view === "library"} onClick={() => setView("library")}>
                    <Library />
                    <span>Library</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Chapters" isActive={view === "chapters"} onClick={() => setView("chapters")}>
                    <List />
                    <span>Chapters</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Bookmarks" isActive={view === "bookmarks"} onClick={() => setView("bookmarks")}>
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
                    >
                      <BookOpen />
                      <span>{c.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label={`Star ${c.title}`} showOnHover>
                      <Star />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#" isActive={bookmark === "p4"} onClick={() => setBookmark("p4")}>
                    <span>Page 4</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#" isActive={bookmark === "p17"} onClick={() => setBookmark("p17")}>
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
                <SidebarMenuButton tooltip="Settings">
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
            <SidebarTrigger aria-label="Toggle sidebar" />
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

/** Frozen tiles: every row is the real component, forced into one state (or set with isActive / disabled). */
export function States() {
  return (
    <SidebarProvider className="block! min-h-0! w-full!">
      <Tiles>
        <Tile size="lg" label="row· rest">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· hover">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton {...force("hover")}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· focus">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton {...force("focus")}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· current">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· current · hover">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton isActive {...force("hover")}>
                <Library />
                <span>Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row· disabled">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <Library />
                <span>Locked</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="row · with badge">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton>
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
              <SidebarMenuButton>
                <span>Ch. 12</span>
              </SidebarMenuButton>
              <SidebarMenuAction aria-label="Star" showOnHover={false}>
                <Star />
              </SidebarMenuAction>
            </SidebarMenuItem>
          </SidebarMenu>
        </Tile>
        <Tile size="lg" label="action· hover">
          <SidebarMenu className="w-full max-w-44">
            <SidebarMenuItem>
              <SidebarMenuButton>
                <span>Ch. 12</span>
              </SidebarMenuButton>
              <SidebarMenuAction aria-label="Star" {...force("hover")}>
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
              <SidebarMenuSubButton href="#" isActive>
                <span>Page 4</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
            <SidebarMenuSubItem>
              <SidebarMenuSubButton href="#">
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
          <SidebarTrigger aria-label="Toggle sidebar" />
        </Tile>
        <Tile label="trigger · hover">
          <SidebarTrigger aria-label="Toggle sidebar" {...force("hover")} />
        </Tile>
        <Tile label="icon mode · rest">
          <div className="group" data-collapsible="icon" data-state="collapsed" data-side="left">
            <SidebarMenu className="w-12">
              <SidebarMenuItem>
                <SidebarMenuButton aria-label="Library">
                  <Library />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton aria-label="Chapters" isActive>
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
  return (
    <SidebarProvider className="block! min-h-0! w-full! pointer-events-none">
      <div className="ink-case relative mx-auto w-56 p-2">
        <SidebarGroupLabel>Browse</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive>
              <Library />
              <span>Library</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <List />
              <span>Chapters</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </SidebarProvider>
  )
}
