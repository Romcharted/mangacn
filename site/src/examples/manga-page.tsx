import { useState } from "react"
import { Page } from "@registry/manga/signature/panel"
import { CodeToggle } from "../copy"
import { Choice, Flag } from "../playground"
import { LAST_TRAIN } from "../pages/last-train"
import { LunchBreak } from "../pages/lunch-break"
import lunchSource from "../pages/lunch-break.tsx?raw"

const PAGES = ["lunch break", "last train"] as const
type Which = (typeof PAGES)[number]

const json = (data: unknown) => `import { Page, type PageData } from "@/components/manga/panel"\n\nconst page: PageData = ${JSON.stringify(data, null, 2)}\n\n<Page page={page} />`

/** Two pages made with the Page model: drawn for the kit, and photos toned live. */
export function MangaPage() {
  const [which, setWhich] = useState<Which>("lunch break")
  const [rtl, setRtl] = useState(false)
  const reading = rtl ? "rtl" : "ltr"
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div className="flex flex-wrap items-end gap-6">
        <Choice label="page" value={which} options={PAGES} onChange={setWhich} />
        <div className="w-56">
          <Flag label="read right to left" checked={rtl} onChange={setRtl} />
        </div>
      </div>
      <div className="grid justify-items-center border-ink-fine p-3 sm:p-6">
        <div className="w-full max-w-3xl">
          {which === "lunch break" ? (
            <LunchBreak reading={reading} />
          ) : (
            <Page page={LAST_TRAIN} reading={reading} label="Last train, a page of toned photos" />
          )}
        </div>
      </div>
      {which === "lunch break" && (
        <p className="max-w-prose text-sm">Drawn for the kit in SVG: Rin and her rice ball, and Mochi the cat. Written in JSX.</p>
      )}
      {which === "last train" && (
        <p className="max-w-prose text-sm">
          Freely licensed photos from Wikimedia Commons (CC0, CC BY, CC BY-SA), turned into screentone by PanelArt. Authors and
          licenses:{" "}
          <a className="underline" href={`${import.meta.env.BASE_URL}pages/photos/CREDITS.md`}>
            photo credits
          </a>
          . Written as data.
        </p>
      )}
      <CodeToggle text={which === "lunch break" ? lunchSource : json(LAST_TRAIN)} />
    </div>
  )
}
