import { Checkbox } from "@registry/manga/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@registry/manga/ui/field"
import { Input } from "@registry/manga/ui/input"
import { RadioGroup, RadioGroupItem } from "@registry/manga/ui/radio-group"

export function Preview() {
  return (
    <FieldGroup className="max-w-md">
      <Field>
        <FieldLabel htmlFor="f-name">Pen name</FieldLabel>
        <Input id="f-name" defaultValue="Night owl" />
        <FieldDescription>Shown under every chapter you post.</FieldDescription>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="f-mail">Email</FieldLabel>
        <Input id="f-mail" defaultValue="owl@" aria-invalid />
        <FieldError>Add the end of your address.</FieldError>
      </Field>
      <FieldSeparator>Plan</FieldSeparator>
      <FieldSet>
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
      <Field orientation="horizontal">
        <Checkbox id="f-news" defaultChecked />
        <FieldLabel htmlFor="f-news">Send me new chapters</FieldLabel>
      </Field>
    </FieldGroup>
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
