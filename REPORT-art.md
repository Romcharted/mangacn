TERMINÉ

# Compte rendu : images « Mapless » et aperçus vivants

## Ce qui a été fait

### 1. Images

- **Sources.** Les cinq images n'étaient pas dans `site/public/art/` : je n'y ai trouvé aucun PNG. J'ai utilisé les cinq images jointes au message (WebP).
- **Attribution des noms.** Je les ai rangées sans retouche dans `site/art-source/` :
  - le portrait de Suzu donne `suzu-portrait` ;
  - Suzu et Kuro sur la falaise donnent `cover-1` (tome 1) ;
  - l'Eraser debout donne `cover-2` (tome 2) ;
  - la planche du pont donne `page-1-bridge` ;
  - la planche du phare donne `page-2-lighthouse`.
  - **Doute :** l'ordre tome 1 / tome 2 des deux couvertures est mon choix. L'héroïne va sur le tome 1. Pour inverser, il suffit d'échanger les deux fichiers source et de relancer le script.
- **Conversion.** `scripts/art-images.py` (Pillow) recadre les images, puis les redimensionne en WebP à 240, 480 et 960 px (jamais plus large que la source). Aucune trame n'est ajoutée.
  - Le script écrit aussi `site/src/mapless-art.json` (tailles).
  - Résultat : 21 images, 44 fichiers, 2,2 Mo en tout.
- **Crédits.**
  - `site/public/art/CREDITS.md` : images générées par IA, série inventée, liste des sources.
  - README (section License).
  - Pied de page du site : « Demo art: Mapless, AI-generated (credits) ».
  - La règle « Nothing copied » d'AGENTS.md est réécrite : art de démo = Mapless, aucune forme simple, les items n'embarquent aucune image.
- **Aucune image dans le registre.** Les composants et les blocs reçoivent des URL en props. La vitrine leur passe les fichiers Mapless :
  - `site/src/mapless.tsx` : `Art`, `artSrc`, `artSrcSet` et les textes alternatifs ;
  - `site/src/block-art.ts` : ce que chaque bloc reçoit.

### 2. Recadrages

Les 16 recadrages tirés des planches, des couvertures et du portrait :

| Recadrage | Contenu |
| --- | --- |
| `lighthouse-night` | Le phare de nuit |
| `suzu-drawing` | Suzu qui dessine |
| `kuro-sleeping` | Kuro endormi |
| `map` | La carte, tirée du portrait (meilleure définition que la case) |
| `suzu-profile` | Suzu de profil |
| `bridge-far` | Le pont vu de loin |
| `eraser-full` | L'Eraser en pied, tiré de la couverture 2 |
| `eraser-panel` | L'Eraser, version case |
| `spear-clash` | Le choc de la lance |
| `ink-drop` | La goutte d'encre |
| `suzu-face` | Le visage de Suzu |
| `eraser-helmet` | Le heaume de l'Eraser |
| `kuro` | Kuro seul, tiré de la couverture 1 |
| `suzu-shock` | Suzu surprise, Kuro derrière |
| `suzu-full` | Suzu en pied |
| `cover-3-teaser` | L'Eraser au loin sous les étoiles : couverture du tome 3 « à paraître » |

### 3. Remplacements

Tous les dessins en formes simples ont été remplacés. Les fichiers `art.tsx`, `story-art.tsx`, `pages/lunch-art.tsx`, `pages/lunch-break.tsx` et `pages/last-train.ts` sont supprimés, ainsi que les photos tramées de `public/pages/photos`.

| Endroit | Ce qui le remplace |
| --- | --- |
| Image d'accueil | Portrait de Suzu, Kuro dans la petite case |
| Auth (5 écrans) | Prop `pictures` (une image par état : attente, erreur, réussite). Suzu change d'expression : surprise en cas d'erreur, rieuse en cas de réussite. |
| CharacterCard | Suzu et l'Eraser. **Nouvelle prop `toned`** (true par défaut) : `toned={false}` affiche une image déjà encrée sans la tramer. Documentée dans l'item. |
| Avatar | Suzu, Kuro et le heaume de l'Eraser |
| DialogueBox | Dialogue Eraser, Suzu et Kuro |
| TonedImage | `lighthouse-night`. C'est le seul endroit où une image Mapless est tramée, puisque c'est le sujet de la pièce. |
| VolumeCard, ObiBand, Shelf, SeriesHeader, MagazineCover | Couvertures des tomes 1 à 3 |
| ReaderStrip, PageReader, PageThumbnails, GuidedView | Chapitre de démo, détaillé à la section 4 |
| Catalog, Author site | Site de la seule série Mapless, détaillé à la section 5 |
| Manga reader | Prop `art` (couverture et pages) |
| Story landing | Prop `art` : couverture, visage du guide, visage du lecteur, 4 cases du yonkoma |
| Carousel, Spoiler, Ranking List, Release Calendar, Chapter End, Resizable, Aspect Ratio, Card, Versus Panel, Screentone, Yonkoma, 404 | Recadrages Mapless |
| Landing page | Prop `cover` |
| Portfolio | Prop `art` : portrait et vignettes de projets. Les quatre schémas SVG sont supprimés. |
| Studio | Démarre sur la page de démo Mapless au lieu de « Last train » |

