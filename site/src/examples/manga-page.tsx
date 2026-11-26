import { useState } from "react"
import { Page } from "@registry/manga/signature/panel"
import { CodeToggle } from "../copy"
import { Choice, Flag } from "../playground"
import { LAST_TRAIN } from "../pages/last-train"
import { LunchBreak } from "../pages/lunch-break"
import lunchSource from "../pages/lunch-break.tsx?raw"
import { NEMO, NEMO_CREDIT } from "../pages/nemo"

const PAGES = ["lunch break", "last train", "little nemo"] as const
type Which = (typeof PAGES)[number]

const json = (data: unknown) => `import { Page, type PageData } from "@/components/manga/panel"\n\nconst page: PageData = ${JSON.stringify(data, null, 2)}\n\n<Page page={page} />`

/** Three pages made with the Page model: drawn for the kit, photos toned live, a public-domain comic. */
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
          ) : which === "last train" ? (
            <Page page={LAST_TRAIN} reading={reading} label="Last train, a page of toned photos" />
          ) : (
            <Page page={NEMO} reading={reading} label="Little Nemo in Slumberland, 27 May 1906" />
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
      {which === "little nemo" && (
        <p className="max-w-prose text-sm">
          <em>{NEMO_CREDIT.title}</em>, {NEMO_CREDIT.date}, by {NEMO_CREDIT.author}. {NEMO_CREDIT.license};{" "}
          <a className="underline" href={NEMO_CREDIT.source}>
            source scan
          </a>
          . The panels are cut from the scan and laid out again; the dialogue is lettered again as real text.
        </p>
      )}
      <CodeToggle text={which === "lunch break" ? lunchSource : json(which === "last train" ? LAST_TRAIN : NEMO)} />
    </div>
  )
}
