"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Questionnaire as ShadcnQuestionnaire,
  QuestionnaireActions as ShadcnQuestionnaireActions,
  QuestionnaireChoice as ShadcnQuestionnaireChoice,
  QuestionnaireChoiceDescription as ShadcnQuestionnaireChoiceDescription,
  QuestionnaireChoices as ShadcnQuestionnaireChoices,
  QuestionnaireDescription as ShadcnQuestionnaireDescription,
  QuestionnaireError as ShadcnQuestionnaireError,
  QuestionnaireInput as ShadcnQuestionnaireInput,
  QuestionnaireItem as ShadcnQuestionnaireItem,
  QuestionnaireNext as ShadcnQuestionnaireNext,
  QuestionnairePrevious as ShadcnQuestionnairePrevious,
  QuestionnaireProgress as ShadcnQuestionnaireProgress,
  QuestionnaireSkip as ShadcnQuestionnaireSkip,
  QuestionnaireSubmit as ShadcnQuestionnaireSubmit,
  QuestionnaireTitle as ShadcnQuestionnaireTitle,
} from "@/components/ui/questionnaire"
import { buttonClassName, type ButtonSize, type ButtonVariant } from "@/components/ui/manga/button"
import { ImpactLines, withImpact } from "@/lib/manga/gestures"

/*
 * Grammar: the whole questionnaire is a case (G1). Progress is a 2px ink rail filled with speed lines (G7),
 * moving in steps. Each new question pops in (G5). A choice is a choice card: a 2px ink frame whose line
 * thickens on hover (G3), with the double ink / paper / ink ring when its hidden input has focus; checked,
 * a 6px ink bar grows down its start edge (G2, kit rule for choice cards), the radio diamond or the checkbox
 * square fills with ink. Shortcuts are key caps (Kbd look). Errors: accent, a "!" mark and one shake (G8).
 * Buttons use the kit look (buttonClassName) and hit on click (G4). Disabled: dashed line, tone frame.
 */

