import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsVariant } from "@registry/manga/ui/tabs"
import { force } from "../state-grid"

function Sample({ variant, vertical = false, frozen = false }: { variant: TabsVariant; vertical?: boolean; frozen?: boolean }) {
  return (
    <Tabs variant={variant} defaultValue="vol1" orientation={vertical ? "vertical" : "horizontal"}>
      <TabsList>
        <TabsTrigger value="vol1">Vol. 1</TabsTrigger>
        <TabsTrigger value="vol2" {...(frozen ? force("hover") : {})}>
          Vol. 2
        </TabsTrigger>
        <TabsTrigger value="vol3" {...(frozen ? force("focus") : {})}>
          Vol. 3
        </TabsTrigger>
        <TabsTrigger value="vol4" disabled>
          Vol. 4
        </TabsTrigger>
      </TabsList>
      <TabsContent value="vol1">Twelve chapters, one long night.</TabsContent>
      <TabsContent value="vol2">The city after the rain.</TabsContent>
      <TabsContent value="vol3">Return to the harbour.</TabsContent>
    </Tabs>
  )
}

export function Preview() {
  return <Sample variant="index" />
}

export function States() {
  return (
    <div className="space-y-8">
      <p className="text-sm">Each row: active · hover (Vol. 2) · focus (Vol. 3) · disabled (Vol. 4).</p>
      {(["index", "underline", "pills"] as const).map((v) => (
        <figure key={v} className="space-y-2">
          <figcaption className="font-mono text-xs">variant="{v}"</figcaption>
          <Sample variant={v} frozen />
        </figure>
      ))}
      <div className="grid gap-8 sm:grid-cols-3">
        {(["index", "underline", "pills"] as const).map((v) => (
          <figure key={v} className="space-y-2">
            <figcaption className="font-mono text-xs">variant="{v}" vertical</figcaption>
            <Sample variant={v} vertical />
          </figure>
        ))}
      </div>
    </div>
  )
}
