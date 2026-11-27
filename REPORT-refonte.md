TOUT TERMINÉ

# Compte rendu : refonte de la vitrine, puis corrections

Les deux étapes sont faites et fusionnées dans `main`. Rien n'a été fait hors du dépôt, aucun push n'a été forcé et aucune capture d'écran n'est livrée.

**Écart avec le mode de travail.** J'ai fait les deux étapes sur une seule branche (`refonte`) et je l'ai fusionnée une seule fois. Les défauts de l'étape 2 touchaient exactement les mêmes fichiers que la migration des fiches (aperçus, exemples, états, props). Les traiter en un seul passage évitait de repasser deux fois sur 114 démos. Le compte rendu passe donc directement à `TOUT TERMINÉ`.

## Contrôles sur `main`

- `npm run build` passe : `tsc`, Vite et `shadcn build`.
- `npm run check:items` : les 128 items sont complets.
- `npm run check:site` vérifie 150 adresses à 375 et 1280 px, sur le site construit.
  - Dernier passage complet : 4 problèmes, tous sur `/examples` à 375 px (vignette de Manga reader). Ils sont corrigés depuis : la vérification ciblée de `/examples`, `/examples/manga-reader`, `/view/manga-reader` et `/docs/components` ne trouve plus rien.
  - Le compteur de ReaderStrip est vérifié par pas de 10 px, vers le bas puis vers le haut, à 600, 900 et 1300 px de haut. Toutes les pages défilent dans l'ordre et le compteur commence à 1.
  - Les vignettes vivantes : 114 aperçus testés, aucun ne quitte la page.
- **Écran de secours.** J'ai bloqué à tour de rôle le fichier de la fiche, celui de la démo Button, celui du Studio et celui d'Examples. Dans les 4 cas, la case « This part didn't load. » s'affiche avec son bouton « Reload », et l'en-tête comme le pied de page restent en place.

## Étape 1 — La refonte

### Adresses (1.6)

- Le site utilise de vraies adresses :
  - `/` : l'accueil ;
  - `/docs` et `/docs/<page>` : les pages « Get started » ;
  - `/docs/components` : l'index des composants ;
  - `/docs/components/<nom>` : une fiche ;
  - `/examples` et `/examples/<nom>` : les exemples ;
  - `/view/<nom>` : une interface seule ;
  - `/studio` et `/legal`.
- Le routeur (`site/src/router.ts`) intercepte les clics sur les liens du site, si bien qu'aucune page ne se recharge. Les boutons précédent et suivant du navigateur marchent.
- **Hébergement statique.** Le `.htaccess` envoie vers `index.html` toute adresse sans extension qui n'est pas un fichier. Un fichier absent, comme `r/x.json` ou `art/x.webp`, répond toujours 404. C'est décrit dans `docs/deploy.md`. Rien ne bloque sur Hostinger : je n'ai donc pas eu besoin du repli en `#/docs/...`.
- **Anciennes adresses.** Une adresse comme `/#button`, `/#grammar`, `/#examples/dashboard`, `/#sign-in` ou `/#studio` est remplacée par la nouvelle avant le premier affichage. C'est vérifié par `check:site`.
- **Changement de déploiement.** `BASE_PATH` vaut maintenant `/` par défaut. Avant, c'était `./`, ce qui ne marche pas avec des adresses à plusieurs niveaux. Pour un dossier, mets `BASE_PATH=/mangacn/`.
- Liens mis à jour :
  - README : Grammar et Examples ;
  - `llms.txt` : une ligne « Docs » pour chaque item, qui pointe vers sa fiche ou son exemple ;
  - captures et scripts de contrôle.

  `registry/index.json`, `docs/directory-*` et les balises de partage ne pointent que vers la racine, `llms.txt` et `r/` : ces adresses n'ont pas changé.

### En-tête (1.1)

- Sur grand écran, de gauche à droite :
  - le logo ;
  - Docs, Components, Examples, Studio ;
  - la recherche (Ctrl K ou /) ;
  - AI ;
  - GitHub avec le nombre d'étoiles, lu une fois par visite dans l'API publique de GitHub. Si l'API ne répond pas, le nombre ne s'affiche pas ;
  - Display.
- Sur téléphone : le logo, la recherche et Menu. Menu ouvre un Sheet qui contient tout :
  - les 4 sections ;
  - l'arbre complet de la documentation, avec son filtre ;
  - Display ;
  - le guide IA ;
  - GitHub et les mentions légales.
- La palette de recherche couvre les pages « Get started », les 10 exemples et chaque composant, classé par famille.

### Accueil (1.2)

