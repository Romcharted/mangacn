"use client";

/*
 * Dashboard — a full interface made only with mangacn: Sidebar, Stat, toned charts (Chart), a Data Table,
 * a Command palette (Ctrl/⌘ K), Button Group, Badge, Kbd. The page fills its container: give the root
 * a height (`className="h-svh"` for a whole screen).
 */
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  BookOpen,
  ChartColumn,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/manga/badge";
import { Button } from "@/components/ui/manga/button";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  chartFill,
  type ChartConfig,
} from "@/components/ui/manga/chart";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/manga/command";
import { DataTable } from "@/components/ui/manga/data-table";
import { Kbd, KbdGroup } from "@/components/ui/manga/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/manga/sidebar";
import { ButtonGroup } from "@/components/ui/manga/button-group";
import { Stat } from "@/components/manga/stat";
import { cn } from "cn";

type Period = "7d" | "30d" | "90d";
type Chapter = {
  id: number;
  title: string;
  volume: number;
  pages: number;
  reads: number;
  status: "Out" | "Draft" | "Planned";
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const SERIES: Record<
  Period,
  { month: string; reads: number; sales: number }[]
> = {
  "7d": MONTHS.map((month, i) => ({
    month,
    reads: [42, 51, 47, 60, 58, 66][i],
    sales: [12, 15, 13, 19, 17, 21][i],
  })),
  "30d": MONTHS.map((month, i) => ({
    month,
    reads: [180, 310, 240, 175, 210, 320][i],
    sales: [80, 200, 120, 190, 130, 240][i],
  })),
  "90d": MONTHS.map((month, i) => ({
    month,
    reads: [520, 610, 700, 680, 790, 880][i],
    sales: [240, 300, 330, 310, 400, 470][i],
  })),
};
const FIGURES: Record<
  Period,
  {
    readers: string;
    delta: string;
    chapters: string;
    sales: string;
    rating: string;
  }
> = {
  "7d": {
    readers: "3.1k",
    delta: "+4%",
    chapters: "3",
    sales: "97",
    rating: "4.7",
  },
  "30d": {
    readers: "12.4k",
    delta: "+8%",
    chapters: "11",
    sales: "960",
    rating: "4.6",
  },
  "90d": {
    readers: "35.9k",
    delta: "+21%",
    chapters: "29",
    sales: "2,050",
    rating: "4.6",
  },
};

const CHAPTERS: Chapter[] = [
  ["The long night", 1, 24, 4210, "Out"],
  ["After the rain", 1, 31, 3980, "Out"],
  ["Paper lanterns", 1, 27, 3620, "Out"],
  ["Harbour", 2, 18, 2950, "Out"],
  ["The quiet road", 2, 22, 2410, "Out"],
  ["Ink on the bridge", 2, 26, 1980, "Out"],
  ["Return", 2, 35, 1210, "Draft"],
  ["Low tide", 3, 20, 0, "Draft"],
  ["Night market", 3, 0, 0, "Planned"],
  ["The ferry", 3, 0, 0, "Planned"],
].map(
  ([title, volume, pages, reads, status], i) =>
    ({ id: i + 1, title, volume, pages, reads, status }) as Chapter,
);

const columns: ColumnDef<Chapter>[] = [
  { accessorKey: "title", header: "Chapter" },
  { accessorKey: "volume", header: "Vol." },
  { accessorKey: "pages", header: "Pages" },
  {
    accessorKey: "reads",
    header: "Reads",
    cell: ({ getValue }) =>
      getValue<number>() ? getValue<number>().toLocaleString("en") : "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<Chapter["status"]>();
      return (
        <Badge
          variant={
            status === "Out"
              ? "default"
              : status === "Draft"
                ? "outline"
                : "tone"
          }
        >
          {status}
        </Badge>
      );
    },
  },
];

const config = {
  reads: { label: "Reads" },
  sales: { label: "Sales" },
} satisfies ChartConfig;
const keys = Object.keys(config);

const NAV = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Chapters", icon: BookOpen, badge: "10" },
  { label: "Readers", icon: Users },
  { label: "Sales", icon: ChartColumn },
];

