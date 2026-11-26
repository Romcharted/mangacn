TOUT TERMINÉ

# Compte rendu du chat « Lecture »

Branche `feat/reader`, dossier `/home/romain/mangacn-reader`, serveur local sur 5202. Étapes 1 et 2 fusionnées dans `main` et poussées.

## Ce qui est fait (étape 1)

Dix pièces, chacune avec son fichier de registre (`registry/items/<nom>.json`), sa démo (`Preview`, `States` en tuiles figées, `Thumb`) et un commit à elle :

| Pièce | Fichier | Réutilise |
| --- | --- | --- |
| PageReader | `registry/manga/signature/page-reader.tsx` | ReaderPage (de ReaderStrip), ReadingProgress, Button |
| PageThumbnails | `page-thumbnails.tsx` | le type de page de ReaderStrip |
| ChapterEnd | `chapter-end.tsx` | Sfx, Stamp, Button |
| ReaderSettings | `reader-settings.tsx` | — (groupes de choix dessinés comme les Tabs « boxed ») |
| Shelf | `shelf.tsx` | VolumeCard, Button |
| Spoiler | `spoiler.tsx` | Button |
| RankingList | `ranking-list.tsx` | — |
| ReleaseCalendar | `release-calendar.tsx` | Stamp, gestures |
| SeriesHeader | `series-header.tsx` | Stamp, Badge, Button |
| ObiBand | `obi-band.tsx` | — |

- **PageReader** : page simple ou double (auto : double quand la scène est large et en paysage, la couverture seule), sens manga ou occidental, clic sur les bords, flèches du clavier qui suivent le sens, Page précédente / suivante, Début / Fin, balayage (la page suit le doigt sans paliers, puis tourne ou revient ; elle résiste aux deux bouts), zoom 100–300 % (boutons, + / - / 0, double clic au point visé, glisser pour se déplacer), plein écran (API Fullscreen, repli immersif fixe pour iOS), préchargement des pages voisines, vue de fin optionnelle (ChapterEnd), emplacement pour vos boutons dans la barre (réglages, vignettes). Le mode « bande » de ReaderSettings se fait avec le ReaderStrip existant (c'est ce que fait la démo).
- **Pages de démonstration** : dessinées par moi en SVG (`site/src/demos/reader-art.ts`, « Lantern Street », huit pages avec la géométrie de leurs cases prête pour GuidedView). Aucun téléchargement.
- Démo de PageReader : lecteur complet avec vignettes et réglages dans des Sheets, carton de fin après la dernière page.
- `registry/index.json` : les dix fichiers inclus ; `registry.json`, `llms.txt` et la liste du README régénérés par `npm run build`. `npm run check` : 125 items complets.

## Vérifications

- `tsc` et `npm run build` complets passent, avant et après la fusion de `main`.
- Captures à 100 %, 375 et 1280 px, clair et sombre, des dix pages d'item : Chromium et Firefox (WSL), WebKit (WebKit de Playwright sous Windows, le WebKit de WSL n'a pas ses bibliothèques système). Aucun débordement horizontal, aucune erreur de page. Je les ai toutes regardées en Chromium, et un échantillon en Firefox / WebKit.
- Parcours automatisé (Playwright) de PageReader, Shelf et Spoiler, 21 contrôles qui passent : flèches dans les deux sens, clic sur le bord, balayage, zoom, Fin / Début, carton de fin, réglages (sens, double page), saut par les vignettes, plein écran (la page et le focus restent), étagère (tirer, Échap), spoiler. Vidéo : `screenshots/reader/video/*.webm` dans le dossier de travail (non versionné).
- Installation des dix pièces depuis GitHub (`npx shadcn add Romcharted/mangacn/<pièce>`) dans 4 projets neufs (`shadcn create`, Vite et Next.js, Base UI et Radix), avec une page de test qui les utilise toutes : 19 fichiers manga posés, `tsc + vite build` et `next build` passent dans les quatre ; captures 1280 clair, 1280 sombre et 375 : aucun débordement, aucune erreur, rendu conforme (regardées).

## Ce qui a cassé et comment je l'ai réparé

