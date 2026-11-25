# Notes for the Panel / PanelGrid / SpeechBubble rework

Defects found while building the Lot B interfaces (Landing page, Sign in). Not fixed in Lot B: these
components are being redone elsewhere.

1. **PanelGrid padding cannot be changed from outside.** `PanelGrid` always sets `p-3`, and `cn` in this kit
   does not merge classes, so `className="p-0"` does not reliably win. The Landing page cancels it with `-m-3`.
   A `padding` (or `inset`) prop would be cleaner.
2. **SpeechBubble centring and width cannot be changed from outside.** It always sets `text-center` and
   `max-w-sm`; a review quote or a long answer cannot be left-aligned or widened through `className`.
   Props (`align`, `maxWidth`) would solve it.
3. **An ink Panel has no visible frame in light mode.** On a `Panel ink`, the frame is drawn in paper, so
   against the page it shows no ink line, only a faint antialiased edge (seen on the Landing page's figures
   panel). The ink panel should keep an ink frame (or a paper gap then an ink frame) in both themes.
