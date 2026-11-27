import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsVariant } from "@registry/manga/ui/tabs"
import type { Example } from "../registry"
import { force } from "../state-grid"

/* Phones: each tab keeps a 44px target; from sm up the tabs keep their own height. */
const TOUCH = "min-h-11 sm:min-h-10"

function Sample({ variant, vertical = false, frozen = false }: { variant: TabsVariant; vertical?: boolean; frozen?: boolean }) {
  return (
    <div className="flex w-full justify-center">
      <Tabs variant={variant} defaultValue="vol1" orientation={vertical ? "vertical" : "horizontal"} className="w-80 max-w-full">
        <TabsList>
          <TabsTrigger value="vol1" className={TOUCH}>
            Vol. 1
          </TabsTrigger>
          <TabsTrigger value="vol2" className={TOUCH} {...(frozen ? force("hover") : {})}>
            Vol. 2
          </TabsTrigger>
          <TabsTrigger value="vol3" className={TOUCH} {...(frozen ? force("focus") : {})}>
            Vol. 3
          </TabsTrigger>
          <TabsTrigger value="vol4" className={TOUCH} disabled>
            Vol. 4
          </TabsTrigger>
        </TabsList>
        <TabsContent value="vol1">Twelve chapters, one long night.</TabsContent>
        <TabsContent value="vol2">The city after the rain.</TabsContent>
        <TabsContent value="vol3">Return to the harbour.</TabsContent>
      </Tabs>
    </div>
  )
}

export function Preview() {
  return <Sample variant="index" />
}

/** underline: one baseline, a thick bar under the active tab. */
function Underline() {
  return <Sample variant="underline" />
}

/** boxed: one frame split into cells, the active cell an ink flat. */
function Boxed() {
  return <Sample variant="boxed" />
}

/** vertical: the list runs down the side, and the up and down arrows move between tabs. */
function Vertical() {
  return <Sample variant="index" vertical />
}

export const examples: Example[] = [
  { fn: "Underline", title: "Underline", description: "variant=\"underline\" puts one baseline under the tabs and a bar under the active one.", Component: Underline },
  { fn: "Boxed", title: "Boxed", description: "variant=\"boxed\" splits one frame into cells; the active cell is an ink flat.", Component: Boxed },
  { fn: "Vertical", title: "Vertical", description: "orientation=\"vertical\" stacks the tabs on the side; disabled tabs stay dashed.", Component: Vertical },
]

export function States() {
  return (
    <div className="space-y-8">
      <p className="text-sm">Each row: active · hover (Vol. 2) · focus (Vol. 3) · disabled (Vol. 4).</p>
      {(["index", "underline", "boxed"] as const).map((v) => (
        <figure key={v} className="space-y-2">
          <figcaption className="font-mono text-xs">variant="{v}"</figcaption>
          <Sample variant={v} frozen />
        </figure>
      ))}
      <div className="grid gap-8 sm:grid-cols-3">
        {(["index", "underline", "boxed"] as const).map((v) => (
          <figure key={v} className="space-y-2">
            <figcaption className="font-mono text-xs">variant="{v}" vertical</figcaption>
            <Sample variant={v} vertical />
          </figure>
        ))}
      </div>
    </div>
  )
}

export function Thumb() {
  return (
    <Tabs variant="boxed" defaultValue="a" className="w-48">
      <TabsList>
        <TabsTrigger value="a">Vol. 1</TabsTrigger>
        <TabsTrigger value="b">Vol. 2</TabsTrigger>
      </TabsList>
      <TabsContent value="a" className="pt-2 text-sm">One long night.</TabsContent>
      <TabsContent value="b" className="pt-2 text-sm">After the rain.</TabsContent>
    </Tabs>
  )
}
