import { Checkbox } from "@registry/manga/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@registry/manga/ui/field"
import { Input } from "@registry/manga/ui/input"
import { RadioGroup, RadioGroupItem } from "@registry/manga/ui/radio-group"
import type { Example } from "../registry"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <FieldGroup className="w-80">
      <Field>
        <FieldLabel htmlFor="f-name">Pen name</FieldLabel>
        <Input id="f-name" defaultValue="Night owl" />
        <FieldDescription>Shown under every chapter you post.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}

function WithError() {
  return (
    <FieldGroup className="w-80">
      <Field data-invalid="true">
        <FieldLabel htmlFor="f-mail">Email</FieldLabel>
        <Input id="f-mail" defaultValue="owl@" aria-invalid />
        <FieldError>Add the end of your address.</FieldError>
      </Field>
    </FieldGroup>
  )
}

function Plan() {
  return (
    <FieldSet className="w-80">
      <FieldLegend variant="label">Reading plan</FieldLegend>
      <RadioGroup defaultValue="weekly">
        {[
          { v: "weekly", t: "Weekly", d: "A chapter every Friday." },
          { v: "binge", t: "Binge", d: "Whole volumes at once." },
        ].map((o) => (
          <FieldLabel key={o.v} htmlFor={`plan-${o.v}`}>
            <Field orientation="horizontal">
              <RadioGroupItem value={o.v} id={`plan-${o.v}`} />
              <FieldContent>
                <FieldTitle>{o.t}</FieldTitle>
                <FieldDescription>{o.d}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </FieldSet>
  )
}

function Consent() {
  return (
    <FieldSet className="w-80">
      <FieldLegend variant="label">Updates</FieldLegend>
      <Field orientation="horizontal">
        <Checkbox id="f-news" defaultChecked />
        <FieldLabel htmlFor="f-news">Send me new chapters</FieldLabel>
      </Field>
    </FieldSet>
  )
}

export const examples: Example[] = [
  { fn: "WithError", title: "With an error", description: "data-invalid on the Field and aria-invalid on the input: the message gets the accent colour and a \"!\" mark.", Component: WithError },
  { fn: "Plan", title: "Choice cards", description: "A FieldLabel around a horizontal Field makes a card: checked, it gets a 6px ink bar at the start.", Component: Plan },
  { fn: "Consent", title: "A checkbox row", description: "A horizontal Field puts a Checkbox and its FieldLabel on one line, inside a FieldSet with a legend.", Component: Consent },
]

export function States() {
  return (
    <Tiles>
      <Tile label="field · rest" size="lg">
        <Field className="w-64">
          <FieldLabel htmlFor="s-rest">Pen name</FieldLabel>
          <Input id="s-rest" placeholder="Pen name" tabIndex={-1} />
        </Field>
      </Tile>
      <Tile label="field · with description" size="lg">
        <Field className="w-64">
          <FieldLabel htmlFor="s-desc">Pen name</FieldLabel>
          <Input id="s-desc" defaultValue="Night owl" tabIndex={-1} />
          <FieldDescription>Shown under every chapter you post.</FieldDescription>
        </Field>
      </Tile>
      <Tile label="field · invalid" size="lg">
        <Field data-invalid="true" className="w-64">
          <FieldLabel htmlFor="s-err">Email</FieldLabel>
          <Input id="s-err" defaultValue="owl@" aria-invalid tabIndex={-1} />
          <FieldError>Add the end of your address.</FieldError>
        </Field>
      </Tile>
      <Tile label="field · disabled" size="lg">
        <Field data-disabled="true" className="w-64">
          <FieldLabel htmlFor="s-off">Locked field</FieldLabel>
          <Input id="s-off" defaultValue="Cannot change" disabled />
        </Field>
      </Tile>
      <Tile label="choice card · checked" size="lg">
        <RadioGroup defaultValue="weekly" className="w-64">
          <FieldLabel htmlFor="s-card">
            <Field orientation="horizontal">
              <RadioGroupItem value="weekly" id="s-card" />
              <FieldContent>
                <FieldTitle>Weekly</FieldTitle>
                <FieldDescription>A chapter every Friday.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        </RadioGroup>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <Field className="w-48 gap-1.5">
      <FieldLabel htmlFor="t-mail">Email</FieldLabel>
      <Input id="t-mail" inputSize="sm" defaultValue="owl@" aria-invalid />
      <FieldError>Missing domain.</FieldError>
    </Field>
  )
}
