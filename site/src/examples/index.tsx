import { Code } from "../copy"
import { MangaPage } from "./manga-page"
import { SettingsScreen } from "./settings-screen"
import settingsSource from "./settings-screen.tsx?raw"

// Show the import paths a user gets after installing, not the showcase's own aliases.
const userPaths = (src: string) =>
  src.replace(/@registry\/manga\/ui\//g, "@/components/ui/manga/").replace(/@registry\/manga\/signature\//g, "@/components/manga/")

export function Examples() {
  return (
    <article className="pt-6" aria-labelledby="examples-title">
      <a href="#" className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink">
        ← All components
      </a>
      <header className="mt-6 max-w-prose space-y-2">
        <h1 id="examples-title" className="font-letter text-5xl leading-none uppercase">
          Examples
        </h1>
        <p className="text-lg">Finished compositions made only with the kit, shown for real, with the code to copy.</p>
      </header>

      <section aria-labelledby="ex-page" className="mt-10 space-y-4">
        <h2 id="ex-page" className="font-letter text-3xl uppercase">
          A manga page
        </h2>
        <p className="max-w-prose">
          PanelGrid, Panel, PanelCaption and Sfx, with speech bubbles, speed lines and screentones. Switch the layout and the reading
          order; the code follows.
        </p>
        <MangaPage />
      </section>

      <section aria-labelledby="ex-settings" className="mt-14 space-y-4">
        <h2 id="ex-settings" className="font-letter text-3xl uppercase">
          A settings screen
        </h2>
        <p className="max-w-prose">An everyday interface: Tabs, Switch, Select, Input, Button and Table.</p>
        <div className="border-ink-fine p-4 sm:p-8">
          <SettingsScreen />
        </div>
        <Code text={userPaths(settingsSource)} />
      </section>
    </article>
  )
}
