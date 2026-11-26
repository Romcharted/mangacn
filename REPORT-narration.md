TOUT TERMINÉ

# Compte rendu — chat « Narration »

Branche `feat/story` (worktree `/home/romain/mangacn-story`, serveur local 5203), fusionnée dans `main`.

## Ce qui est fait (étape 1)

Huit pièces, chacune avec son fichier `registry/items/<nom>.json`, sa démo (`Preview`, `States` en tuiles figées, `Thumb`) et un commit à elle :

| Pièce | Fichier | En bref |
| --- | --- | --- |
| Yonkoma | `signature/yonkoma.tsx` | Strip de 4 cases sur le `Panel` / `PanelGrid` actuels, API = 4 enfants (+ `title`, `labels`, `numbered`, `aspect`). `orientation` : `vertical` (défaut), `horizontal` (ordre de lecture), `auto` (colonne, puis 4 en ligne dès 40rem de conteneur). Tout ce qui touche `Panel` est isolé dans `Strip` et `Frame` pour le rebranchement. |
| DialogueBox | `signature/dialogue-box.tsx` | Case (G1), portrait carré (case intérieure), plaque de nom en aplat d'encre sur le bord haut (pop au changement de locuteur), texte qui s'écrit à 12 i/s sans reflux, bouton flèche 44 px : « tout afficher » pendant l'écriture, puis réplique suivante (flèche qui clignote en deux paliers), compteur 2 / 4, `loop`, `onEnd`, contrôlé ou non, `progress` pour figer. Réplique annoncée une fois écrite. |
| ChapterTitle | `signature/chapter-title.tsx` | Gros numéro (police SFX), libellé, titre en lettrage (vrai titre lu « Chapter 3: … »), filet 3 px, sous-titre, colonne de texte vertical contre une bande de lignes de vitesse. Papier ou encre. À 375 px le numéro passe au-dessus du titre (requête de conteneur à 32rem). `animated` : pop du numéro, filet qui pousse. |
| MagazineCover | `signature/magazine-cover.tsx` | Couverture 3:4 : titre en bandeau d'encre, numéro et date dans une case, accroches sur plaques de papier des deux côtés de l'image (une peut être l'aplat d'accent), gros titre en pied. Tailles en unités de conteneur : même rendu en vignette et pleine largeur. Statique, lien ou bouton (hover-lift, focus-ink, press). |
| SceneTransition | `signature/scene-transition.tsx` | Volet à 12 i/s : 4 images pour couvrir, une pause, 4 pour découvrir ; la scène change sous le volet. Sens de lecture (inversé en `reading="rtl"` ou `dir="rtl"`) ou vers le bas. Variantes `ink`, `tone`, `panels` (quatre cases qui tombent une par image), légende « Meanwhile… » pendant la pause. Hook `useSceneTransition()` (promesse) et composant (`playing`, `frame` pour figer). Mouvement réduit : échange immédiat. |
| Ruby | `signature/ruby.tsx` | Furigana en `<ruby>` natif avec `<rp>`, lecture par groupe ou par caractère, `over` / `under`, `reveal="hover"` pour apprendre (lecture transparente, place gardée, toujours lue à voix haute ; mot focusable, soulignement pointillé qui s'épaissit). CSS seul. |
| VerticalText | `signature/vertical-text.tsx` | Tategaki par `writing-mode` : haut en bas, colonnes de droite à gauche, quelle que soit la page. Hauteur de colonne, police lecture / lettrage / SFX, latin couché ou debout, filet fin entre colonnes, `Tcy` pour les nombres courts. |
| BilingualBubble | `signature/bilingual-bubble.tsx` | Enveloppe `SpeechBubble` sans la modifier. Les deux textes partagent une cellule de grille : la bulle garde la taille du plus long et ne saute jamais. Interrupteur à deux cellules au-dessus (aplat qui balaie, hover-thicken, impact, focus intérieur, 44 px sur téléphone), texte entrant en pop, `lang` sur chaque texte. |

**Story landing** (`blocks/story-landing/story-landing.tsx`, item `registry:block`, page `#examples/story-landing` avec install et code copiable) : barre du haut, couverture de magazine à côté d'un titre en lettrage, sommaire comme la page de contenu d'un volume, puis quatre chapitres titrés avec `ChapterTitle` : strip `Yonkoma` (4 en ligne dès 40rem), guide en `DialogueBox`, avis en bulles, appel à l'action. Sauter à un chapitre joue un `SceneTransition` (cases d'encre + « Meanwhile… ») puis donne le focus à la section ; « Start free » joue un volet d'encre et révèle l'état final avec une SFX. Produit inventé (Tsugi), dessins faits pour le dépôt.

**Learn Japanese** (`site/src/examples/learn-japanese.tsx`, section de la page Examples avec code copiable) : carte de vocabulaire, mot vertical avec furigana, interrupteur pour masquer les lectures, phrase d'exemple en bulle bilingue, cartes précédente / suivante.