### 4. Lecteurs

- **Chapitre de démo :** couverture du tome 1, planche du pont, planche du phare (`site/src/demos/reader-art.ts`).
- **GuidedView :** j'ai relevé à la main la boîte de chaque case, en pourcentages. Les cases en biais sont prises par leur rectangle englobant.
  - Pont : 5 cases.
  - Phare : 5 cases.
  - Couverture : une case pleine page.
- **Version « page data » (JSON) :** elle raconte le même chapitre avec les recadrages et un vrai lettrage.

### 5. Catalog et Author site

- **Catalog :** les livres de Mapless.
  - Tomes 1 et 2 parus ; tome 3 « Coming in March », couverture recadrée, dans la Wishlist.
  - Les hors-séries de la même série : Side stories, Kuro's notebook, Sketchbook.
  - Prop `covers` par livre.
- **Author site :** le site de la série.
  - Les tomes 1 et 2 en VolumeCard, le tome 3 « Coming soon » en ObiBand avec le recadrage.
  - Les sorties de la semaine, les chapitres les plus lus, l'étagère.
  - La page série, puis les chapitres page par page ou case par case.
  - Prop `art` avec `covers` et `scenes`.

### 6. Examples

- **Supprimé :** les anciennes planches de la page (Lunch break et Last train), plus le Lunch break de l'onglet « Manga page » de l'accueil.
- **À la place :** la planche du pont telle quelle, et à côté la même planche lettrée avec le kit :
  - deux légendes PanelCaption ;
  - trois SpeechBubble (dont un cri) ;
  - un Sfx « KRAK! ».
- **Le texte est réel.** Il est posé sur le ciel, les nuages et le blanc de la dernière case, et dimensionné en unités de conteneur.
- L'onglet « Manga page » de l'accueil montre la planche lettrée.

### 7. Aperçus de l'accueil

- **`inert` retiré** de Input OTP, Calendar, Date Picker, Questionnaire, Reaction Picker, Reader Settings et Shelf. Ces aperçus sont maintenant contrôlés : on tape un code, on choisit une plage ou un jour, on réagit.
- **Aperçus dessinés rendus vivants :**
  - Spoiler, Page Reader et Guided View (vrais lecteurs, réduits) ;
  - Volume Card, Ranking List et Magazine Cover ;
  - Scene Transition (le volet se joue au clic) et Ruby (lecture au survol, épinglée au clic) ;
  - Carousel (flèches et points), Drawer (compteur), Command (vraie palette), Context Menu (vrai menu au clic droit), Chart (infobulle au survol).
- **Autres aperçus figés devenus vivants**, signalés par le contrôle :
  - Toggle, Toggle Group, Button Group, Input Group, Native Select, Combobox ;
  - Trace (étape dépliable), Sidebar, Menubar (avec menus) ;
  - Attachment (retirer, puis annuler), Message Scroller, Stepper, Impact Counter, Versus Panel, Reader Strip, Chapter End ;
  - Series Header (vrai en-tête, « Read more »), Release Calendar, Password Strength (champ et jauge), Dialogue Box, Bilingual Bubble, Item, Gestures (compteur de coups), Character Card (survol), Toned Image (motif au clic).
- **Navigation :** sur ordinateur, seuls le titre et la flèche ouvrent la fiche. Le contrôle vérifie qu'aucun clic dans un aperçu ne quitte l'accueil.

### 8. Contrôles

- **`scripts/check-thumbs.mjs`** (Playwright, 1280 px). Sur chaque vignette, il essaie dans l'ordre :
  1. survol puis clic des contrôles (boutons, onglets, champs…), puis du centre ;
  2. molette vers le haut et vers le bas (sans compter un défilement de la page) ;
  3. un glisser court ;
  4. un clic droit.