- **Plein écran de PageReader recouvert par la page** : dans la vitrine, un ancêtre crée un contexte d'empilement, donc `fixed z-50` restait sous l'en-tête collant et sous les tuiles. Le lecteur passe dans un portail sur `body` en plein écran ; le focus est rendu à la scène après le déplacement, et la taille de la scène est remesurée.
- **ChapterEnd à 375 px** : « To be continued » coupé. Le mot suit maintenant la largeur du carton (requête de conteneur), le bouton « suivant » passe à la ligne.
- **RankingList à 375 px** : titres d'un mot par ligne ; le score rejoint la colonne du titre en étroit, les chiffres rétrécissent un peu. La couverture devenait blanche au survol (inversion) : elle garde son encre.
- **ChapterEnd, couverture dessinée invisible sur le bouton encré** : même correction.
- Titre des pages de démo qui débordait du dessin quand la police Impact manque : `textLength` dans le SVG.
- Fusion : conflits seulement sur `README.md` et `llms.txt` (générés) ; repris de `main` puis régénérés par le build. Un push refusé (nouveau commit de Narration), refusionné et repoussé, sans forcer.

## Règles spéciales proposées

1. **Bords de page (PageReader)** : une zone de clic invisible sur toute la hauteur ; au survol seulement, une plaque de papier avec une flèche au pinceau et l'ombre de trame apparaît au bord ; enfoncée, la plaque devient un aplat d'encre. Jamais sur écran tactile. (G3 « hover-lift » n'a pas de cadre à soulever ici.)
2. **Page tournée = G5 glissé** : la page arrive du côté d'où elle vient (`animate-slide-in`, sens inversé en lecture manga) ; le « pop » de l'image chargée est coupé dans le lecteur pour ne pas doubler.
3. **Tranche tirée (Shelf)** : l'état « choisi » d'une tranche est l'aplat d'encre plus une montée de 16 px en deux paliers (le livre sort du rang).
4. **Spoiler en ligne** : sous 24 px, pas de trame (règle C) : le texte caché est un aplat d'encre ; survol = ligne de papier à l'intérieur (`hover-thicken` en couleur papier).
5. **Fond « encre » du lecteur en sombre** : suit le négatif du kit (il devient clair). À confirmer si vous préférez un fond toujours noir.
6. **Aide de vitrine `ForceInside`** (`site/src/force-inside.tsx`) : pose `data-force` sur une partie dessinée par le composant (tranche, vignette, cellule, bord de page) pour les tuiles figées, sans élargir l'API du composant. Les sous-agents ont eu besoin, eux, d'ajouter `triggerProps` (Spoiler) et d'exporter `RankingRow`, `ReleaseRow`, `ChapterNext` pour la même raison.

## Besoins du socle

- Rien de bloquant. Une variante `group-force` n'existe pas : figer l'état d'une partie interne demande l'aide ci-dessus. Si le socle offrait une façon standard (par ex. `data-force` hérité par les `group-*`), les démos seraient plus simples.

## Ce que je n'ai pas pu vérifier

- WebKit dans WSL (bibliothèques système absentes, pas de droits root) : WebKit testé depuis Windows à la place.
- Le vrai tactile (balayage au doigt, absence de survol) : testé à la souris et par l'API pointeur seulement.
- L'API Fullscreen sur iOS Safari (repli immersif écrit comme celui du bloc Manga reader, non testé sur appareil).

## Doutes et choix faits seul

- Pages de démo dessinées par moi plutôt qu'une BD sous licence libre : pas de téléchargement, pas de question de licence, et la géométrie des cases est connue (utile pour GuidedView).
- Cinq pièces simples (Spoiler, ObiBand, RankingList, ReleaseCalendar, ChapterEnd) écrites par des sous-agents Haiku sur un cahier des charges précis, puis relues et corrigées par moi ; les cinq autres écrites par moi.
- ReaderSettings ne fait que tenir la valeur ; le mode « bande » n'est pas dans PageReader mais dans ReaderStrip (on choisit le composant selon le mode).
- La largeur des tranches (44 px minimum) rend l'étagère défilante à 375 px au-delà de six tomes : c'est voulu (rangée qui défile, pas la page).
- GuidedView dessine la page à 900 px puis la met à l'échelle : une case pleine largeur garde la taille de lettrage de la page entière (petite sur téléphone) ; le zoom est plafonné à 4×. Le pincement n'est pas géré par le composant (il reste au navigateur).
- GuidedView affiche une page à la fois : en double page, la caméra parcourt quand même les cases dans l'ordre (la géométrie d'une page `spread` les donne), mais je ne l'ai testé que sur des pages simples.
- Le site d'auteur garde l'écran courant dans son état (pas de routes) : la démo ne doit pas naviguer ; la doc dit de brancher `show()` sur un routeur.
- Le bloc Author site a ses propres dessins (copiés de mes helpers de démo, réduits), puisqu'un bloc installé ne peut pas importer la vitrine.