export function Dashboard({ className }: { className?: string }) {
  const [period, setPeriod] = React.useState<Period>("30d");
  const [view, setView] = React.useState("Overview");
  const [palette, setPalette] = React.useState(false);
  const figures = FIGURES[period];
  const data = SERIES[period];

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPalette((open) => !open);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const go = (label: string) => {
    setView(label);
    setPalette(false);
  };

  return (
    <div
      data-manga="dashboard"
      className={cn(
        "relative h-[48rem] w-full overflow-hidden bg-background",
        className,
      )}
    >
      <SidebarProvider className="relative! h-full min-h-0! overflow-hidden">
        <Sidebar collapsible="icon" className="absolute! h-full!">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-1 py-1.5">
              <span className="grid size-8 shrink-0 place-items-center ink-fill font-sfx text-sm">
                イ
              </span>
              <span className="font-letter text-xl leading-none tracking-wide uppercase group-data-[collapsible=icon]:hidden">
                Inkwell
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Studio</SidebarGroupLabel>
              <SidebarMenu>
                {NAV.map(({ label, icon: Icon, badge }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      isActive={view === label}
                      tooltip={label}
                      onClick={() => setView(label)}
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {badge && <SidebarMenuBadge>{badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={view === "Settings"}
                  tooltip="Settings"
                  onClick={() => setView("Settings")}
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-h-0 min-w-0 overflow-auto">
          <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b-[length:var(--mg-bw)] border-border bg-background px-3 py-2">
            <SidebarTrigger />
            <h1 className="font-letter text-2xl leading-none tracking-wide uppercase">
              {view}
            </h1>
            <div className="ms-auto flex flex-wrap items-center gap-2">
              {/* Pressed buttons rather than a Toggle Group: its value API differs between Radix and Base UI. */}
              <ButtonGroup aria-label="Period">
                {(["7d", "30d", "90d"] as const).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={period === p ? "default" : "outline"}
                    aria-pressed={period === p}
                    onClick={() => setPeriod(p)}
                  >
                    {p.replace("d", " d")}
                  </Button>
                ))}
              </ButtonGroup>
              <Button
                variant="outline"
                onClick={() => setPalette(true)}
                className="gap-3"
              >
                <FileText />
                Search
                <KbdGroup className="max-sm:hidden">
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
              </Button>
            </div>
          </header>

          <div className="grid gap-5 p-4 sm:p-5">
            <section
              aria-label="Key figures"
              className="grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
              <Stat
                label="Readers"
                value={figures.readers}
                delta={figures.delta}
                trend="up"
                emphasis
              />
              <Stat
                label="Chapters out"
                value={figures.chapters}
                delta="+2"
                trend="up"
              />
              <Stat
                label="Sales"
                value={figures.sales}
                delta="+3%"
                trend="up"
              />
              <Stat
                label="Rating"
                value={figures.rating}
                delta="−0.1"
                trend="down"
              />
            </section>

            <section
              aria-label="Charts"
              className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-2"
            >
              <figure className="grid gap-2">
                <figcaption className="font-letter text-lg uppercase">
                  Reads and sales
                </figcaption>
                <ChartContainer config={config} className="[--chart-h:15rem]">
                  <BarChart data={data} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis width={36} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ stroke: "currentColor", strokeWidth: 1 }}
                    />
                    <ChartLegend
                      content={<ChartLegendContent config={config} />}
                    />
                    <Bar
                      dataKey="reads"
                      fill={chartFill("reads", keys)}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                    <Bar
                      dataKey="sales"
                      fill={chartFill("sales", keys)}
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  </BarChart>
                </ChartContainer>
              </figure>
              <figure className="grid gap-2">
                <figcaption className="font-letter text-lg uppercase">
                  Trend
                </figcaption>
                <ChartContainer config={config} className="[--chart-h:15rem]">
                  <LineChart data={data} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis width={36} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ stroke: "currentColor", strokeWidth: 1 }}
                    />
                    <ChartLegend
                      content={<ChartLegendContent config={config} />}
                    />
                    <Line
                      dataKey="reads"
                      type="monotone"
                      stroke="currentColor"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--background)" }}
                    />
                    <Line
                      dataKey="sales"
                      type="monotone"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeDasharray="8 4"
                      dot={{ r: 4, fill: "var(--foreground)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </figure>
            </section>

            <section aria-labelledby="dash-chapters" className="grid gap-2">
              <h2 id="dash-chapters" className="font-letter text-lg uppercase">
                Chapters
              </h2>
              <DataTable
                columns={columns}
                data={CHAPTERS}
                filterColumn="title"
                pageSize={5}
              />
            </section>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <CommandDialog
        open={palette}
        onOpenChange={setPalette}
        title="Search the studio"
        description="Jump to a page or run an action."
      >
        <Command>
          <CommandInput placeholder="Type a page or an action…" />
          <CommandList>
            <CommandEmpty>Nothing matches.</CommandEmpty>
            <CommandGroup heading="Go to">
              {[...NAV.map((n) => n.label), "Settings"].map((label, i) => (
                <CommandItem
                  key={label}
                  value={label}
                  onSelect={() => go(label)}
                >
                  {label}
                  <CommandShortcut>{i + 1}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Period">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <CommandItem
                  key={p}
                  value={`last ${p}`}
                  onSelect={() => (setPeriod(p), setPalette(false))}
                >
                  Last {p.replace("d", " days")}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
