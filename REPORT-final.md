# Compte rendu final — assemblage (chat « Page », étape 3)

Signal : `REPORT-lecture.md` et `REPORT-narration.md` commençaient par `TOUT TERMINÉ` dans `main` (Lecture `8ad1e04`),
vérifié par moi après le message du chat principal ; mon contrôle périodique a été arrêté là.

Captures et journaux : dossier de notes partagé `side-session-notes/…/page/step3/` (hors dépôt).

## Ce qui est fait

**Besoins du socle appliqués** (`registry/manga/base/mangacn.css`, `npm run sync`)

- Narration — volet : `animate-wipe` / `animate-wipe-out` (4 paliers, 333 ms, `clip-path`), pour une transition de
  scène sans JavaScript. SceneTransition n'a pas été réécrite (elle reste pilotée en JavaScript et marche).
- Narration — police japonaise : nouvel item optionnel `font-japanese` (Zen Kaku Gothic New, OFL,
  `@fontsource/zen-kaku-gothic-new`, variable `--font-manga-jp`). Le socle ajoute `--font-manga-jp`, puis Hiragino,
  Yu Gothic et Noto Sans CJK JP comme repli japonais des trois polices de texte. La vitrine charge la police (graisse
  400 seulement, découpée par plages Unicode).
- Narration — marge intérieure de `PanelGrid` : déjà faite à l'étape 1 (prop `padding`).
- Page — `--pu` déclarée par `@property` (`<length>`) : l'unité de page se calcule là où la page la pose ; un
  conteneur imbriqué dans une case ne la fausse plus.
- Lecture — figer une partie interne : pas de changement de socle ; l'aide `ForceInside` de la vitrine devient la façon
  standard, écrite dans `AGENTS.md`.
- Principal : aucun besoin.
- Contrôle : `base` + `font-japanese` installés dans un projet Vite neuf depuis le JSON construit : la CLI recopie
  `@property --pu`, les keyframes du volet et les piles de polices sans les abîmer, et le build passe.

**AGENTS.md**

- La règle « Nothing copied » précise ce qui est permis : des personnages inventés pour le dépôt, et les images libres
  ou du domaine public seulement avec un `CREDITS.md` à côté. Jamais une œuvre dont l'auteur refuse les dérivés
  faits par IA.
- Layout : `site/src/pages/` et `site/src/studio/`.
- Nouvelle section « Pages, narration and reading » : 18 règles décidées, prises dans les comptes rendus Page,
  Narration et Lecture. L'aide `ForceInside` est inscrite dans les règles du kit.

**Vitrine**

- Accueil : onglets Dashboard, Story landing, Author site, AI chat et un onglet « Manga page » (la planche dessinée,
  chargée à la demande), avec des liens vers le studio et la fiche Panel.
- Galerie : `font-japanese` y entre avec un échantillon « あ字 ». Les pièces de Lecture et Narration y étaient déjà.
- Exemples : cartes de toutes les interfaces (dont Story landing et Author site), trois planches, Learn Japanese ;
  lien vers le studio.
- `llms.txt`, README et `registry.json` régénérés (128 items).

**Vérifications**

- `tsc`, `npm run build` et `npm run check` (128 items) passent ; `main` construit.
- Parcours automatique de tout le site : 143 routes (accueil, Grammar, Examples, Legal, Studio, les 128 fiches, les
  10 interfaces) × 375 et 1280 px × clair et sombre × Chromium, Firefox et WebKit. Le script relève les erreurs et
  les débordements horizontaux, et enregistre les captures pleine page de 20 pages clés (240 captures).
  - Résultat : 0 débordement et 0 erreur sous Chromium et Firefox.
  - Sous WebKit, un seul échec isolé de chargement de module sur `#table` à 375 px, dû au serveur de développement
    sous la charge de trois navigateurs en parallèle. La page s'ouvre sans erreur quand on y va seule.
  - J'ai regardé un échantillon : accueil, Examples, Author site, Yonkoma, Studio, Panel, dans les trois moteurs et
    les deux thèmes.
- Réinstallation complète après la poussée sur `main` (`b17fe8e`). Dans 4 projets neufs (`shadcn create -t vite|next
  -b base|radix -p nova`), les **128 items** ont été installés en une commande depuis GitHub : 186 fichiers posés,
  dont 122 fichiers manga, version « page » de SpeechBubble bien présente. Page de test : une page JSX, un gabarit, une
  page JSON, Story landing et Author site.
  - `next build` passe en Base UI et en Radix, `tsc -b && vite build` passe en Vite + Radix.
  - **Vite + Base UI : `tsc -b` échoue** sur `src/components/ui/scroll-area.tsx`, le composant shadcn d'origine
    (`'React' is declared but its value is never read`). Reproduit dans un projet neuf **sans mangacn** avec seulement
    `shadcn add scroll-area` : c'est un défaut de shadcn en amont, pas du kit. `vite build` seul passe. Contournement :
    retirer la première ligne du fichier, ou désactiver `noUnusedLocals`.
  - Contrôle visuel des 4 projets à 1280 px, en clair et en sombre : les pages, Story landing et Author site sont
    identiques à la vitrine.

## Ce qui a cassé

- Pendant l'assemblage, rien dans `main`.
- Le premier parcours Chromium s'est arrêté sur une navigation inattendue pendant l'exécution du script (contexte
  détruit). Je l'ai rendu tolérant puis relancé : 0 problème.
- Ce qui avait cassé aux étapes 1 et 2 est dans `REPORT-page.md`.

## Ce qui reste (pour vous)

Règles proposées que je n'ai pas tranchées :

- **Fond « encre » du lecteur en sombre** (Lecture) : il suit le négatif du kit et devient clair. Faut-il un fond
  toujours noir ?
- **Langue des dates** (principal) : sous WebKit, le Date Picker suit la langue du navigateur (« JANV. »), alors que le
  reste est en anglais. Faut-il fixer la langue du kit ?
- **SceneTransition** dépasse la règle « 2 à 4 images ». Je l'ai écrite comme exception (changement de scène), à
  confirmer.

À faire :

- Hors dépôt, laissé de côté exprès : mise en ligne, adresse du site (`DOMAIN` est encore un espace réservé),
  demande à l'annuaire shadcn.
- `NOTES-page.md` (défauts de Panel, PanelGrid et SpeechBubble) est entièrement traité ; on peut le supprimer.
- La vidéo des pièces qui bougent couvre la page, le studio et les lecteurs (dossiers `page/` et `lecture/`), pas
  chaque pièce animée du kit.

## Doutes

- La police japonaise reste optionnelle (elle n'est pas installée par `base`) : elle pèse lourd. Sans elle, le texte
  japonais utilise la police du système (carrés vides sur un Linux sans police CJK).
- Le repli de `Page` sous 480 px se décide sur la largeur du conteneur. Une page dans une colonne étroite se replie
  donc aussi, sauf avec `fold="never"`.
- En Next.js, Yonkoma `auto` saute de vertical à horizontal à l'hydratation (signalé par Narration), parce que la
  structure de la page est calculée en JavaScript.
- L'export PNG du studio est un rendu Canvas séparé, proche de la page mais pas identique au pixel près.
