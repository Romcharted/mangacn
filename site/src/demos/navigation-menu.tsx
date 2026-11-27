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
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const TOUCH = "min-h-11 sm:min-h-10"

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
    <button ref={ref} type="button" className={`${navigationMenuTriggerStyle()} ${TOUCH}`}>
      Chapters
    </button>
  )
}

export function Preview() {
  return (
    <div className="flex justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="chapters">
            <NavigationMenuTrigger className={TOUCH}>Chapters</NavigationMenuTrigger>
            <NavigationMenuIndicator />
            <NavigationMenuContent>
              <Chapters active="After the rain" />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="series">
            <NavigationMenuTrigger className={TOUCH}>Series</NavigationMenuTrigger>
            <NavigationMenuIndicator />
            <NavigationMenuContent>
              <ul className="grid w-64 gap-1">
                <li>
                  <NavigationMenuLink href="#" className={TOUCH}>
                    Rooftop Kids
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#" className={TOUCH}>
                    Paper Tide
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="staff">
            <NavigationMenuLink href="#" className="min-h-11 text-lg font-letter uppercase sm:min-h-10">
              Staff
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

/** Links with no panel: a NavigationMenuLink needs no panel, so the item has no content. */
function PlainLinks() {
  return (
    <div className="flex justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          {["Staff", "Index", "About"].map((label) => (
            <NavigationMenuItem key={label} value={label}>
              <NavigationMenuLink href="#" className={TOUCH}>
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

/** The current link is an ink flat: set active on the link that matches the page. */
function CurrentLink() {
  return (
    <div className="flex justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="index">
            <NavigationMenuLink href="#" className={TOUCH}>
              Index
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem value="staff">
            <NavigationMenuLink href="#" active className={TOUCH}>
              Staff
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

/** A trigger that cannot open yet keeps its label, underlined with dashes. */
function Disabled() {
  return (
    <div className="flex justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="chapters">
            <NavigationMenuTrigger disabled className={TOUCH}>
              Chapters
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem value="staff">
            <NavigationMenuLink href="#" className={TOUCH}>
              Staff
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "PlainLinks", title: "Plain links", description: "Links with no panel: three NavigationMenuLink items side by side.", Component: PlainLinks },
  { fn: "CurrentLink", title: "Current link", description: "active on NavigationMenuLink turns that link into an ink flat.", Component: CurrentLink },
  { fn: "Disabled", title: "Disabled trigger", description: "disabled on NavigationMenuTrigger keeps the label and underlines it with dashes.", Component: Disabled },
]

export function States() {
  return (
    <Tiles>
      <Tile label="trigger · rest" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuTrigger className={TOUCH}>Chapters</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="trigger · hover" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuTrigger className={TOUCH} {...force("hover")}>
                Chapters
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="trigger · focus" size="lg">
        <FocusedTrigger />
      </Tile>
      <Tile label="trigger · open" size="full">
        <div className="grid w-full justify-items-center gap-3">
          <button type="button" aria-expanded="true" className={`${navigationMenuTriggerStyle()} ${TOUCH}`}>
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
              <NavigationMenuTrigger disabled className={TOUCH}>
                Chapters
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="link · rest" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuLink href="#" className={TOUCH}>
                Staff
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="link · hover" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuLink href="#" className={TOUCH} {...force("hover")}>
                Staff
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Tile>
      <Tile label="link · current" size="lg">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem value="a">
              <NavigationMenuLink href="#" active className={TOUCH}>
                Staff
              </NavigationMenuLink>
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
