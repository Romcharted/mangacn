ÉTAPE 2 TERMINÉE

# Compte rendu — chat « Page »

Branche `feat/page-model` (worktree `/home/romain/mangacn-page`, serveur local 5201). Captures, vidéos et projets
d'installation : dossier de notes partagé `side-session-notes/…/page/step1/` et `…/page/step2/` (hors dépôt) et
`/tmp/page-install` (WSL).

## Étape 2 — l'éditeur de planche (fait)

Adresse `#studio` (lien depuis Examples et depuis la fiche Panel ; une route ajoutée dans `site/src/app.tsx`, sans
toucher à l'en-tête ni à l'accueil). Fichiers : `site/src/studio/{studio.tsx, model.ts, codegen.ts, png.ts}`.

- Format (4) et gabarit (12) ; changer de gabarit garde les images et les bulles, dans l'ordre de lecture.
- Coupes : un rond pour déplacer (la somme des deux parts reste), un carré pour incliner ; à la souris, au doigt
  (cibles de 44 px) et au clavier (flèches).
- Cases : diviser côte à côte ou l'une sous l'autre (une colonne se crée si besoin), fusionner avec la suivante (dans la
  bande, ou avec la bande du dessous quand les deux sont seules), supprimer, ajouter une case incrustée ; forme, bord
  perdu, fond encre, sans cadre.
- Images : glisser un fichier sur une case ou « Add a picture… » ; l'image est lue dans le navigateur, réduite à
  1400 px en JPEG (data URL), jamais envoyée ; cadrage (point focal, zoom), trame et motif, texte alternatif.
- Lettrage : bulle, pensée, cri, chuchotement, narration, onomatopée, légende ; on déplace la bulle en la glissant
  (sa vraie boîte, mesurée sur la page), on vise avec l'anneau rouge (`pointAt`), double-clic (ou Entrée) pour écrire
  sur place ; variante, largeur, taille et inclinaison dans le panneau.
- Annuler / rétablir (boutons, Ctrl+Z, Ctrl+Y, Ctrl+Maj+Z, 80 états), sauvegarde locale automatique (localStorage ; un
  message prévient si la page est trop lourde), import d'un JSON (fichier ou collé), nouvelle page.
- Exports : JSX (code du kit, les images glissées deviennent `/images/panel-n.jpg` avec une note), JSON (copier ou
  télécharger), PNG (rendu Canvas depuis la même géométrie : cadres, images tramées en points, bulles et queues,
  onomatopées, légendes ; 1600 px par page).
- Périmètre tenu : pas de calques, pas de pinceau, pas de compte.

**Vérifications** : test Playwright qui joue 19 gestes (déplacer et incliner une coupe, annuler, rétablir, déplacer une
bulle, viser, écrire sur place, ajouter, diviser, fusionner, image depuis un fichier, gabarit, exports JSX / PNG / JSON,
import) : 19/19 sous Chromium, Firefox et WebKit à 1280 px, et à 375 px en tactile (Chromium, WebKit). Captures 375 et
1280, clair et sombre, trois moteurs. Vidéo `step2/studio.webm`. Build et `check` passent après fusion de `main`.

**Ce qui a cassé** : sous WebKit le dernier état d'un glisser n'était pas encore rendu au relâchement (la page ne
changeait pas) — il est gardé dans une référence ; le double-clic ne touchait plus la bulle quand la capture du
pointeur se faisait sur le `<svg>` — capture sur l'élément saisi ; `<select>` natif illisible sous WebKit en sombre —
`appearance-none` et chevron dessiné ; cadres de bulles en pointillés dans l'éditeur (les tirets veulent dire
« désactivé ») — trait plein.

