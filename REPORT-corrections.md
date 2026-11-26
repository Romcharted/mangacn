TOUT TERMINÉ

# Compte rendu des corrections avant la sortie

Les 11 points et les trois décisions sont faits et fusionnés dans `main`. Rien n'a été fait hors du dépôt, et aucun push n'a été forcé.

Contrôles sur `main` :
- `npm run build` passe.
- `npm run check` : les 128 items sont complets.
- J'ai réinstallé depuis GitHub les items changés dans deux projets neufs : Calendar, Date Picker, Chart, Typography, Dashboard et Sign in. La page de test pose deux graphiques sur la même page, une `locale` française, `titleAs="h2"` et `as="p"`. Résultat : `tsc -b` + `vite build` passent en Vite + Base UI, `next build` passe en Next + Radix.

Pour chaque point, j'ai fait des captures à 375 et 1280 px, en clair et en sombre (Chromium), et je les ai toutes regardées.

## Décisions appliquées

| Décision | Ce qui change | Commit |
| --- | --- | --- |
| Fond du lecteur toujours noir | `PageReader` `background="ink"` : noir fixe (`oklch(0.13 0.008 60)`) dans les deux thèmes, au lieu de `--foreground`, qui devenait clair en sombre. Vérifié avec la démo en page entière. | `107997e` |
| Dates en anglais par défaut, prop `locale` | `Calendar` reçoit `enUS` par défaut. `DatePicker` et `DateRangePicker` prennent une prop `locale` (locale date-fns) pour le déclencheur et le calendrier. Sous WebKit réglé en français, le mois affiche « JAN » au lieu de « JANV. ». | `9307633` |
| Exception de SceneTransition acceptée | La règle est notée comme exception acceptée dans `AGENTS.md`. | `25d262f` |

## Les 11 points

1. **Écran de secours** (`02c8941`)
   - Le composant `site/src/load-error.tsx` affiche une case encrée avec le message « This part didn't load. » et un bouton « Reload ».
   - Il entoure chaque chargement à la demande : les pages (Grammar, Examples, Legal, Studio), les interfaces, les écrans Auth, les démos des fiches et les vignettes de la galerie (version compacte).
   - Testé en bloquant le fichier du Studio, d'Author site, de la démo Button et de Sign in. Dans les 16 cas, le secours s'affiche, et l'en-tête comme le pied de page restent en place.

2. **Serveur local** (`7f62561`)
   - `optimizeDeps.include` contient `react`, `react-dom`, `react-dom/client` et les deux `jsx-runtime`.
   - Author site et PageReader s'ouvrent sur le serveur de développement, sans erreur 5xx ni erreur de page.

3. **Planche « Last train »** (`61dbbec`)
   - La trame est plus fine (cellule de 3,5 px au lieu de 6). Les photos sont éclaircies et plus contrastées avant le tramage (courbe en S et accentuation).
   - Trois photos sont remplacées par des sujets plus simples, sous les mêmes licences Commons (`CREDITS.md` à jour) :
     - **case 1** : une horloge de gare (Penrith, CC BY-SA 4.0) à la place des toits. L'histoire suit l'heure de l'horloge : « 12:05 a.m. », départ à « 12:13 » ;
     - **case du quai** : un quai de nuit avec sa ligne blanche (Avignonet, CC BY-SA 4.0) ;
     - **dernière case** : des portes de métro qui se ferment (Toronto, CC BY-SA 3.0) à la place de l'intérieur du wagon, qui restait illisible à 375 px sous les bulles.
   - On reconnaît maintenant le sujet de chaque case d'un coup d'œil, à 375 comme à 1280 px.

4. **Studio sur grand écran** (`d08c3c5`)
   - La barre (modèle, format, annuler / rétablir) reste collée sous l'en-tête.
   - Le panneau de réglages reste collé à côté de la page, avec son propre défilement. Il ne remonte qu'une fois le bas de la page dépassé.