1. Le titre, la phrase, la commande d'installation et l'image de Suzu avec « HIT ME ». J'ai ajouté deux boutons, « Get started » et « Browse components ».
2. Une rangée d'onglets avec les **dix** interfaces. Elle défile de côté si l'écran est étroit. L'interface choisie se charge à la demande, avec deux liens : « Open full screen » (`/view/<nom>`) et « View code » (`/examples/<nom>#code`).
3. **Un mur de 13 cartes vivantes**, chargé quand on approche, avec une colonne sur téléphone et jusqu'à trois sur grand écran :
   - connexion (champs et boutons sociaux) ;
   - bulle de dialogue à 5 variantes ;
   - chiffres clés et graphique ;
   - conversation avec bulle qui s'écrit ;
   - calendrier de sortie ;
   - réactions ;
   - réglages (Switch, Select, Slider) ;
   - tome avec bandeau ;
   - mini lecteur page à page ;
   - palette de commandes ;
   - réglages du lecteur ;
   - Spoiler ;
   - boîte de dialogue de personnage.

   Chaque carte a un lien discret vers la fiche de son composant principal.
4. La bande « 128 pieces » : 13 familles avec leur nombre de pièces. Chacune mène à sa section de `/docs/components`, et les interfaces mènent à `/examples`.
5. Le pied de page, inchangé.

### Documentation (1.3)

- **Trois colonnes sur grand écran.**
  - À gauche, une colonne collante avec son propre défilement et un champ de filtre. Elle garde sa position quand on change de page, car elle n'est pas redessinée. La page courante est en aplat d'encre.
  - Au centre, le contenu, limité à 48 rem.
  - À droite, « On this page », collant. La section marquée est la dernière dont le titre a passé le tiers de l'écran.
- **Groupes de la colonne de gauche.**
  - Get started : Introduction, Installation, Grammar, Theming and accent, Fonts, Reading direction, For AI, Changelog (rendu depuis `CHANGELOG.md`).
  - Components : Actions and input, Feedback, Overlays, Navigation, Display, puis **Foundations**. Ce groupe n'est pas dans le brief : il accueille Base, Direction, Gestures, Typography et les 4 polices, qui n'avaient pas d'autre place.
  - Manga, en 5 familles : Page and panels (9), Lettering (8), Readers (8), Catalogue (9) et Story (8). C'est ma répartition, définie dans `site/src/docs/nav.ts`.
  - Examples : les dix interfaces.
- Précédent et suivant en bas de chaque page.
- **Sur téléphone :** une seule colonne. La navigation est dans le Sheet de Menu, et le sommaire devient un menu repliable en haut de page.
- `/docs/components` reprend l'ancienne galerie de l'accueil : les cartes vivantes, rangées par famille, avec des filtres. Un filtre est aussi l'ancre de l'adresse, par exemple `/docs/components#overlays`.

### Gabarit d'une fiche (1.4)

- Une seule page qui défile :
  1. fil d'Ariane, titre, phrase et, pour une reprise de shadcn, le lien vers sa page d'origine ;
  2. le cadre Preview / Code ;
  3. Installation ;
  4. Usage ;
  5. Examples, une sous-section titrée et décrite par exemple, chacune avec son cadre Preview / Code ;
  6. States ;
  7. API reference ;
  8. précédent et suivant.
- **Le cadre Preview / Code.** Le composant est centré, sur 350 px de haut au moins. L'onglet Code montre automatiquement la fonction de la démo, avec ses imports et ses fonctions utilitaires, aux chemins qu'aura l'utilisateur. Quand un exemple a un panneau Controls (Playground), les réglages sont à droite de l'aperçu et l'onglet Code suit les réglages.
- **Installation.**
  - CLI : choix entre pnpm, npm, yarn et bun (mémorisé), et bouton Copy for AI.
  - Manual : le composant shadcn d'origine, les dépendances, les pièces mangacn requises (avec leurs liens) et chaque fichier source, affiché à la demande.
- **Fiches pilotes**, écrites par moi : Button, Dialog et VolumeCard. Les 111 autres ont été migrées par 9 sous-agents (Haiku), un par famille de la colonne de gauche. Je les ai relues par les scripts de contrôle, plus des vérifications à l'œil sur une partie seulement. Je n'ai pas regardé chaque fiche une par une.
- **Polices.** Les 4 polices n'avaient ni démo, ni Usage, ni props. Elles ont maintenant leur fiche, écrite par moi.

### Examples (1.5)

