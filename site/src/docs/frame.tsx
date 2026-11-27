import { createContext, useContext, useEffect, useState, type ComponentType, type ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"
import { Code } from "../copy"
import { LoadBoundary } from "../load-error"
import { demoSource, snippet } from "./source"

/*
 * The Preview / Code frame of a component page, like the shadcn site: the component centred in a frame at
 * least 350px tall; the Code tab shows the function of the demo that draws it, with its imports.
 * A Playground inside the frame (preview + Controls) hands its live code to the Code tab instead.
 */

const LiveCode = createContext<((code: string) => void) | null>(null)

/** For Playground: send the code that matches the controls to the frame's Code tab. */
export function useLiveCode(code: string) {
  const set = useContext(LiveCode)
  useEffect(() => set?.(code), [set, code])
  return set !== null
}

export function ExampleFrame({
  demo,
  fn,
  Component,
  wide = false,
  label,
}: {
  /** The item whose demo file holds the function. */
  demo: string
  /** The function to show in the Code tab. */
  fn: string
  Component: ComponentType
  /** No inner padding limit: the example uses the whole width of the frame (strips, readers, tables). */
  wide?: boolean
  label: string
}) {
  const [tab, setTab] = useState("preview")
  const [live, setLive] = useState<string | null>(null)
  const [code, setCode] = useState<string | null>(null)
  useEffect(() => {
    if (tab !== "code" || live || code !== null) return
    let on = true
    void demoSource(demo).then((src) => on && setCode(snippet(src, fn)))
    return () => {
      on = false
    }
  }, [tab, live, code, demo, fn])
  return (
    <Tabs variant="underline" value={tab} onValueChange={(v) => setTab(String(v))} className="min-w-0 gap-0">
      <TabsList aria-label={`${label}: preview or code`}>
        <TabsTrigger value="preview" className="max-sm:min-h-11">
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" className="max-sm:min-h-11">
          Code
        </TabsTrigger>
      </TabsList>
      {/* kept mounted while the Code tab shows: the example keeps its state */}
      <TabsContent value="preview" keepMounted className="mt-3 min-w-0 data-[hidden]:hidden">
        <LiveCode.Provider value={setLive}>
          <Stage wide={wide}>
            <LoadBoundary resetKey={`${demo}:${fn}`}>
              <Component />
            </LoadBoundary>
          </Stage>
        </LiveCode.Provider>
      </TabsContent>
      <TabsContent value="code" className="mt-3 min-w-0">
        {live ?? code ? (
          <Code text={(live ?? code)!} />
        ) : (
          <p role="status" className="grid min-h-40 place-items-center border-ink-fine font-letter text-sm uppercase">
            Inking…
          </p>
        )}
      </TabsContent>
    </Tabs>
  )
}

/** The frame itself: centred content, 350px tall at least. */
export function Stage({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      data-demo
      data-stage
      className={`flex min-h-[350px] items-center justify-center overflow-x-auto border-ink-fine bg-background ${wide ? "p-3 sm:p-6" : "p-6 sm:p-10"}`}
    >
      <div data-stage-content className={wide ? "w-full min-w-0 [&>*]:mx-auto" : "flex w-full min-w-0 flex-col items-center"}>
        {children}
      </div>
    </div>
  )
}
