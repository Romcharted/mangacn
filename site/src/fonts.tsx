import { StrictMode, type CSSProperties } from "react"
import { createRoot } from "react-dom/client"
import { usePrefs } from "./prefs"
import "./index.css"

// Temporary page (step 2): compare three OFL pairings, then keep the chosen one.
// Licences checked in github.com/google/fonts — every family below lives in /ofl.
type Font = { family: string; dir: string; designer: string; jp?: boolean }
type Pairing = { id: string; name: string; mood: string; body: Font; letter: Font; sfx: Font }

const PAIRINGS: Pairing[] = [
  {
    id: "a",
    name: "A — Classic ink",
    mood: "Sober reading text, loud comic-book lettering, heavy Japanese gothic for SFX.",
    body: { family: "IBM Plex Sans", dir: "ibmplexsans", designer: "Mike Abbink, Bold Monday" },
    letter: { family: "Bangers", dir: "bangers", designer: "Vernon Adams" },
    sfx: { family: "Dela Gothic One", dir: "delagothicone", designer: "artakana", jp: true },
  },
  {
    id: "b",
    name: "B — Hand-lettered",
    mood: "Very legible body, small-caps hand lettering like a scanlation, sharp brushy SFX.",
    body: { family: "Atkinson Hyperlegible Next", dir: "atkinsonhyperlegiblenext", designer: "Braille Institute" },
    letter: { family: "Patrick Hand SC", dir: "patrickhandsc", designer: "Patrick Wagesreiter" },
    sfx: { family: "Reggae One", dir: "reggaeone", designer: "Fontworks Inc.", jp: true },
  },
  {
    id: "c",
    name: "C — Brush & pop",
    mood: "Japanese-ready body, lively marker lettering, round brush SFX. Leans toward webtoon.",
    body: { family: "Zen Kaku Gothic New", dir: "zenkakugothicnew", designer: "Yoshimichi Ohira", jp: true },
    letter: { family: "Shantell Sans", dir: "shantellsans", designer: "Shantell Martin, Arrow Type" },
    sfx: { family: "Potta One", dir: "pottaone", designer: "Font Zone 108", jp: true },
  },
]

function Specimen({ p }: { p: Pairing }) {
  const vars = {
    "--font-manga-body": `"${p.body.family}", sans-serif`,
    "--font-manga-letter": `"${p.letter.family}", sans-serif`,
    "--font-manga-sfx": `"${p.sfx.family}", sans-serif`,
    fontFamily: "var(--font-manga-body)",
  } as CSSProperties
  return (
    <section style={vars} aria-labelledby={`p-${p.id}`} className="relative border-ink-panel bg-background tone-shadow">
      <header className="flex flex-wrap items-baseline justify-between gap-2 ink-fill px-4 py-2">
        <h2 id={`p-${p.id}`} className="font-letter text-2xl uppercase">
          {p.name}
        </h2>
        <p className="text-sm">{p.mood}</p>
      </header>

      <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <h3 className="font-letter text-4xl leading-none uppercase">Chapter 12: The Long Night</h3>
          <p className="leading-relaxed">
            The rain had not stopped for three days. She folded the map, checked the time and stepped out
            into the street — 0123456789, “quotes”, <em>italics</em>, <strong>bold</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="h-10 ink-fill px-4 font-letter text-lg uppercase focus-ink">Read now</button>
            <button className="h-10 border-ink px-4 font-letter text-lg uppercase hover:tone-20 focus-ink">
              Add to list
            </button>
            <span className="border-ink px-2 py-0.5 font-letter text-sm uppercase">Ongoing</span>
            <span className="shape-burst ink-fill px-5 py-3 font-letter text-sm uppercase">New!</span>
          </div>
          <label className="block max-w-sm">
            <span className="mb-1 block font-letter uppercase">Email</span>
            <input className="h-10 w-full border-ink bg-background px-3 focus-ink" defaultValue="reader@example.com" />
          </label>
        </div>

        <div className="relative grid min-h-56 place-items-center overflow-hidden border-ink-panel focus-lines">
          <div aria-hidden className="relative text-center leading-none">
            <span className="block font-sfx text-7xl text-foreground [-webkit-text-stroke:4px_var(--background)] [paint-order:stroke]">
              ドドド
            </span>
            <span className="mt-2 block -rotate-6 font-sfx text-6xl text-foreground [-webkit-text-stroke:4px_var(--background)] [paint-order:stroke]">
              BAM!
            </span>
            <span className="mt-2 block rotate-3 font-sfx text-3xl text-foreground [-webkit-text-stroke:3px_var(--background)] [paint-order:stroke]">
              ゴゴゴ・ザッ
            </span>
          </div>
        </div>
      </div>

      <table className="w-full border-t-[length:var(--mg-bw)] border-border text-sm">
        <caption className="sr-only">Fonts and licences for pairing {p.name}</caption>
        <thead className="ink-fill text-start">
          <tr>
            <th className="px-4 py-1.5 text-start">Role</th>
            <th className="px-4 py-1.5 text-start">Family</th>
            <th className="px-4 py-1.5 text-start">Designer</th>
            <th className="px-4 py-1.5 text-start">Licence</th>
          </tr>
        </thead>
        <tbody>
          {(
            [
              ["Body & fields", p.body],
              ["Lettering", p.letter],
              ["SFX", p.sfx],
            ] as const
          ).map(([role, f]) => (
            <tr key={role} className="border-t-[length:var(--mg-bw-fine)] border-border">
              <td className="px-4 py-1.5">{role}</td>
              <td className="px-4 py-1.5">
                {f.family}
                {f.jp && <span className="ms-2 border-ink-fine px-1 text-xs">JP / katakana</span>}
              </td>
              <td className="px-4 py-1.5">{f.designer}</td>
              <td className="px-4 py-1.5">
                <a className="underline" href={`https://github.com/google/fonts/blob/main/ofl/${f.dir}/OFL.txt`}>
                  SIL OFL 1.1
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function Page() {
  const [prefs, set] = usePrefs()
  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-letter text-5xl uppercase">Pick a font pairing</h1>
          <p className="mt-2 max-w-prose">
            Three pairings from Google Fonts, all under the SIL Open Font License. Each pairing has a reading
            face, a lettering face (titles, buttons, badges) and an SFX face that also covers katakana.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={prefs.dark}
          onClick={() => set({ dark: !prefs.dark })}
          className="h-9 border-ink px-3 font-letter uppercase hover:tone-20 focus-ink aria-pressed:ink-fill"
        >
          Dark
        </button>
      </header>
      {PAIRINGS.map((p) => (
        <Specimen key={p.id} p={p} />
      ))}
    </main>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