- **La page d'index.** Elle a une carte par interface : vignette, nom et phrase. La vignette montre le haut de l'interface à taille réelle, et non toute la page réduite. Les compositions qui étaient déjà sur la page restent en dessous, sous « More compositions » : planche lettrée, réglages, conversation, japonais, 404.
- **La page d'une interface.** Elle donne la commande d'installation, puis l'interface **sur toute la largeur et toute la hauteur**, sans cadre à défilement interne, puis la section Code.
- **La vue seule.** `/view/<nom>` montre l'interface sans l'en-tête du site.

### Solidité (1.7)

- L'écran de secours entoure chaque partie chargée à la demande : pages, fiches, démos, interfaces et mur de l'accueil. Le test est en haut de ce compte rendu.
- `npm run review` construit le site, puis le sert sur le port 5198. C'est documenté dans le README.
- `react-dom` était déjà dans `optimizeDeps.include`.

## Étape 2 — Les corrections

### 2.1 Défauts qui touchent beaucoup de fiches

| # | Défaut | Ce qui est fait |
| --- | --- | --- |
| 1 | Aperçu collé à gauche | Le cadre centre son contenu. Le contrôle 5 ne trouve plus aucun aperçu décentré. |
| 2 | Fiches trop maigres | Toute fiche interactive a au moins 3 exemples nommés, et les pièces purement visuelles (Separator, Skeleton, Spinner…) au moins 2. Le contrôle 6 ne trouve aucune fiche en défaut. |
| 3 | Pas de tableau de props | Les fiches de la liste sont complétées. Progress et Hover Card n'ajoutent aucune prop à shadcn : leur fiche le dit et renvoie à la documentation de shadcn. |
| 4 | Pas de section States | Toutes les fiches ont leur grille d'états. |
| 5 | Images agrandies | Plus aucune n'est agrandie (contrôle 3). Le détail est sous ce tableau. |
| 6 | Texte illisible | Le contrôle 4 ne trouve plus aucun texte visible sous 10 px. Le détail est sous ce tableau. |
| 7 | Zones tactiles sous 44 px | Toutes les zones signalées sont corrigées. Le détail est sous ce tableau. |
| 8 | Combobox sans nom accessible | Chaque bouton de la démo a un nom : déclencheur, retrait d'une puce. Le bouton d'effacement, qui n'en avait pas, est retiré des démos. |
| 9 | Débordement des fiches Base et Tabs | Le contrôle 2 ne trouve plus aucun débordement, à 375 comme à 1280 px. J'ai aussi corrigé un débordement du nouveau gabarit : des grilles sans colonne `minmax(0,1fr)`. |
| 10 | Scroll area sur téléphone | Le contenu de 28 rem est remplacé par un cadre `max-w-full`. |

**2.1.5 Images agrandies.**
- GuidedView : la caméra s'arrête à la taille réelle de l'image.
- La page JSON du chapitre, partagée par le lecteur et le Studio, utilise des images assez grandes. Le Studio n'agrandit donc plus son image par défaut.
- Author site : colonnes des tomes limitées à 16 rem.
- Auth : images de repos assez grandes.
- Portfolio, Panel et Yonkoma : tailles revues.

**2.1.6 Texte illisible.**
- Le lettrage du modèle de page a un plancher de 10 px quand la page est affichée en petit. GuidedView relève ce plancher selon son zoom.
- MagazineCover et les titres de couverture ont aussi un plancher de 10 px.
- Les vignettes n'utilisent plus `zoom`.

**2.1.7 Zones tactiles.**
- Barres d'options et curseurs des Playground.
- Liens du fil d'Ariane, déclencheurs de Collapsible, boutons et filtre de Data Table.
- Boutons et champ de recherche du Sidebar, champ du Combobox, lien du Spoiler.

Les cases à cocher et les interrupteurs gardent leur zone de 44 px sur écran tactile, grâce à `touch-hit`. J'ai mesuré à part, sur les fiches citées : ce n'est pas dans `npm run check`.

### 2.2 Défauts par page

1. **Yonkoma.** `site/public/art/yonkoma-cake.png` **n'existe pas** : le gag du gâteau n'est pas fait.
   - J'ai gardé les images actuelles sans les agrandir : les cases ne dépassent jamais la taille de leur image.
   - La fiche montre le strip en ligne, puis trois exemples : la colonne, les cases carrées, sans numéros.
   - Il suffit d'ajouter l'image pour que le gag puisse être fait.
2. **Story landing.** Le strip du chapitre 01 dessine maintenant ce que disent ses légendes, en encre et sans image :
   - une page avec un objectif écrit ;
   - une case cochée au pinceau ;
   - une case barrée ;
   - sept cases cochées sous un éclat.

   La prop `art.beats` reste possible pour mettre ses propres images.
