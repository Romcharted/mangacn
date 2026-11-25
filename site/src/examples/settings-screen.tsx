import { useState } from "react"
import { Button } from "@registry/manga/ui/button"
import { Input } from "@registry/manga/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@registry/manga/ui/select"
import { Switch } from "@registry/manga/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@registry/manga/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@registry/manga/ui/tabs"

// Values are the labels, so <SelectValue /> shows the same text under Base UI and Radix.
const languages = ["English", "Français", "日本語"]

const library = [
  { title: "The long night", volume: 3, progress: "Ch. 24" },
  { title: "After the rain", volume: 1, progress: "Ch. 6" },
  { title: "Paper lanterns", volume: 7, progress: "Done" },
]

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b-[length:var(--mg-bw-fine)] border-border py-3 last:border-b-0">
      <div>
        <p className="font-letter text-lg leading-none tracking-wide uppercase">{label}</p>
        {hint && <p className="mt-1 text-sm">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export function SettingsScreen() {
  const [rtl, setRtl] = useState(true)
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h3 className="mb-4 font-letter text-3xl uppercase">Settings</h3>
      <Tabs defaultValue="reading">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="font-letter text-lg tracking-wide uppercase">Pen name</span>
              <Input defaultValue="Night owl" />
            </label>
            <label className="grid gap-1.5">
              <span className="font-letter text-lg tracking-wide uppercase">Email</span>
              <Input type="email" defaultValue="owl@" aria-invalid />
              <span className="text-sm">Add the end of your address.</span>
            </label>
          </div>
        </TabsContent>
        <TabsContent value="reading">
          <Row label="Right to left" hint="Turn pages like a printed manga.">
            <Switch checked={rtl} onCheckedChange={(on: boolean) => setRtl(on)} aria-label="Right to left" />
          </Row>
          <Row label="New chapter alerts">
            <Switch defaultChecked aria-label="New chapter alerts" />
          </Row>
          <Row label="Language">
            <Select defaultValue="English">
              <SelectTrigger aria-label="Language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>
        </TabsContent>
        <TabsContent value="library">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Series</TableHead>
                <TableHead>Vol.</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {library.map((s) => (
                <TableRow key={s.title}>
                  <TableCell>{s.title}</TableCell>
                  <TableCell>{s.volume}</TableCell>
                  <TableCell>{s.progress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  )
}
