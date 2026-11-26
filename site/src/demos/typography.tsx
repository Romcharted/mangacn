import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyList,
  TypographyMuted,
  TypographyP,
  TypographySmall,
  TypographyTable,
} from "@registry/manga/ui/typography"
import { Tile, Tiles } from "../state-grid"

export function Preview() {
  return (
    <article className="max-w-prose">
      <TypographyH1 as="h2">The long night</TypographyH1>
      <TypographyLead>Three stations, one train, and a letter nobody was meant to open.</TypographyLead>
      <TypographyP>
        The harbour lamps came on one by one. Mei counted them twice, the way she counted pages before a deadline, and
        still the last one was out.
      </TypographyP>
      <TypographyBlockquote>Narration: the ferry left without her, and the sea kept the lamp lit.</TypographyBlockquote>
      <TypographyH2>Cast</TypographyH2>
      <TypographyList>
        <li>Mei, who keeps the ledger</li>
        <li>Ren, who draws the rain</li>
        <li>Sora, who was never on the boat</li>
      </TypographyList>
      <TypographyH3>Notes for the printer</TypographyH3>
      <TypographyP>
        Set the title with <TypographyInlineCode>font-letter</TypographyInlineCode> and keep the page count in the margin.
      </TypographyP>
      <TypographyH4>Small print</TypographyH4>
      <TypographySmall>Chapter 12 · 24 pages</TypographySmall>
      <TypographyMuted>Drafts are reviewed on paper before they go to the editor.</TypographyMuted>
      <TypographyLarge>Ready for the next run</TypographyLarge>
      <TypographyTable>
        <thead>
          <tr>
            <th>Chapter</th>
            <th>Pages</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The long night</td>
            <td>24</td>
          </tr>
          <tr>
            <td>After the rain</td>
            <td>31</td>
          </tr>
        </tbody>
      </TypographyTable>
    </article>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile label="h1 · lettering" size="lg">
        <TypographyH1 as="p">Title</TypographyH1>
      </Tile>
      <Tile label="h1 · sfx" size="lg">
        <TypographyH1 as="p" sfx>Boom</TypographyH1>
      </Tile>
      <Tile label="h2 · lettering" size="lg">
        <TypographyH2>Cast</TypographyH2>
      </Tile>
      <Tile label="h2 · sfx" size="lg">
        <TypographyH2 sfx>Crash</TypographyH2>
      </Tile>
      <Tile label="h3 / h4" size="lg">
        <div>
          <TypographyH3 className="mt-0">Notes</TypographyH3>
          <TypographyH4>Small print</TypographyH4>
        </div>
      </Tile>
      <Tile label="lead / p / large" size="lg">
        <div>
          <TypographyLead>Lead line.</TypographyLead>
          <TypographyP>Body text on paper.</TypographyP>
          <TypographyLarge>Large label</TypographyLarge>
        </div>
      </Tile>
      <Tile label="small / muted (never grey)" size="lg">
        <div>
          <TypographySmall>Small</TypographySmall>
          <TypographyMuted>Muted, same ink</TypographyMuted>
        </div>
      </Tile>
      <Tile label="blockquote · narration" size="lg">
        <TypographyBlockquote className="my-0">The ferry left at dawn.</TypographyBlockquote>
      </Tile>
      <Tile label="inline code" size="lg">
        <TypographyInlineCode>--mg-bw</TypographyInlineCode>
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <div className="grid gap-2 p-1">
      <TypographyH2 className="mt-0 border-b-0 pb-0 text-2xl">The long night</TypographyH2>
      <TypographyP className="mt-0 text-sm">Three stations, one train.</TypographyP>
    </div>
  )
}
