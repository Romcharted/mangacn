import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@registry/manga/ui/alert-dialog"
import { Button } from "@registry/manga/ui/button"
import type { Example } from "../registry"

type SampleProps = {
  label?: string
  title?: string
  body?: string
  action?: string
  cancel?: string
  tone?: "default" | "destructive"
  flash?: boolean
}

function Sample({
  label = "Delete volume",
  title = "Delete Vol. 3?",
  body = "Its 18 chapters and your bookmarks go with it. This cannot be undone.",
  action = "Delete",
  cancel = "Keep it",
  tone = "destructive",
  flash = false,
}: SampleProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant={tone === "destructive" ? "destructive" : "default"} className="min-h-11 sm:min-h-8" />}>
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent flash={flash}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{body}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel}</AlertDialogCancel>
          <AlertDialogAction tone={tone}>{action}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function Preview() {
  return <Sample />
}

function WithFlash() {
  return <Sample flash label="Delete with a flash" />
}

function Confirm() {
  return (
    <Sample
      tone="default"
      label="Leave the chapter"
      title="Leave the chapter?"
      body="Your place is saved. You can come back to page 14 at any time."
      action="Leave"
      cancel="Stay"
    />
  )
}

function Post() {
  return (
    <Sample
      tone="default"
      label="Post the chapter"
      title="Post chapter 12 now?"
      body="Readers are told straight away. You can still edit the pages for an hour after posting."
      action="Post"
      cancel="Not yet"
    />
  )
}

export const examples: Example[] = [
  { fn: "WithFlash", title: "With a flash", description: "flash draws concentration lines around the window as it opens, for a delete that cannot be undone.", Component: WithFlash },
  { fn: "Confirm", title: "A confirmation", description: "tone=\"default\" on AlertDialogAction gives the plain button for a step that is easy to reverse.", Component: Confirm },
  { fn: "Post", title: "Before posting", description: "A longer description explains the consequence; Cancel closes the window and changes nothing.", Component: Post },
]

export function States() {
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Overlays render in a portal: each one opens live. Destructive action, default action and flash, from left to right.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Sample />
        <Sample tone="default" label="Leave the chapter" title="Leave the chapter?" body="Your place is saved." action="Leave" cancel="Stay" />
        <Sample flash />
      </div>
    </div>
  )
}

export function Thumb() {
  return <Sample label="Delete" />
}
