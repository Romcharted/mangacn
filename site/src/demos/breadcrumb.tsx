import { Fragment, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@registry/manga/ui/breadcrumb"
import type { Example } from "../registry"
import { force, Tile, Tiles } from "../state-grid"

const TRAIL = ["Library", "Harbour", "Vol. 3", "The long night"]
const LINK = "min-h-11 sm:min-h-0"

/** Click a crumb: it becomes the current page. Nothing navigates. */
export function Preview() {
  const [depth, setDepth] = useState(TRAIL.length)
  const trail = TRAIL.slice(0, depth)
  return (
    <div className="flex flex-col items-center gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          {trail.map((name, i) => {
            const last = i === trail.length - 1
            return (
              <Fragment key={name}>
                <BreadcrumbItem>
                  {last ? (
                    <BreadcrumbPage>{name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#" className={LINK} onClick={(e) => (e.preventDefault(), setDepth(i + 1))}>
                      {name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!last && <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {depth < TRAIL.length && (
        <button type="button" onClick={() => setDepth(TRAIL.length)} className="min-h-11 px-2 font-mono text-xs underline sm:min-h-8">
          back to the chapter
        </button>
      )}
    </div>
  )
}

/** The shortest trail: one link to go back to, then the page you are on. */
function TwoSteps() {
  return (
    <div className="flex justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={LINK}>
              Library
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Vol. 3</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

/** A deep trail: BreadcrumbEllipsis folds the middle steps into one. */
function LongTrail() {
  return (
    <div className="flex justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={LINK}>
              Library
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={LINK}>
              Harbour
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>The long night</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

/** Children on BreadcrumbSeparator replace the brush chevron with your own mark. */
function Slash() {
  return (
    <div className="flex justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={LINK}>
              Library
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className={LINK}>
              Vol. 1
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Chapter 4</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export const examples: Example[] = [
  { fn: "TwoSteps", title: "Two steps", description: "The shortest trail: one link to go back to, then the page you are on.", Component: TwoSteps },
  { fn: "LongTrail", title: "Long trail", description: "BreadcrumbEllipsis folds the middle steps of a deep trail into one step.", Component: LongTrail },
  { fn: "Slash", title: "Custom separator", description: "Pass children to BreadcrumbSeparator to replace the chevron with a slash.", Component: Slash },
]

function Crumb({ state }: { state?: "hover" | "focus" }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" className={LINK} {...force(state ?? "")}>
            Library
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="link · rest">
        <Crumb />
      </Tile>
      <Tile label="link · hover">
        <Crumb state="hover" />
      </Tile>
      <Tile label="link · focus">
        <Crumb state="focus" />
      </Tile>
      <Tile label="current page">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Vol. 3</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Library</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Vol. 3</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
