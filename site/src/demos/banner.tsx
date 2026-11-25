import { Banner } from "@registry/manga/signature/banner"

export function Preview() {
  return (
    <div className="grid gap-8 py-4">
      <Banner lines>Chapter 12 is out</Banner>
      <Banner variant="paper">Season two</Banner>
      <Banner variant="accent" ends="straight">
        Last day of the sale
      </Banner>
    </div>
  )
}

export function Thumb() {
  return <Banner className="text-base">Chapter 12</Banner>
}