Art de démo partagé : `site/src/story-art.tsx` (visages et scènes abstraits, rien de copié).

## Vérifications

- `npm run build` (sync + tsc + build vite + shadcn build) et `npm run check` (115 items complets) passent avant chaque fusion.
- Captures à 100 %, 375 et 1280 px, clair et sombre : Chromium et Firefox (Playwright dans WSL), WebKit (Playwright sous Windows, voir plus bas). 120 captures des 8 pièces, de Story landing et de la page Examples ; aucun débordement horizontal, aucune erreur console. Je les ai regardées et corrigé : titre de chapitre trop serré à 375 px (nouvelle disposition empilée), descendante du titre de couverture sur l'accroche, case numéro sur les toutes petites couvertures, chiffres d'impact qui chevauchaient le compteur de DialogueBox, phrase d'exemple qui débordait de la carte, retour à la ligne du japonais (`word-break: auto-phrase`), défilement « smooth » du site qui annulait le saut de chapitre (saut instantané sous le volet).
- Installation, après la fusion, depuis le registre GitHub (`shadcn add Romcharted/mangacn/<item>`) dans 4 projets neufs (`/tmp/story-install` sous WSL : Vite + Base UI, Vite + Radix, Next.js + Base UI, Next.js + Radix, preset Nova) : les 8 pièces et Story landing s'installent avec leurs dépendances (panel, speech-bubble, sfx, button, gestures, base). Après le correctif du socle par le chat principal (7b071b5), les quatre projets ont été recréés de zéro : installation et `npm run build` (tsc + vite build, ou next build) **passent dans les quatre**. (Au premier essai, `vite build` échouait dans les projets Vite à cause du socle, voir « Ce qui a cassé ».) Contrôle visuel : une page qui rend Ruby, VerticalText, BilingualBubble et Story landing, capturée à 375 px clair et 1280 px sombre dans les quatre projets : rendu identique à la vitrine, aucun débordement.
- Vidéo des pièces qui bougent (Chromium, 390 et 1280 px) : DialogueBox qui écrit puis avance, BilingualBubble qui bascule, ChapterTitle rejoué, les trois volets de SceneTransition puis le volet plein écran, Story landing (saut de chapitre puis « Start free »). Fichiers `narration-390.webm` et `narration-1280.webm`, avec les 120 captures, dans le dossier de notes partagé des sessions (`side-session-notes/…/narration/`), hors du dépôt.

## Ce qui a cassé et comment je l'ai réparé

- **Kanji en carrés vides dans les captures** : le Chromium de WSL n'a aucune police japonaise. J'ai relié les polices Yu Gothic de Windows dans `~/.local/share/fonts` de WSL (aucun téléchargement). Voir « Besoins du socle ».
- **WebKit ne démarre pas sous WSL** (bibliothèques système absentes, `sudo` demande un mot de passe). J'ai lancé WebKit côté Windows avec le `playwright-core` du dépôt et le WebKit 2359 déjà installé sous Windows : il fonctionne.
- **Le Yonkoma de la démo ne voyait qu'un enfant** : un fragment compte pour un seul enfant ; la démo passe un tableau de 4.
- **`cn` ne fusionne pas les classes** : `PanelGrid` (`p-3`) et `Panel` (`min-h-24`) sont neutralisés avec `p-0!` et `min-h-0!`.
- **Première vidéo** : délai dépassé sur un clic ; script refait étape par étape.
- **`vite build` cassé dans tout projet qui installe `base` (socle, réparé par le chat principal)** : la CLI shadcn transformait l'utilitaire `touch-hit` en `@media (pointer:not(:active, [data-fx])::after: coarse) { … }` et lightningcss refusait au minify. Je l'ai signalé sans toucher au socle ; le chat principal l'a corrigé (7b071b5, classe simple dans `@layer base`). J'ai intégré `main` et refait les quatre projets : tout passe.

## Règles spéciales proposées