## Étape 2 (faite)

Signal vu à 01h25 (`REPORT-page.md` : `ÉTAPE 1 TERMINÉE`), deuxième vérification après la fin de l'étape 1.

- **GuidedView** (`registry/manga/signature/guided-view.tsx`) : lecture case par case pensée pour le téléphone. Elle lit la géométrie du modèle de page (`pageGeometry(data).panels[i].rect`, ordre de lecture, cases incrustées comprises) : une page JSON se lit guidée sans donnée en plus. Les scans marchent aussi, avec la boîte de chaque case en %. La page est dessinée une fois à largeur fixe et une « caméra » cadre la case en quatre paliers (333 ms) ; autour, un voile papier à gros points, qui s'efface pendant le trajet. Bords tapables, flèches selon le sens, Espace, Page préc./suiv., Début / Fin, balayage, bouton « Whole page » (la page entière, chaque case devient une cible, la case courante encadrée). Région live qui lit le nom de chaque case.
- **PageReader accepte les pages JSON** (`{ page: PageData }`), dessinées par `Page` (`fold="never"`) dans le même cadre qu'une page scannée ; scans et pages JSON peuvent se mélanger, les proportions viennent du format. **PageThumbnails** aussi.
- **Author site** (`registry/manga/blocks/author-site/author-site.tsx`, item `registry:block`, page `#examples/author-site` avec son code copiable) : catalogue (VolumeCard dont une sous ObiBand, ReleaseCalendar, RankingList, derniers chapitres, Shelf), fiche de série (SeriesHeader, liste des chapitres lus / à venir, Spoiler sur l'aperçu du prochain), puis lecteur « page par page » (PageReader) ou « case par case » (GuidedView), vignettes et réglages dans des Sheets, mode bande, ChapterEnd vers le chapitre suivant / la date du prochain / « The end ». Les chapitres sont des pages JSON (cases, dessins SVG faits pour le dépôt, vraies bulles, légendes, onomatopées).
- Chapitre de démo JSON pour les fiches : `site/src/demos/reader-json.ts`.

Vérifications de l'étape 2 :
- `tsc`, `npm run build`, `npm run check` (127 items) passent, avant et après la fusion de `main` (qui apportait l'éditeur de planche du chat Page).
- Captures 375 / 1280, clair / sombre, Chromium, Firefox, WebKit de GuidedView, PageReader, PageThumbnails et `#examples/author-site` : aucun débordement, aucune erreur.
- Parcours complet du site automatisé (18 contrôles, en clair à 375 puis en sombre à 375 après fusion) : catalogue → série → Continuer → fin de chapitre → case par case → page entière → saut par vignette → retour série → étagère → série terminée jusqu'à « The end ». Les 21 contrôles de l'étape 1 repassent aussi.
- Installation depuis GitHub de `author-site`, `guided-view`, `page-reader` et `page-thumbnails` dans 4 projets neufs (Vite et Next.js, Base UI et Radix), page de test avec le site complet, une GuidedView et un PageReader sur des pages JSON : 25 fichiers manga posés, `tsc + vite build` et `next build` passent dans les quatre ; captures 1280 clair / sombre et 375 sans débordement ni erreur, regardées.
- Vidéos et captures clés : dossier de notes partagé `side-session-notes/…/lecture/` (`video/`, `shots/`), hors dépôt.

Règles spéciales proposées (étape 2) :
7. **Voile de lecture guidée** : autour de la case lue, un voile papier opaque à gros points (comme le voile des overlays, mais opaque) ; il s'efface pendant le trajet de la caméra et revient sur la nouvelle case. Pas d'opacité, pas de flou.
8. **Caméra en paliers** : le passage d'une case à l'autre est un mouvement G5 en quatre paliers (333 ms) ; sans animation avec `prefers-reduced-motion`.
9. **Case courante dans la page entière** : double trait intérieur papier / encre de 6 px (on ne peut pas poser d'aplat d'encre sur un dessin) ; survol : le trait s'épaissit (3 px).
