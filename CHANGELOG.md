# Changelog

All notable changes to mangacn. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/). Items install from the registry, so a version is a
state of `main`; tags mark releases.

## [Unreleased]

### Fixed

- Touch screens: small controls (Checkbox, Radio, Switch, Toggle, Button) get a 44 px hit area (`touch-hit`).

## [0.1.0] — first public release (date set on release)

The first release: the whole shadcn/ui set redrawn in ink and screentone, manga pieces, and full interfaces.
Works with Radix or Base UI, in Next.js or Vite; one command installs an item and its base.

### Added

- **Base**: tokens (ink, paper, one accent with four presets, dark mode as the negative), screentones, ink
  lines, stepped animations that stop under reduced motion, and three OFL fonts (Atkinson Hyperlegible Next,
  Patrick Hand SC, Dela Gothic One). The grammar of eight gestures (`Gestures` item) and reading order
  right to left (`Direction`).
- **Actions and input (21)**: Button, Input, Select, Checkbox, Switch, Textarea, Label, Field, Radio Group,
  Slider, Command, Toggle, Toggle Group, Button Group, Input Group, Native Select, Combobox, Input OTP,
  Calendar, Date Picker, Questionnaire.
- **Feedback (8)**: Badge, Skeleton, Toast (Sonner), Alert, Progress, Spinner, Empty, Trace.
- **Display (20)**: Card, Table, Accordion, Avatar (with a toned photo option), Separator, Bubble, Message,
  Scroll Area, Collapsible, Item, Kbd, Chart (toned fills), Data Table (cards on phones), Resizable,
  Aspect Ratio, Carousel, Attachment, Marker, Message Scroller, Code Block.
- **Navigation (6)**: Tabs, Pagination, Breadcrumb, Navigation Menu, Sidebar, Menubar.
- **Overlays (9)**: Dialog, Tooltip, Alert Dialog, Popover, Hover Card, Dropdown Menu, Sheet, Context Menu,
  Drawer.
- **Manga pieces (21)**: Speech Bubble, Screentone, Speed Lines, Panel, Sfx, Manpu, Burst, Stamp, Banner,
  Stepper, Stat, Toned Image, Character Card, Impact Counter, Versus Panel, Loading Screen, Volume Card,
  Typing Bubble, Reaction Picker, Reader Strip, Reading Progress.
- **Full interfaces (8 `registry:block`)**: Dashboard, Tasks, Landing page, AI chat, Manga reader, Developer
  portfolio, Catalog, Sign in.
- **For AI agents**: `llms.txt`, an MCP registry entry and a "Copy for AI" button on every item page.
- **Showcase**: one-line header with a command palette (Ctrl/⌘ K), live states for every component, phone
  layout designed at 375 px, cookieless and Do-Not-Track-aware visit counts, legal notice in English and French.

[Unreleased]: https://github.com/Romcharted/mangacn/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Romcharted/mangacn/releases/tag/v0.1.0
