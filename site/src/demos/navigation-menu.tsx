import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanel,
  NavigationMenuTrigger,
  navigationMenuLinkStyle,
  navigationMenuTriggerStyle,
} from "@registry/manga/ui/navigation-menu"
import { force, Tile, Tiles } from "../state-grid"

const chapterTitles = ["The long night", "After the rain", "Ink on the bridge"]

/** Chapter rows. Live (inside a Root) or static (a frozen panel, plain anchors). */
function Chapters({ active, frozen = false }: { active?: string; frozen?: boolean }) {
  return (
    <ul className="grid w-72 gap-1">
      {chapterTitles.map((title, i) => {
        const content = (
          <>
            <span className="font-letter text-base uppercase">Chapter {i + 1}</span>
            <span className="text-sm">{title}</span>
          </>
        )
        return (
          <li key={title}>
            {frozen ? (
              <a href="#" className={navigationMenuLinkStyle()} data-active={active === title ? "" : undefined}>
                {content}
              </a>
            ) : (
              <NavigationMenuLink href="#" active={active === title}>
                {content}
              </NavigationMenuLink>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** A trigger with keyboard focus set by script, so the focus line shows in its tile. */
function FocusedTrigger() {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    ref.current?.focus({ preventScroll: true })
  }, [])
  return (
    <button ref={ref} type="button" className={navigationMenuTriggerStyle()}>
      Chapters
    </button>
  )
}

export function Preview() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="chapters">
          <NavigationMenuTrigger>Chapters</NavigationMenuTrigger>
          <NavigationMenuIndicator />
          <NavigationMenuContent>
            <Chapters active="After the rain" />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="series">
          <NavigationMenuTrigger>Series</NavigationMenuTrigger>
          <NavigationMenuIndicator />
          <NavigationMenuContent>
            <ul className="grid w-64 gap-1">
              <li>
                <NavigationMenuLink href="#">Rooftop Kids</NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink href="#">Paper Tide</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="staff">
          <NavigationMenuLink href="#" className="h-10 text-lg font-letter uppercase">
            Staff
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="trigger · rest" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuTrigger>Chapters</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="trigger · hover" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuTrigger {...force("hover")}>Chapters</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="trigger · focus" size="lg">
        <FocusedTrigger />
      </Tile>
      <Tile label="trigger · open" size="full">
        <div className="grid w-full justify-items-center gap-3">
          <button type="button" aria-expanded="true" className={navigationMenuTriggerStyle()}>
            Chapters
          </button>
          <NavigationMenuPanel>
            <Chapters active="The long night" frozen />
          </NavigationMenuPanel>
        </div>
      </Tile>
      <Tile label="trigger · disabled" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuTrigger disabled>Chapters</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="link · rest" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuLink href="#">Staff</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="link · hover" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuLink href="#" {...force("hover")}>Staff</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="link · current" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuLink href="#" active>Staff</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="chapters">
          <NavigationMenuTrigger className="h-7 px-2 text-sm">Chapters</NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuItem value="staff">
          <NavigationMenuLink href="#" className="p-1 font-letter text-sm uppercase">
            Staff
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