- **Mesure.** Il compare des captures de l'aperçu (animations figées) et le nombre de calques ouverts. Il signale aussi tout aperçu qui quitte l'accueil.
- **Résultat final :** 114 aperçus.
  - Aucun ne quitte l'accueil.
  - 1 bouge tout seul et n'est pas jugé : Loading Screen, une pièce sans état.
  - 29 ne changent pas. Ce sont les pièces sans état : Manga base, les 4 polices, Typography, Skeleton, Alert, Spinner, Empty, Avatar, Separator, Bubble, Message, Kbd, Aspect Ratio, Marker, Panel, Sfx, Manpu, Burst, Stamp, Stat, Typing Bubble, Reading Progress, Obi Band, Yonkoma, Chapter Title, Vertical Text.
- **Commande :** `npm run dev`, puis `node scripts/check-thumbs.mjs http://127.0.0.1:5173/`.
- **Build :** `tsc`, `npm run build` (sync, typecheck, vite, shadcn build) et `npm run check` passent (128 items complets).
- **Vérification visuelle sur le build de production** : accueil, Examples, Auth, Author site, Catalog, Story landing. Aucune image cassée, aucune erreur de console.

## Ce que je n'ai pas remplacé

Ce ne sont pas des dessins de démonstration :

- **Icônes d'interface en SVG :** icônes de fichiers (ai-chat, Attachment PDF), œil de Password Strength, chevrons du studio, marques de la page Grammar, motifs de Chart.
- **Replis des blocs sans image** :
  - Manga reader : pages blanches avec leurs seuls cadres de cases, sans aucune figure.
  - Catalog, Landing page, Portfolio : boîtes de trame.
  - Auth : lignes de vitesse seules.
- **Textes d'exemple** : quelques titres inventés dans des démos de texte (Table, Collapsible, Typography : « The long night »…).
- **Cartes compactes sur téléphone** : elles gardent leur aperçu figé. Toute la carte y est un lien vers la fiche ; c'est un choix existant que je n'ai pas changé. Les aperçus vivants concernent la grille d'ordinateur.

## Doutes

- Le choix tome 1 / tome 2 des deux couvertures.
- Les boîtes de GuidedView des cases en biais sont des rectangles englobants : on voit un peu de la case voisine.
- L'aperçu de TonedImage trame une image déjà encrée. C'est voulu (c'est la démonstration du composant), mais c'est la seule exception à « ne les trame pas ».
- Pendant mes vérifications en dev, `node_modules` du worktree était un lien vers celui de `~/mangacn`. Le serveur de dev refusait donc les polices (403). Ce n'est pas un problème du dépôt : le build de production les embarque.

# Corrections (deuxième passe)

1. **Bulle « Ready? » de l'image d'accueil.** Elle est posée sur les lignes de vitesse du coin haut (côté fin de lecture ; elle passe de l'autre côté en lecture manga), hors du visage de Suzu. Sa taille suit la case (unités de conteneur) avec un plancher lisible de 0,7 rem. Vérifiée à 320, 375, 768 et 1280 px sur le build de production : le visage reste dégagé partout. Sur le plus petit téléphone, la bulle frôle les mèches de cheveux du haut, jamais le visage.
2. **Titre « MAPLESS » sur les couvertures.**
   - Nouveau composant de la vitrine, `VolumeCover` (`site/src/mapless.tsx`). Il pose l'image intacte et, par-dessus, le titre en lettrage du kit (`font-letter`, détourage `knockout`), en vrai texte. Le texte est `aria-hidden`, parce que la carte donne déjà le titre.
   - Placement : dans le ciel. Tomes 1 et 2 : centré, sous le badge « Vol. » des cartes. Tome 3 (nuit) : en haut à droite, lettres papier détourées d'encre, loin de la lance du chevalier.
   - Couleurs fixes, comme un imprimé, dans les deux thèmes.
   - Utilisé par les démos VolumeCard, Shelf, SeriesHeader (aperçu, états, vignette) et ObiBand, ainsi que par les blocs Catalog, Author site (cartes, Coming soon, étagère, en-tête), Manga reader (carte du tome) et Landing page.
   - Pour cela, les props `covers` / `cover` de ces quatre blocs acceptent maintenant un nœud React en plus d'une URL. Items mis à jour ; ils n'embarquent toujours aucune image.
3. **Pas touché.** Les pages de couverture affichées *dans* les lecteurs (PageReader, PageThumbnails, GuidedView, première page du chapitre de démo) restent l'image seule. Ce sont des images de page lues par le lecteur ; y lettrer un titre demanderait de modifier l'image. Même chose pour MagazineCover, qui a son propre titre de magazine.
4. **Contrôles.** `tsc` et le build passent ; `npm run check` aussi (128 items). Le contrôle des vignettes sur VolumeCard, Shelf et SeriesHeader réagit ; ObiBand reste une pièce sans état.
