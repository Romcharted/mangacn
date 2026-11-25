import { Alert, AlertDescription, AlertTitle } from "@registry/manga/ui/alert"

export function Preview() {
  return (
    <div className="grid max-w-xl gap-6">
      <Alert>
        <AlertTitle>New chapter</AlertTitle>
        <AlertDescription>Chapter 12 of The long night is out.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Upload failed</AlertTitle>
        <AlertDescription>Page 15 is larger than 20 MB.</AlertDescription>
      </Alert>
    </div>
  )
}

export function Thumb() {
  return (
    <Alert variant="destructive" className="w-52 py-2">
      <AlertTitle className="text-base">Upload failed</AlertTitle>
    </Alert>
  )
}
