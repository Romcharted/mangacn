import { Fragment, useState } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@registry/manga/ui/breadcrumb"

const TRAIL = ["Library", "Harbour", "Vol. 3", "The long night"]

/** Click a crumb: it becomes the current page. Nothing navigates. */
export function Preview() {
  const [depth, setDepth] = useState(TRAIL.length)
  const trail = TRAIL.slice(0, depth)
  return (
    <div className="grid gap-3">
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
                    <BreadcrumbLink href="#" onClick={(e) => (e.preventDefault(), setDepth(i + 1))}>
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
        <button type="button" onClick={() => setDepth(TRAIL.length)} className="w-fit font-mono text-xs underline">
          back to the chapter
        </button>
      )}
    </div>
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