**Choix faits seul** : l'éditeur commence sur la planche « Last train » (plutôt qu'une page vide) ; la sélection et la
queue visée sont dessinées avec la couleur d'accent (« rare highlights ») ; l'export PNG est un rendu Canvas séparé
(un SVG `foreignObject` est refusé à l'export par Safari), donc il ressemble à la page sans être identique au pixel
(bulles plus simples, trame en points ronds).

## Étape 1 — le modèle de page (fait)

**Ce qui est fait**

- `Page` remplace `PanelGrid` : format fixe (`pocket`, `magazine`, `square`, `strip` à hauteur libre, `spread` pour une
  double page), la page garde ses proportions et grandit d'un bloc. Tout l'intérieur est en unités de page
  (100 unités de large, `--pu` = `100cqw / 100`) : traits, gouttières, bulles, onomatopées, légendes.
- Mise en cases : `Tier` (bande, `height`, `slant` de la coupe du dessous), `Panel` (`width`, `slant` de la coupe
  d'après), `Column` (des bandes dans une case, pour les mises en L). Chaque coupe peut s'incliner ; la géométrie est
  calculée par droites et intersections, la gouttière reste d'épaisseur constante même inclinée. Gouttière entre bandes
  3,4 u, entre cases 1,6 u.
- Options de case : `bleed` (bord perdu), `frameless`, `inset` (incrustée sur la case précédente), `overflow`, `ink`.
  Formes : `straight`, `tilted`, `jagged` (choc), `cloud`, `memory` (bords noirs).
- 12 gabarits (`template`) : three-tiers, big-plus-two, l-shape, diagonal, four-koma, spread, grid-six, splash, inset,
  columns, shock, flashback. Les `Panel` enfants remplissent le gabarit dans l'ordre.
- `Place x y anchor` (pourcentages de la case, 9 ancres, `maxWidth`, `clip`, `rotate`) ; il remet l'élément dans la case
  s'il en sortirait (`contain`, par défaut) et prévient la bulle pour qu'elle revise sa queue.
- `SpeechBubble pointAt={{ x, y }}` : la queue s'oriente et s'allonge vers le point (toutes variantes, pensée = bulles en
  chapelet). Toute la géométrie de la bulle suit la taille de police, donc la page ; sur une page les bulles rondes
  deviennent des super-ellipses pour contenir un bloc de texte. Nouvelles props `align` et `maxWidth`.
- `PanelArt` : image cadrée (point focal `x`/`y`, `zoom`), `toned` via TonedImage avec une trame qui suit la page.
- Format JSON (`page`, type `PageData`) : même structure que le JSX, documenté dans la fiche Panel (« The page as data »)
  et dans `registry/manga/signature/page-geometry.ts` (fonctions pures : `pageGeometry`, `templatePage`, `pagePanels`).
- Lecture : ordre du code = ordre de lecture, `reading="rtl"` met les cases de droite à gauche (le texte reste
  gauche-droite), textes en vrai texte, chaque case est un `role="group"` nommé.
- Sous 480 px (largeur du conteneur) : repli en bande verticale ; une case très large grandit en hauteur (l'image se
  recadre), une case incrustée reste sur sa case hôte, le lettrage garde un plancher lisible.
- Géométrie exposée : `pageGeometry(data).panels[i].rect` (pourcentages de la page, ordre de lecture) et
  `<Page onGeometry>` — pour le chat « Lecture ».
- `PanelGrid` reste (alias) pour le code existant (blocs Auth, Landing, Portfolio, 404, Yonkoma) et devient `Page` quand
  il reçoit `page`, `template`, `format` ou des `Tier`.
- Défauts de NOTES-page.md corrigés : `PanelGrid padding` (prop), `SpeechBubble align` / `maxWidth` (props), la case
  encre garde un trait encre avec un liseré papier dans les deux thèmes.
- `Sfx` : sur une page, ses 4 tailles suivent la largeur de la page.
- Trois planches à la place de l'ancienne (Examples › « Three manga pages ») :
  1. **Lunch break**, dessinée pour le kit en SVG (Rin, carré noir, barrette, écharpe rayée ; Mochi, chat blanc à
     l'oreille noire et clochette), écrite en JSX, 7 cases dont une inclinée, une dentelée, une incrustée en nuage.
  2. **Last train**, 6 photos de Wikimedia Commons (CC0, CC BY 2.0/4.0, CC BY-SA 2.0/4.0), sans personne
     reconnaissable, tramées en direct ; écrite en JSON. Crédits : `site/public/pages/photos/CREDITS.md`.
  3. **Little Nemo in Slumberland**, 27 mai 1906, Winsor McCay, domaine public : cases découpées dans le scan, remises en
     page, dialogues retranscrits en vrai texte avec queues vers les locuteurs ; en JSON. Crédits :
     `site/public/pages/nemo/CREDITS.md`.

**Vérifications**

- `tsc`, `npm run build` et `npm run check` (125 items) passent après fusion de `main`.
- Installation dans 4 projets neufs (`shadcn create -t vite|next -b base|radix -p nova`), `panel`, `speech-bubble` et
  `sfx` depuis les JSON construits localement (le reste depuis GitHub) : les 4 builds passent, page de test contrôlée en
  clair et en sombre (Vite et Next, Base UI et Radix).
- Captures à 100 %, 375 et 1280 px, clair et sombre, Chromium + Firefox + WebKit (fiche Panel, Examples), plus
  SpeechBubble, Landing page et Yonkoma en Chromium pour la non-régression. Aucun débordement horizontal.
- Vidéo : changement de gabarit, de format, sens de lecture, repli en bande en réduisant la fenêtre.

**Ce qui a cassé et comment je l'ai réparé**

- Bulles trop étroites sur une page (marges de 2 em pensées pour une bulle isolée) : marges réduites sur une page,
  super-ellipse pour que le texte tienne.
- Bulles qui sortaient de la page au bord droit : `Place` les remet dans la case.
- Numéros invisibles dans la démo : un composant qui enveloppe `Panel` n'est pas lu par `Page` (voir règle proposée).
- Photos trop sombres une fois tramées : copies passées en gris et éclaircies (gamma), c'est noté dans les crédits.
- Débordement à 375 px dans la fiche : grilles sans `minmax(0,1fr)`.

## Règles spéciales proposées

- **Les pièces d'une page sont des enfants directs** : `Tier`, `Column` et `Panel` doivent être enfants directs de
  `Page` / `Tier` (pas enveloppés dans un composant à soi), car la page les lit pour calculer la mise en cases.
- **Tout ce qui vit dans une page se mesure en unités de page** (`--pu`, `--bubble-size`, `--sfx-*`, `--caption-size`,
  `--page-fine`) ; un composant posé sur une page le sait par `[[data-manga=page]_&]:` (sélecteur d'ancêtre plus
  spécifique qu'une classe, contrairement à `in-*`).
- **Une bulle sur une page est une super-ellipse** (exposant 3) : un ovale pur ne contient pas un bloc de plusieurs lignes.
- **Les dessins de démo peuvent être des personnages** quand ils sont créés pour le dépôt (Rin et Mochi) : la règle
  « formes abstraites ou silhouettes » d'AGENTS.md est plus stricte que la consigne de l'étape 1.

## Besoins du socle

- Rien de bloquant. Une variable `--pu` déclarée par `@property` (syntaxe `<length>`) rendrait les unités de page
  robustes même dans un conteneur imbriqué ; c'est du CSS de socle, je ne l'ai pas ajoutée.

## Ce que je n'ai pas pu vérifier

- Lecteurs d'écran réels (seulement la structure : groupes nommés, `alt`, texte réel).
- Installation depuis GitHub `main` (les tests ont utilisé les JSON construits localement pour mes 3 items).

## Doutes et choix faits seul

- **Pepper&Carrot écarté** : sa page de licence (CC BY 4.0) affiche « AI derivation prohibited ». J'ai respecté ce souhait
  et pris une planche du domaine public (Little Nemo, 1906) à la place.
- La planche Little Nemo garde ses couleurs d'origine (le kit est en encre seule ; tramer la planche la rendait illisible).
  En mode sombre les bulles passent en négatif, comme partout dans le kit.
- `pocket` = 0,66 (proche du shinsho), `magazine` = 0,71 (B5).
- Le repli se décide sur la largeur du conteneur, pas de l'écran : une page dans une colonne de moins de 480 px se replie
  aussi (`fold="never"` l'en empêche).
- Les bulles isolées gardent exactement leur aspect d'avant (les longueurs sont passées en em, calées sur les tailles
  d'origine).