1. **Transition d'écran (SceneTransition)** : deux gestes de 4 images (couvrir, découvrir) séparés d'une pause de 2 images, soit 10 images (833 ms). Plus long que la règle « 2 à 4 images » : c'est un changement de scène, pas un geste d'élément. Piloté image par image en JavaScript (pas de `@keyframes` dans le socle).
2. **Lecture cachée (Ruby `reveal="hover"`)** : texte transparent mais présent (place gardée, lu à voix haute), révélé au survol ou au focus ; le survol est le soulignement pointillé qui s'épaissit (variante pointillée de `hover-underline`).
3. **Plaque de nom (DialogueBox)** : aplat d'encre utilisé comme étiquette (même usage que la case « Vol. » de VolumeCard), pas comme état sélectionné.
4. **Attente du lecteur** : la flèche « continuer » clignote avec `animate-blink` (même geste que le curseur d'attente G7).
5. **Lettrage proportionnel (MagazineCover)** : tailles en unités de conteneur (`cqi`) pour qu'une pièce dessinée garde ses proportions de la vignette au plein écran.
6. **Texte superposé sans reflux (BilingualBubble)** : deux langues dans la même cellule de grille, l'autre `invisible` + `aria-hidden`.
7. **Bande de bord (ChapterTitle)** : `tone-lines` en bande étroite à côté d'une colonne de texte vertical (application de la règle A).

## Besoins du socle

- ~~`touch-hit` abîmé par la CLI shadcn~~ : réglé par le chat principal (7b071b5).
- **Une police japonaise de lecture** (OFL, par exemple Noto Sans JP ou Zen Kaku Gothic New via `@fontsource`), en item `font-*` et en repli de `--font-manga-body` / `--font-manga-letter`. Aujourd'hui seul Dela Gothic One (SFX) couvre kana et kanji ; Ruby, VerticalText et le texte d'origine des bulles s'appuient sur la police japonaise du système (Yu Gothic, Hiragino, Noto CJK). Sur un Linux sans police CJK, carrés vides.
- **Une utilité de volet dans `base`** (`animate-wipe` en `steps(4)` + `clip-path`) permettrait un SceneTransition sans JavaScript pour les images.
- **`PanelGrid` : prop de marge intérieure** (déjà noté dans NOTES-page.md) ; Yonkoma la force à 0 avec `!`.

## Ce que je n'ai pas pu vérifier

- WebKit sous Linux (testé sous Windows, avec un WebKit 2359 plus ancien que celui attendu par playwright-core 1.65).
- Lecteurs d'écran réels (seulement les attributs ARIA et la région `aria-live`), écrans tactiles réels (zones de 44 px mesurées dans le code, pas au doigt).
- Le rendu des kanji sans police japonaise système, hors captures.

## Doutes et choix faits seul

- Le volet de Story landing couvre tout l'écran (`scope="screen"`) : dans la vitrine il passe aussi sur l'en-tête du site. Choix assumé (c'est une transition de page).
- J'ai ajouté mes 8 items après `password-strength` dans `registry/index.json` et Story landing à la fin ; une entrée dans `CATALOG` de `site/src/interfaces.tsx` et une section dans `site/src/examples/index.tsx`. Aucun autre fichier du site, ni du socle.
- Le paramètre `orientation="auto"` du Yonkoma n'était pas demandé ; il sert à Story landing en grand écran.
- La couverture, la boîte de dialogue et le bloc ne dépendent pas d'Avatar : portraits dessinés en SVG dans une case carrée.

## Étape 2 — rebranchement sur le nouveau modèle de page (fait)

Signal vu à 01:21 (`REPORT-page.md` : « ÉTAPE 1 TERMINÉE »), au deuxième passage.

- **Yonkoma** est maintenant une `Page` au format `strip` (hauteur libre) : une `Tier` par case en vertical, une seule `Tier` de quatre `Panel` en ligne (ordre de lecture géré par la page, droite à gauche en `rtl`). L'API ne change pas (4 enfants, `title`, `labels`, `numbered`, `orientation`, `aspect` qui accepte aussi un nombre). Les `Panel` sont créés directement dans les `Tier` (règle « enfants directs » du chat Page) ; un enfant donné en fragment est déplié dans sa case, pour que ses `Place` (bulles avec `pointAt`, légendes, SFX) passent au-dessus du cadre comme sur toute page. Le strip se mesure : `line` et `margin` donnent un trait d'environ 3 px et `lettering` garde un lettrage lisible quelle que soit la largeur (une case de strip est une petite page). `auto` passe en ligne à 40rem comme avant ; je n'utilise pas le repli à 480 px de `Page` (`fold="never"`), le strip étant déjà vertical.
- **Story landing** : les légendes du strip sont des `PanelCaption position="free"` posées avec `Place`, plus une onomatopée `Sfx` (ドン) dans la case 4 ; l'item dépend maintenant aussi de `panel`.
- Démo Yonkoma : bulles et SFX posées avec `Place` et `pointAt`.
- Vérifications : `tsc`, `npm run build`, `npm run check` (125 items) ; captures 375 / 1280, clair et sombre, Chromium, Firefox et WebKit de la fiche Yonkoma et de Story landing ; réinstallation de `yonkoma` et `story-landing` depuis GitHub dans les quatre projets neufs, version « page » bien installée, les quatre `npm run build` passent ; contrôle visuel (Vite : strip en ligne à 1280 ; Next.js en production : strip en ligne après hydratation).
- Doute : au premier rendu serveur (Next.js), le strip `auto` est vertical tant que sa largeur n'est pas mesurée, puis passe en ligne à l'hydratation (petit saut de mise en page). Une requête de conteneur ne suffit plus, car la structure de la page (une ou quatre `Tier`) est calculée en JavaScript.
- Règle proposée : **une pièce qui pose une page dans un petit espace règle `line` et `lettering` d'après sa largeur mesurée** (les unités de page sont pensées pour une planche entière).
