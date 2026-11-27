import { useEffect } from "react"
import { CodeToggle } from "../copy"
import { to } from "../router"
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
  useEffect(() => {
    document.title = "Examples — mangacn"
  }, [])
  return (
    <article className="mx-auto max-w-7xl px-4 pt-6 pb-24" aria-labelledby="examples-title">
      <header className="max-w-prose space-y-2">
        <h1 id="examples-title" className="font-letter text-5xl leading-none uppercase">
          Examples
        </h1>
        <p className="text-lg">Finished compositions made only with the kit, shown for real, with the code to copy.</p>
      </header>

      {interfaces.length > 0 && (
        <section aria-labelledby="ex-ifaces" className="mt-10">
          <h2 id="ex-ifaces" className="font-letter text-3xl uppercase">
            Ten full interfaces
          </h2>
          <p className="max-w-prose">Whole pages, each one an item you install with one command. Open one to use it at full size.</p>
          <InterfaceCards />
        </section>
      )}

      <h2 className="mt-16 font-sfx text-3xl uppercase">More compositions</h2>
      <section aria-labelledby="ex-page" className="mt-8 space-y-4">
        <h3 id="ex-page" className="font-letter text-3xl uppercase">
          A manga page, lettered
        </h3>
        <p className="max-w-prose">
          A page of Mapless as it was drawn, and the same page lettered with the kit&apos;s bubbles, sound effects and captions, in real text.{" "}
          <a href={to("studio")} className="underline">
            Make your own in the page studio
          </a>
          .
        </p>
        <MangaPage />
      </section>

      <section aria-labelledby="ex-settings" className="mt-14 space-y-4">
        <h3 id="ex-settings" className="font-letter text-3xl uppercase">
          A settings screen
        </h3>
        <p className="max-w-prose">An everyday interface: Tabs, Switch, Select, Input, Button and Table.</p>
        <div data-demo className="border-ink-fine p-4 sm:p-8">
          <SettingsScreen />
        </div>
        <CodeToggle text={userPaths(settingsSource)} />
      </section>

      <section aria-labelledby="ex-chat" className="mt-14 space-y-4">
        <h3 id="ex-chat" className="font-letter text-3xl uppercase">
          A conversation
        </h3>
        <p className="max-w-prose">Message, Bubble, Input and Button: write a line and send it.</p>
        <div data-demo className="border-ink-fine p-4 sm:p-8">
          <Chat />
        </div>
        <CodeToggle text={userPaths(chatSource)} />
      </section>

      <section aria-labelledby="ex-japanese" className="mt-14 space-y-4">
        <h3 id="ex-japanese" className="font-letter text-3xl uppercase">
          Learn Japanese
        </h3>
        <p className="max-w-prose">A vocabulary card: Ruby over the word, VerticalText, and a BilingualBubble for the example line.</p>
        <div data-demo className="border-ink-fine p-4 sm:p-8">
          <LearnJapanese />
        </div>
        <CodeToggle text={userPaths(learnJapaneseSource)} />
      </section>

      <section aria-labelledby="ex-404" className="mt-14 space-y-4">
        <h3 id="ex-404" className="font-letter text-3xl uppercase">
          A 404 page
        </h3>
        <p className="max-w-prose">Three panels: PanelGrid, SpeedLines, Sfx, Manpu, a thought bubble and a shout button.</p>
        <div data-demo className="border-ink-fine p-4 sm:p-8">
          <NotFound />
        </div>
        <CodeToggle text={userPaths(notFoundSource)} />
      </section>
    </article>
  )
}
