import { useState } from "react"
import { FileTextIcon, PlusIcon, RefreshCwIcon, XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@registry/manga/ui/attachment"
import { force, Tile, Tiles } from "../state-grid"
import { artSrc } from "../mapless"

/** A page of "Mapless", the showcase's series (AI-generated, see public/art/CREDITS.md). */
function PageArt() {
  return <img src={artSrc("page-1-bridge", 64)} alt="" className="size-full object-cover object-top" />
}

function PdfArt() {
  return (
    <svg viewBox="0 0 24 24" className="size-full" aria-hidden>
      <path d="M5 2h9l5 5v15H5z" fill="var(--background)" stroke="var(--foreground)" strokeWidth="1.5" />
      <path d="M14 2v5h5" fill="none" stroke="var(--foreground)" strokeWidth="1.5" />
      <rect x="8" y="11" width="8" height="2" fill="var(--foreground)" />
      <rect x="8" y="15" width="6" height="2" fill="var(--foreground)" />
    </svg>
  )
}

export function Preview() {
  return (
    <AttachmentGroup className="max-w-xl">
      <Attachment>
        <AttachmentTrigger aria-label="Open page-12.png" />
        <AttachmentMedia>
          <PageArt />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>page-12.png</AttachmentTitle>
          <AttachmentDescription>PNG · 2.1 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove page-12.png">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment>
        <AttachmentTrigger aria-label="Open storyboard.pdf" />
        <AttachmentMedia>
          <PdfArt />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>storyboard.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 8 pages</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Remove storyboard.pdf">
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
      <Attachment state="uploading">
        <AttachmentMedia>
          <PageArt />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>page-13.png</AttachmentTitle>
          <AttachmentDescription>Uploading 64%</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
      <Attachment state="error">
        <AttachmentMedia>
          <FileTextIcon />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>sketch-final.psd</AttachmentTitle>
          <AttachmentDescription>Upload failed: over 20 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label="Try again">
            <RefreshCwIcon />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </AttachmentGroup>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="done · rest" size="lg">
        <Attachment>
          <AttachmentTrigger aria-label="Rest" />
          <AttachmentMedia>
            <PageArt />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>page-12.png</AttachmentTitle>
            <AttachmentDescription>PNG · 2.1 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Tile>
      <Tile label="done · hover" size="lg">
        <Attachment {...force("hover")}>
          <AttachmentTrigger aria-label="Hover" />
          <AttachmentMedia>
            <PageArt />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>page-12.png</AttachmentTitle>
            <AttachmentDescription>PNG · 2.1 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Tile>
      <Tile label="done · focus" size="lg">
        <Attachment>
          <AttachmentTrigger aria-label="Focus" {...force("focus")} />
          <AttachmentMedia>
            <PageArt />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>page-12.png</AttachmentTitle>
            <AttachmentDescription>PNG · 2.1 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Tile>
      <Tile label="uploading" size="lg">
        <Attachment state="uploading">
          <AttachmentMedia>
            <PageArt />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>page-13.png</AttachmentTitle>
            <AttachmentDescription>Uploading 64%</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Tile>
      <Tile label="processing" size="lg">
        <Attachment state="processing">
          <AttachmentMedia>
            <PageArt />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>page-13.png</AttachmentTitle>
            <AttachmentDescription>Reading the page</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Tile>
      <Tile label="error" size="lg">
        <Attachment state="error">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>sketch-final.psd</AttachmentTitle>
            <AttachmentDescription>Upload failed: over 20 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Tile>
      <Tile label="idle" size="lg">
        <Attachment state="idle">
          <AttachmentMedia>
            <PlusIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Add a page</AttachmentTitle>
            <AttachmentDescription>PNG, PDF or PSD</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Tile>
      <Tile label="action · rest" size="lg">
        <Attachment>
          <AttachmentContent>
            <AttachmentTitle>storyboard.pdf</AttachmentTitle>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove rest">
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </Tile>
      <Tile label="action · hover" size="lg">
        <Attachment>
          <AttachmentContent>
            <AttachmentTitle>storyboard.pdf</AttachmentTitle>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove hover" {...force("hover")}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </Tile>
      <Tile label="action · focus" size="lg">
        <Attachment>
          <AttachmentContent>
            <AttachmentTitle>storyboard.pdf</AttachmentTitle>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove focus" {...force("focus")}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </Tile>
      <Tile label="vertical · sm · xs" size="lg">
        <div className="flex items-end gap-3">
          <Attachment orientation="vertical" size="sm">
            <AttachmentMedia>
              <PageArt />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>page-12</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
          <Attachment size="xs">
            <AttachmentMedia>
              <PdfArt />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>notes.pdf</AttachmentTitle>
            </AttachmentContent>
          </Attachment>
        </div>
      </Tile>
    </Tiles>
  )
}

/** Live: remove the file, then put it back. */
export function Thumb() {
  const [gone, setGone] = useState(false)
  if (gone)
    return (
      <button type="button" onClick={() => setGone(false)} className="h-14 w-52 cursor-pointer border-ink border-dashed font-letter text-sm uppercase hover-invert focus-ink">
        Removed · undo
      </button>
    )
  return (
    <Attachment className="w-52">
      <AttachmentMedia>
        <PageArt />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>page-12.png</AttachmentTitle>
        <AttachmentDescription>PNG · 2.1 MB</AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        <AttachmentAction aria-label="Remove page-12.png" onClick={() => setGone(true)}>
          <XIcon />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  )
}