function Questionnaire({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaire>) {
  return <ShadcnQuestionnaire data-manga="questionnaire" className={cn("relative ink-case gap-5 p-4 sm:p-6", className)} {...props} />
}

/**
 * "Question 2 of 4" in lettering, then a rail filled with speed lines. The primitive keeps role="progressbar"
 * and its aria values; the rail reads them back, so it works with any number of questions.
 */
function QuestionnaireProgress({ className, children, ref, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireProgress>) {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null)
  const [step, setStep] = React.useState({ current: 0, total: 0 })

  React.useLayoutEffect(() => {
    if (!node) return
    const read = () => {
      const current = Number(node.getAttribute("aria-valuenow")) || 0
      const total = Number(node.getAttribute("aria-valuemax")) || 0
      setStep((s) => (s.current === current && s.total === total ? s : { current, total }))
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(node, { attributes: true, attributeFilter: ["aria-valuenow", "aria-valuemax"] })
    return () => observer.disconnect()
  }, [node])

  const setRefs = React.useCallback(
    (el: HTMLDivElement | null) => {
      setNode(el)
      if (typeof ref === "function") ref(el)
      else if (ref) ref.current = el
    },
    [ref],
  )

  const percent = step.total ? Math.round((step.current / step.total) * 100) : 0

  return (
    <ShadcnQuestionnaireProgress
      ref={setRefs}
      data-manga="questionnaire-progress"
      className={cn(
        "grid w-full! grid-cols-[auto_minmax(0,1fr)] items-center gap-3 font-letter text-sm! leading-none font-normal! tracking-wide text-foreground! uppercase",
        className,
      )}
      {...props}
    >
      <span>{children ?? (step.total ? `Question ${step.current} of ${step.total}` : null)}</span>
      <span aria-hidden className="block h-4 border-[length:var(--mg-bw)] border-border bg-background">
        <span
          className="block h-full fill-lines transition-[width] duration-[333ms] ease-[steps(4)]"
          style={{ width: `${percent}%` }}
        />
      </span>
    </ShadcnQuestionnaireProgress>
  )
}

function QuestionnaireItem({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireItem>) {
  // hidden items are display:none, so the pop replays each time a question shows up
  return <ShadcnQuestionnaireItem data-manga="questionnaire-item" className={cn("animate-pop", className)} {...props} />
}

function QuestionnaireTitle({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireTitle>) {
  return (
    <ShadcnQuestionnaireTitle
      data-manga="questionnaire-title"
      className={cn("font-letter text-2xl leading-tight font-normal tracking-wide text-foreground uppercase", className)}
      {...props}
    />
  )
}

function QuestionnaireDescription({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireDescription>) {
  return (
    <ShadcnQuestionnaireDescription
      data-manga="questionnaire-description"
      className={cn("mt-1.5 font-sans text-base text-foreground!", className)}
      {...props}
    />
  )
}

function QuestionnaireChoices({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireChoices>) {
  return <ShadcnQuestionnaireChoices data-manga="questionnaire-choices" className={cn("gap-2.5", className)} {...props} />
}

// The stock Choice renders its indicator, label and shortcut itself: they are styled from the row.
const choiceRow = [
  "rounded-(--radius)! border-[length:var(--mg-bw)]! border-border! bg-background! ps-4 text-base text-foreground shadow-none transition-none dark:bg-background!",
  // hover: the line thickens by 1px, inside (G3); never on a disabled row
  "not-data-[disabled]:hover-thicken",
  // focus on the hidden input: ink / paper / ink around the row (focus-ink, moved to the row)
  "has-[>input:focus-visible]:ring-0! has-[>input:focus-visible]:border-border has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-solid! has-[>input:focus-visible]:outline-ring has-[>input:focus-visible]:shadow-[0_0_0_2px_var(--ring),0_0_0_4px_var(--background)]",
  // checked: a 6px ink bar on the start edge, growing down in three steps (choice card rule)
  "data-[checked]:border-border data-[checked]:before:absolute data-[checked]:before:inset-y-0 data-[checked]:before:start-0 data-[checked]:before:w-1.5 data-[checked]:before:origin-top data-[checked]:before:bg-foreground data-[checked]:before:content-[''] data-[checked]:before:animate-bar-in [--bar-from:1_0.34] [--bar-mid:1_0.67]",
  // error: accent line
  "data-[invalid]:border-destructive!",
  // disabled: dashed line, tone frame, label on paper, not-allowed cursor
  "data-[disabled]:pointer-events-auto data-[disabled]:cursor-not-allowed data-[disabled]:border-dashed! data-[disabled]:tone-frame data-[disabled]:opacity-100! [&:is([data-disabled])>input]:cursor-not-allowed",
].join(" ")

const choiceIndicator = [
  "[&_[data-slot=questionnaire-choice-indicator]]:size-4! [&_[data-slot=questionnaire-choice-indicator]]:translate-y-0! [&_[data-slot=questionnaire-choice-indicator]]:mt-[3px] [&_[data-slot=questionnaire-choice-indicator]]:rounded-none! [&_[data-slot=questionnaire-choice-indicator]]:border-[length:var(--mg-bw)]! [&_[data-slot=questionnaire-choice-indicator]]:border-border! [&_[data-slot=questionnaire-choice-indicator]]:bg-background! [&_[data-slot=questionnaire-choice-indicator]]:text-foreground!",
  // radio: a diamond with a paper dot (kit RadioGroup)
  "data-[type=radio]:[&_[data-slot=questionnaire-choice-indicator]]:rotate-45 data-[type=radio]:[&_[data-slot=questionnaire-choice-indicator]]:ms-0.5",
  "[&_[data-slot=questionnaire-choice-indicator-dot]]:size-1.5! [&_[data-slot=questionnaire-choice-indicator-dot]]:rounded-none! [&_[data-slot=questionnaire-choice-indicator-dot]]:bg-background!",
  // checkbox: a square, the brush check draws itself (kit Checkbox)
  "data-[type=checkbox]:[&_[data-slot=questionnaire-choice-indicator]]:size-5! data-[type=checkbox]:[&_[data-slot=questionnaire-choice-indicator]]:mt-px",
  "[&_[data-slot=questionnaire-choice-indicator-check]]:size-4! [&_[data-slot=questionnaire-choice-indicator-check]]:stroke-[3.5] [&_[data-slot=questionnaire-choice-indicator-check]_path]:[stroke-dasharray:24] [&_[data-slot=questionnaire-choice-indicator-check]_path]:animate-draw [--draw-length:24]",
  // checked: the ink flat sweeps in (G2)
  "data-[checked]:[&_[data-slot=questionnaire-choice-indicator]]:bg-primary! data-[checked]:[&_[data-slot=questionnaire-choice-indicator]]:text-primary-foreground! data-[checked]:[&_[data-slot=questionnaire-choice-indicator]]:fill-in",
  // disabled: dashed, the mark stays in ink on paper
  "data-[disabled]:[&_[data-slot=questionnaire-choice-indicator]]:border-dashed! data-[disabled]:[&_[data-slot=questionnaire-choice-indicator]]:bg-background! data-[disabled]:[&_[data-slot=questionnaire-choice-indicator]]:text-foreground! data-[disabled]:[&_[data-slot=questionnaire-choice-indicator-dot]]:bg-foreground!",
  // error
  "data-[invalid]:[&_[data-slot=questionnaire-choice-indicator]]:border-destructive!",
].join(" ")

const choiceParts = [
  "[&_[data-slot=questionnaire-choice-label]]:leading-snug",
  // shortcut: a key cap (Kbd look), mono
  "[&_[data-slot=questionnaire-choice-shortcut]]:size-6! [&_[data-slot=questionnaire-choice-shortcut]]:-mt-px [&_[data-slot=questionnaire-choice-shortcut]]:translate-y-0! [&_[data-slot=questionnaire-choice-shortcut]]:rounded-(--radius)! [&_[data-slot=questionnaire-choice-shortcut]]:border-2! [&_[data-slot=questionnaire-choice-shortcut]]:border-b-[3px]! [&_[data-slot=questionnaire-choice-shortcut]]:border-border! [&_[data-slot=questionnaire-choice-shortcut]]:bg-background! [&_[data-slot=questionnaire-choice-shortcut]]:font-mono [&_[data-slot=questionnaire-choice-shortcut]]:text-xs! [&_[data-slot=questionnaire-choice-shortcut]]:font-normal! [&_[data-slot=questionnaire-choice-shortcut]]:text-foreground!",
].join(" ")

function QuestionnaireChoice({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireChoice>) {
  return (
    <ShadcnQuestionnaireChoice
      data-manga="questionnaire-choice"
      className={cn(choiceRow, choiceIndicator, choiceParts, className)}
      {...props}
    />
  )
}

function QuestionnaireChoiceDescription({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireChoiceDescription>) {
  return (
    <ShadcnQuestionnaireChoiceDescription
      data-manga="questionnaire-choice-description"
      className={cn("text-sm text-foreground!", className)}
      {...props}
    />
  )
}

function QuestionnaireInput({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireInput>) {
  return (
    <ShadcnQuestionnaireInput
      data-manga="questionnaire-input"
      className={cn(
        // the kit Input look
        "h-10! rounded-(--radius)! border-[length:var(--mg-bw)]! border-input bg-background! ps-3! pe-3! text-base! text-foreground shadow-none transition-none! md:text-base! dark:bg-background!",
        "placeholder:text-foreground! placeholder:italic",
        "focus-visible:border-ring focus-visible:ring-0! focus-visible:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        "disabled:pointer-events-auto disabled:cursor-not-allowed disabled:border-dashed disabled:bg-background! disabled:text-foreground disabled:opacity-100! disabled:tone-frame",
        "aria-invalid:border-destructive! aria-invalid:ring-0! aria-invalid:shadow-[inset_0_0_0_1px_var(--destructive)] aria-invalid:mark-error aria-invalid:pe-8!",
        "aria-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--destructive),0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireError({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireError>) {
  return (
    <ShadcnQuestionnaireError
      data-manga="questionnaire-error"
      className={cn(
        "flex animate-shake items-start gap-2 text-sm font-normal text-destructive",
        "before:grid before:size-4 before:shrink-0 before:place-items-center before:bg-destructive before:font-sfx before:text-[0.7rem] before:leading-4 before:text-primary-foreground before:content-['!']",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireActions({ className, ...props }: React.ComponentProps<typeof ShadcnQuestionnaireActions>) {
  return <ShadcnQuestionnaireActions data-manga="questionnaire-actions" className={cn("gap-3 pt-1", className)} {...props} />
}

type NavProps<T extends React.ElementType> = React.ComponentProps<T>

// Stock variant and size names, drawn with the kit look.
function kitButton(variant: unknown, size: unknown) {
  const v = String(variant)
  const s = String(size)
  const kitVariant: ButtonVariant =
    v === "default" ? "default" : v === "ghost" ? "ghost" : v === "link" ? "link" : v === "destructive" ? "destructive" : "outline"
  const kitSize: ButtonSize = s.startsWith("icon") ? "icon" : s === "sm" || s === "xs" ? "sm" : s === "lg" ? "lg" : "default"
  return buttonClassName({ variant: kitVariant, size: kitSize })
}

function QuestionnairePrevious({ className, children, onClick, variant = "outline", size = "default", ...props }: NavProps<typeof ShadcnQuestionnairePrevious>) {
  return (
    <ShadcnQuestionnairePrevious
      data-manga="questionnaire-previous"
      variant={variant}
      size={size}
      className={cn(kitButton(variant, size), className)}
      onClick={withImpact(onClick)}
      {...props}
    >
      <ImpactLines />
      {children ?? "Previous"}
    </ShadcnQuestionnairePrevious>
  )
}

function QuestionnaireSkip({ className, children, onClick, variant = "outline", size = "default", ...props }: NavProps<typeof ShadcnQuestionnaireSkip>) {
  return (
    <ShadcnQuestionnaireSkip
      data-manga="questionnaire-skip"
      variant={variant}
      size={size}
      className={cn(kitButton(variant, size), className)}
      onClick={withImpact(onClick)}
      {...props}
    >
      <ImpactLines />
      {children ?? "Skip"}
    </ShadcnQuestionnaireSkip>
  )
}

function QuestionnaireNext({ className, children, onClick, variant = "default", size = "default", ...props }: NavProps<typeof ShadcnQuestionnaireNext>) {
  return (
    <ShadcnQuestionnaireNext
      data-manga="questionnaire-next"
      variant={variant}
      size={size}
      className={cn(kitButton(variant, size), className)}
      onClick={withImpact(onClick)}
      {...props}
    >
      <ImpactLines />
      {children ?? "Next"}
    </ShadcnQuestionnaireNext>
  )
}

function QuestionnaireSubmit({ className, children, onClick, variant = "default", size = "default", ...props }: NavProps<typeof ShadcnQuestionnaireSubmit>) {
  return (
    <ShadcnQuestionnaireSubmit
      data-manga="questionnaire-submit"
      variant={variant}
      size={size}
      className={cn(kitButton(variant, size), className)}
      onClick={withImpact(onClick)}
      {...props}
    >
      <ImpactLines />
      {children ?? "Submit"}
    </ShadcnQuestionnaireSubmit>
  )
}

export {
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
}