3. **ReaderStrip et Manga reader.**
   - La règle du compteur (ligne au tiers de l'écran) et les pages entières de ReaderStrip étaient déjà faites par l'autre session ; je l'ai vérifié avec `check-reading`.
   - J'ai ajouté les vraies pages entières à **Manga reader** : couverture du tome 1, planche du pont, planche du phare, puis le chapitre répété.
   - Le compteur d'Author site suit la même règle.
4. **Planche lettrée d'Examples.**
   - « Nothing new gets drawn here. » est dans le ciel, à gauche de l'Eraser, la queue vers lui.
   - « Turn back, cartographer. » est dans le ciel de la case 2, sans dépasser 46 %.
   - « KURO, BACK! » est un cri sur une ligne, en haut de la case 3, entre 52 et 90 %.
   - « …drip. » tient dans le cadre de la case incrustée.
   - Le lettrage garde 10 px au minimum.
5. **Magazine cover.** Les accroches sont sur le côté calme des couvertures : ciel, pont, rochers. Elles ne couvrent plus ni Suzu, ni Kuro, ni l'Eraser. J'ai raccourci une accroche qui touchait le casque.
6. **Panel.**
   - L'aperçu principal remplit ses cases avec les images de Mapless.
   - Les numéros de lecture s'affichent avec l'option « show the reading order ».
   - La vignette est aussi une page remplie.
7. **Vignettes.** Celles de la liste du brief, et toutes celles qui utilisaient `zoom`, montrent maintenant un détail lisible à taille réelle, recadré :
   - Page Reader, Guided View, Series Header, Character Card, Shelf, Loading Screen ;
   - Calendar, Date Picker, Slider (avec étiquette et valeur), Panel, Yonkoma ;
   - Command, Dialogue Box, Questionnaire, Ranking List, Release Calendar, Versus Panel.
8. **Portfolio.** Le développeur fictif n'a plus le visage de Suzu : il est représenté par ses initiales « NK » dans une case.
9. **Studio.**
   - La barre et les réglages collants sur grand écran, la page collante sur téléphone et le déplacement d'une bulle dès le premier geste étaient faits (voir `REPORT-corrections.md`). Ils marchent toujours avec le nouveau site.
   - **Nouveau :** une image de case introuvable laisse une case tramée, avec la mention « picture missing » pour les lecteurs d'écran, au lieu d'une image cassée.
10. **Vérifications.**
    - La bulle « Ready? » ne couvre pas le visage de Suzu : c'était déjà corrigé.
    - Les identifiants `mg-chart-*` sont uniques.
    - La section « Known issues » est dans le README.
    - `NOTES-page.md` est supprimé.
    - Auth a les deux logos officiels, dans la démo seulement.

## Restes et limites

- **Auth, images d'erreur et de réussite.** Après un envoi raté ou réussi, Auth montre `suzu-shock` (160 px) et `suzu-face` (420 px). Dans le grand panneau, elles sont agrandies. Le contrôle ne les voit pas, parce qu'il ne regarde que l'état de repos. Il n'y a pas d'image de surprise plus grande dans `site/public/art/`.
- **Vignettes immobiles.** `check-thumbs` en signale 31 : ce sont les pièces sans état (Skeleton, Separator, Stamp, les polices…). La liste est la même qu'avant.
- **Props.** Quelques sous-agents ont retiré de `meta.props` des props qui sont celles de shadcn ou de la bibliothèque d'origine : `ratio`, `mode`, `maxLength`. C'est conforme à la règle « seulement ce que mangacn ajoute ». Quand un habillage n'ajoute rien, il documente son attribut `data-manga`.
- **Relecture à l'œil.** J'ai regardé l'accueil, les fiches pilotes, la planche lettrée, Magazine cover, la largeur sur téléphone et le mur de composants. Je n'ai pas relu à l'œil chacune des 111 fiches migrées : elles passent les contrôles par script.

## Avant la mise en ligne (inchangé, plus un point)

1. Le nom de domaine : remplacer `DOMAIN`, puis construire avec `SITE_URL=https://<domaine>/`. **Garder `BASE_PATH=/`**, ou `/<dossier>/` dans un sous-dossier.
2. L'identifiant Umami : `VITE_UMAMI_WEBSITE_ID` dans `.env.production.local`.
3. La confirmation de l'adresse Hostinger (procédure dans `docs/deploy.md`). Vérifier qu'une adresse profonde, comme `/docs/components/button`, s'ouvre bien, grâce au `.htaccess`.
4. La demande à l'annuaire shadcn : le dossier est prêt dans `docs/`.