5. **Studio sur téléphone** (`d08c3c5`)
   - Sous 1024 px, la page reste collée en haut en taille réduite (38 % de la hauteur de l'écran).
   - Vérifié : pendant qu'on fait glisser « focus x », la page reste visible au-dessus et la case change en direct.

6. **Studio, bulles** (`d08c3c5`)
   - Les bulles des autres cases ont une poignée invisible : le premier geste sélectionne la case et déplace la bulle.
   - Testé sur « Where are you? » sans sélection préalable : elle se déplace de −36/+30 px.

7. **Auth** (`efac521`)
   - Le logo Apple officiel que tu as fourni est utilisé tel quel (`site/public/brands/apple-logo-black.png`), seulement dans la vitrine (exemple Auth et démo SocialButton).
   - Il est réglé à 20 px de haut pour peser autant que le « G » de Google.
   - Aucun logo dans les items du registre.

8. **Little Nemo** (`d1c576d`)
   - Les trois bulles de la troisième case sont replacées : deux à droite, sur les bulles d'origine du scan, et « Ta ta! » à gauche.
   - Aucun chevauchement à 375 ni à 1280 px (vérifié par mesure des boîtes).

9. **Restes du compte rendu principal**
   - **Un seul `h1` par page** :
     - les 12 blocs qui ont un titre prennent une prop `titleAs` (`"h1"` par défaut), et la vitrine leur passe `"h2"` (`529636d`, `9d9ee37`) ;
     - `TypographyH1` prend une prop `as` (`"h1"`, `"h2"` ou `"p"`), pour les spécimens (`c84a036`).
   - **Identifiants `mg-chart-*`** : un seul jeu de motifs est dessiné par page. Le premier graphique le pose ; s'il disparaît, le suivant prend le relais. L'API `chartFill()` ne change pas (`d5d8121`).
   - Audit sur les 134 routes à 1280 px, plus 5 à 375 px : un seul `h1` partout, aucun identifiant en double. Les trames des graphiques sont vérifiées en clair et en sombre.

10. **README, section « Known issues »** (`76b16cd`)
    - L'échec de `tsc -b` sur `scroll-area.tsx` en Vite + Base UI (défaut de shadcn en amont), avec deux contournements : retirer l'import `React` inutile, ou couper `noUnusedLocals`.
    - Le saut du Yonkoma `auto` à l'hydratation en Next.js, avec deux contournements : orientation fixe, ou rendu côté client avec `next/dynamic`.

11. **`NOTES-page.md` supprimé** (`dd3f9c3`).

Le commit `2b44bb4` corrige le compte rendu principal : il y a 128 items dans le README, pas 106. Le commit `8421231` régénère `registry.json` et `llms.txt`.

## Choix faits seul

- **Logo Apple en sombre** : le fichier fourni est noir. En sombre, la vitrine l'affiche en blanc avec un filtre CSS `invert`, qui change la couleur sans toucher au dessin. Apple publie son logo en noir et en blanc ; c'est noté dans `site/public/brands/README.md`. Si tu préfères le fichier blanc officiel, il suffit de l'ajouter et de remplacer le filtre.
- **`titleAs` et `as`** sont deux petites props nouvelles. Les blocs restent des pages complètes par défaut (`h1`).
- **Last train** : en plus des cases 1 et du quai, j'ai remplacé la photo du wagon, la seule qui restait illisible à 375 px.

## Ajout demandé ensuite : Little Nemo, case 7

À 375 px, la case ne pouvait pas contenir ses trois bulles. La page repliée en bande donne à une case panoramique un rapport largeur / hauteur de 1,7, et une bulle y fait au moins 9,5 rem de large. La tirade du héraut demandait à elle seule 152 × 221 px dans une case de 309 × 182 px.

- **Ajout au modèle de page** (`e8efa6b`) : deux champs facultatifs. Sans eux, rien ne change.
  - `foldRatio` sur une case : sa forme une fois la page repliée sur téléphone.
  - `fold` sur une bulle, une légende ou un SFX (et la prop `fold` de `Place`) : son autre place une fois replié. En données, `fold.pointAt` donne aussi la cible de la queue.
  - Le code exporté par le studio reprend les deux champs, sauf `fold.pointAt`, qui n'a pas d'équivalent en JSX.
- **Case 7** (`aca2cdf`) :
  - sur téléphone, la case devient haute (`foldRatio: 0.78`) : les géants parlent en haut, le héraut en dessous ;
  - à 1280 px, les deux bulles des géants sont décalées pour ne plus toucher la tirade.
- **Vérification** : aucun chevauchement dans les cases 3 et 7, à 375 et 1280 px, en clair et en sombre. Captures regardées.

## Restes repérés, non traités (hors de la demande)

- **Little Nemo, case 7, à 375 px** : quelques lettres du lettrage d'origine du scan restent visibles au bord gauche, à côté de la tirade.
- **Little Nemo, case 3** : un petit reste du lettrage d'origine du scan (« TA-TA ») dépasse sous la bulle « Success to you! ».
- **Studio** : le panneau de réglages remonte avec la fin de la page une fois qu'on a dépassé le bas de la planche. Il reste visible pendant tout le temps où la planche est à l'écran.

## Avant la mise en ligne (inchangé)

1. Le nom de domaine : remplacer `DOMAIN` dans `README.md`, `registry/index.json` et `docs/directory-*`, puis construire avec `SITE_URL=https://<domaine>/`.
2. L'identifiant Umami : `VITE_UMAMI_WEBSITE_ID` dans `.env.production.local`.
3. La confirmation de l'adresse Hostinger (procédure dans `docs/deploy.md`).
4. La demande à l'annuaire shadcn : le dossier est prêt dans `docs/`.
