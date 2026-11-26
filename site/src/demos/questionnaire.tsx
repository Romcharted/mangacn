import { useState, type FormEvent, type ReactNode } from "react"
import { Button } from "@registry/manga/ui/button"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@registry/manga/ui/questionnaire"
import { force, Tile, Tiles } from "../state-grid"

const genres = [
  { value: "action", label: "Action", hint: "Rivals, a tournament, one big punch." },
  { value: "romance", label: "Romance", hint: "Two leads, one umbrella." },
  { value: "mystery", label: "Mystery", hint: "A locked room on the last train." },
  { value: "slice", label: "Slice of life", hint: "A quiet week at the corner bakery." },
]
const lengths = ["16 pages", "32 pages", "48 pages"]
const tones = ["Dot screentone", "Speed lines", "Cross-hatching", "Stepped fades"]

type Plan = { genre: string; pages: string; tones: string[]; pitch: string }

export function Preview() {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [run, setRun] = useState(0)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPlan({
      genre: genres.find((g) => g.value === data.get("genre"))?.label ?? "—",
      pages: String(data.get("pages") ?? "—"),
      tones: data.getAll("tones").map(String),
      pitch: String(data.get("pitch") ?? ""),
    })
  }

  if (plan)
    return (
      <div className="max-w-md pe-2 pb-2">
        <div className="relative ink-case animate-pop space-y-3 p-5">
          <p className="flex items-center gap-2 font-letter text-2xl tracking-wide uppercase">
            <span className="mark-check text-xl" aria-hidden /> One-shot planned
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-base">
            <dt className="font-letter tracking-wide uppercase">Genre</dt>
            <dd>{plan.genre}</dd>
            <dt className="font-letter tracking-wide uppercase">Length</dt>
            <dd>{plan.pages}</dd>
            <dt className="font-letter tracking-wide uppercase">Tones</dt>
            <dd>{plan.tones.length ? plan.tones.join(", ") : "Skipped"}</dd>
            <dt className="font-letter tracking-wide uppercase">Pitch</dt>
            <dd className="break-words">{plan.pitch}</dd>
          </dl>
          <Button
            variant="outline"
            onClick={() => {
              setPlan(null)
              setRun((r) => r + 1)
            }}
          >
            Start over
          </Button>
        </div>
      </div>
    )

  return (
    <div className="max-w-md pe-2 pb-2">
      <Questionnaire key={run} shortcuts="letters" onSubmit={submit} aria-label="Plan your one-shot">
        <QuestionnaireProgress />
        <QuestionnaireItem name="genre" required>
          <QuestionnaireTitle>Plan your one-shot: which genre?</QuestionnaireTitle>
          <QuestionnaireDescription>Pick one. Press a letter to choose, Enter to go on.</QuestionnaireDescription>
          <QuestionnaireChoices>
            {genres.map((g) => (
              <QuestionnaireChoice key={g.value} value={g.value}>
                {g.label}
                <QuestionnaireChoiceDescription>{g.hint}</QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="pages" required>
          <QuestionnaireTitle>How many pages?</QuestionnaireTitle>
          <QuestionnaireChoices>
            {lengths.map((l) => (
              <QuestionnaireChoice key={l} value={l} disabled={l === "48 pages"}>
                {l}
                {l === "48 pages" && <QuestionnaireChoiceDescription>Needs an editor’s OK.</QuestionnaireChoiceDescription>}
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="tones" multiple>
          <QuestionnaireTitle>Which tones will you lay?</QuestionnaireTitle>
          <QuestionnaireDescription>Pick any, or skip.</QuestionnaireDescription>
          <QuestionnaireChoices>
            {tones.map((t) => (
              <QuestionnaireChoice key={t} value={t}>
                {t}
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="pitch" required>
          <QuestionnaireTitle>Your pitch in one line</QuestionnaireTitle>
          <QuestionnaireInput placeholder="A courier races the last ferry…" aria-label="Pitch" />
          <QuestionnaireError>Write one line to finish.</QuestionnaireError>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit>Plan it</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}

/** Puts data-force="focus" on the hidden input of a choice (the row draws the ring). */
function focusInput(el: HTMLElement | null) {
  el?.querySelector("input")?.setAttribute("data-force", "focus")
}

/** One question with one choice, frozen in a state. */
function ChoiceState({ multiple, state }: { multiple?: boolean; state: "rest" | "hover" | "focus" | "checked" | "disabled" | "disabled, checked" }) {
  const label = multiple ? "Speed lines" : "Action"
  return (
    <div className="w-full pe-2 pb-2" ref={state === "focus" ? focusInput : undefined}>
      <Questionnaire className="w-full" aria-label={`${multiple ? "Checkbox" : "Radio"} ${state}`}>
        <QuestionnaireItem name="q" multiple={multiple}>
          <QuestionnaireTitle className="sr-only">Choice</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice
              value="a"
              defaultChecked={state === "checked" || state === "disabled, checked"}
              disabled={state === "disabled" || state === "disabled, checked"}
              {...force(state)}
            >
              {label}
            </QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
      </Questionnaire>
    </div>
  )
}

const STATES = ["rest", "hover", "focus", "checked", "disabled", "disabled, checked"] as const

function Frame({ children }: { children: ReactNode }) {
  return <div className="w-full pe-2 pb-2">{children}</div>
}

export function States() {
  return (
    <Tiles>
      {STATES.map((s) => (
        <Tile key={`r-${s}`} label={`radio · ${s}`} size="lg">
          <ChoiceState state={s} />
        </Tile>
      ))}
      {STATES.map((s) => (
        <Tile key={`c-${s}`} label={`checkbox · ${s}`} size="lg">
          <ChoiceState multiple state={s} />
        </Tile>
      ))}
      <Tile label="choice · shortcut, description" size="lg">
        <Frame>
          <Questionnaire shortcuts="letters" aria-label="Shortcuts">
            <QuestionnaireItem name="q">
              <QuestionnaireTitle className="sr-only">Genre</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="a" defaultChecked>
                  Romance
                  <QuestionnaireChoiceDescription>Two leads, one umbrella.</QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
                <QuestionnaireChoice value="b">Mystery</QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
          </Questionnaire>
        </Frame>
      </Tile>
      <Tile label="item · error" size="lg">
        <Frame>
          <Questionnaire aria-label="Error">
            <QuestionnaireItem name="q" required invalid>
              <QuestionnaireTitle>How many pages?</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="16">16 pages</QuestionnaireChoice>
                <QuestionnaireChoice value="32">32 pages</QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError />
            </QuestionnaireItem>
          </Questionnaire>
        </Frame>
      </Tile>
      <Tile label="input · rest, focus" size="lg">
        <Frame>
          <Questionnaire aria-label="Input">
            <QuestionnaireItem name="q">
              <QuestionnaireTitle>Your pitch</QuestionnaireTitle>
              <QuestionnaireInput placeholder="A courier races the last ferry…" aria-label="Pitch" {...force("focus")} />
            </QuestionnaireItem>
          </Questionnaire>
        </Frame>
      </Tile>
      <Tile label="input · error" size="lg">
        <Frame>
          <Questionnaire aria-label="Input error">
            <QuestionnaireItem name="q" required invalid>
              <QuestionnaireTitle>Your pitch</QuestionnaireTitle>
              <QuestionnaireInput placeholder="A courier races the last ferry…" aria-label="Pitch" />
              <QuestionnaireError>Write one line to finish.</QuestionnaireError>
            </QuestionnaireItem>
          </Questionnaire>
        </Frame>
      </Tile>
      <Tile label="progress · 3 of 4, actions" size="full">
        <Frame>
          <Questionnaire aria-label="Progress" defaultItem="c" className="max-w-md">
            <QuestionnaireProgress />
            {["a", "b", "c", "d"].map((n) => (
              <QuestionnaireItem key={n} name={n}>
                <QuestionnaireTitle>Which tones will you lay?</QuestionnaireTitle>
                <QuestionnaireChoices>
                  <QuestionnaireChoice value="dots" defaultChecked>
                    Dot screentone
                  </QuestionnaireChoice>
                </QuestionnaireChoices>
              </QuestionnaireItem>
            ))}
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireSkip />
              <QuestionnaireNext />
            </QuestionnaireActions>
          </Questionnaire>
        </Frame>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="-my-10 w-72 scale-[0.6]">
      <Questionnaire aria-label="Plan your one-shot" defaultItem="b">
        <QuestionnaireProgress />
        <QuestionnaireItem name="a">
          <QuestionnaireTitle>Genre</QuestionnaireTitle>
        </QuestionnaireItem>
        <QuestionnaireItem name="b">
          <QuestionnaireTitle>Which genre?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="action" defaultChecked>
              Action
            </QuestionnaireChoice>
            <QuestionnaireChoice value="romance">Romance</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem name="c">
          <QuestionnaireTitle>Pages</QuestionnaireTitle>
        </QuestionnaireItem>
      </Questionnaire>
    </div>
  )
}
