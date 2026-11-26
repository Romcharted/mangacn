import { CodeToggle } from "../copy"
import { InterfaceCards, interfaces, userPaths } from "../interfaces"
import { Chat } from "./chat"
import chatSource from "./chat.tsx?raw"
import { LearnJapanese } from "./learn-japanese"
import learnJapaneseSource from "./learn-japanese.tsx?raw"
import { MangaPage } from "./manga-page"
import { NotFound } from "./not-found"
import notFoundSource from "./not-found.tsx?raw"
import { SettingsScreen } from "./settings-screen"
import settingsSource from "./settings-screen.tsx?raw"

export function Examples() {
  return (
    <article className="pt-6" aria-labelledby="examples-title">
      <a href="#/" className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink">
        ← All components
      </a>
      <header className="mt-6 max-w-prose space-y-2">
        <h1 id="examples-title" className="font-letter text-5xl leading-none uppercase">
          Examples
        </h1>
        <p className="text-lg">Finished compositions made only with the kit, shown for real, with the code to copy.</p>
      </header>

      {interfaces.length > 0 && (
        <section aria-labelledby="ex-ifaces" className="mt-10">
          <h2 id="ex-ifaces" className="font-letter text-3xl uppercase">
            Full interfaces
          </h2>
          <p className="max-w-prose">Whole pages, each one an item you install with one command.</p>
          <InterfaceCards />
        </section>
      )}

      <section aria-labelledby="ex-page" className="mt-10 space-y-4">
        <h2 id="ex-page" className="font-letter text-3xl uppercase">
          Three manga pages
        </h2>
        <p className="max-w-prose">
          Page, Tier, Panel, Place and PanelArt: three pages on one model. Bubbles aim their tails, sound effects and lettering
          follow the page width, and under 480px the page folds into a strip.{" "}
          <a href="#studio" className="underline">
            Make your own in the page studio
          </a>
          .
        </p>
        <MangaPage />
      </section>

      <section aria-labelledby="ex-settings" className="mt-14 space-y-4">
        <h2 id="ex-settings" className="font-letter text-3xl uppercase">
          A settings screen
        </h2>
        <p className="max-w-prose">An everyday interface: Tabs, Switch, Select, Input, Button and Table.</p>
        <div data-demo className="border-ink-fine p-4 sm:p-8">
          <SettingsScreen />
        </div>
        <CodeToggle text={userPaths(settingsSource)} />
      </section>

      <section aria-labelledby="ex-chat" className="mt-14 space-y-4">
        <h2 id="ex-chat" className="font-letter text-3xl uppercase">
          A conversation
        </h2>
        <p className="max-w-prose">Message, Bubble, Input and Button: write a line and send it.</p>
        <div data-demo className="border-ink-fine p-4 sm:p-8">
          <Chat />
        </div>
        <CodeToggle text={userPaths(chatSource)} />
      </section>

      <section aria-labelledby="ex-japanese" className="mt-14 space-y-4">
        <h2 id="ex-japanese" className="font-letter text-3xl uppercase">
          Learn Japanese
        </h2>
        <p className="max-w-prose">A vocabulary card: Ruby over the word, VerticalText, and a BilingualBubble for the example line.</p>
        <div data-demo className="border-ink-fine p-4 sm:p-8">
          <LearnJapanese />
        </div>
        <CodeToggle text={userPaths(learnJapaneseSource)} />
      </section>

      <section aria-labelledby="ex-404" className="mt-14 space-y-4">
        <h2 id="ex-404" className="font-letter text-3xl uppercase">
          A 404 page
        </h2>
        <p className="max-w-prose">Three panels: PanelGrid, SpeedLines, Sfx, Manpu, a thought bubble and a shout button.</p>
        <div data-demo className="border-ink-fine p-4 sm:p-8">
          <NotFound />
        </div>
        <CodeToggle text={userPaths(notFoundSource)} />
      </section>
    </article>
  )
}
