Adds **@mangacn** to the registry directory.

mangacn redraws shadcn/ui in ink and screentone, like a printed manga: same components and props, new lines.

- 92 items: every shadcn component restyled as a thin wrapper over the user's own `@/components/ui/<name>`
  (Radix or Base UI), plus manga pieces (speech bubbles, panels, speed lines, SFX, screentones).
- 8 full interfaces as `registry:block` (Dashboard, Tasks, Landing page, AI chat, Manga reader, Catalog,
  Sign in, Developer portfolio).
- One accent colour, dark mode as the negative, motion in stepped frames that stops under reduced motion.
- MIT. Fonts under the SIL Open Font License.

Registry: https://mangacn.romain-sonnet.fr/r/registry.json · Site: https://mangacn.romain-sonnet.fr/ · Source: https://github.com/Romcharted/mangacn

`pnpm validate:registries` passes locally.
