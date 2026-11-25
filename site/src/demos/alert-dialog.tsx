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

function Sample({ label = "Delete volume" }: { label?: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>{label}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Vol. 3?</AlertDialogTitle>
          <AlertDialogDescription>Its 18 chapters and your bookmarks go with it. This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep it</AlertDialogCancel>
          <AlertDialogAction tone="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function Preview() {
  return <Sample />
}

export function Thumb() {
  return <Sample label="Delete" />
}
