ÉTAPE 3 TERMINÉE

# Compte rendu du chat principal

Les étapes 1 à 3 sont finies et fusionnées dans `main`. Il me reste à récupérer le travail de la nuit (chats « Page », « Lecture », « Narration ») et à mettre à jour la liste des composants du README avant d'écrire `TOUT TERMINÉ`.

La branche `theme/webtoon` est supprimée, en local et sur GitHub.

## Étape 1 — Validations et corrections des lots B et C

Tout est dans `main` :

| Point | Commit |
| --- | --- |
| 1. Field et Questionnaire : la barre de 6 px pousse en trois images dans les deux | `341543c` |
| 2. Socle : `mg-dots` (TypingBubble en CSS pur), `animate-blink` (Input OTP), `mark-calendar` (Date Picker) | `b3c1da2`, `27daadc`, `51bb367`, `95244b6`, `009323e` |
| 3. Grammaire : « ce qui se tire au doigt suit le doigt, sans paliers » (Drawer, Resizable, Slider, Carousel) | `e967de7`, `f193c59` |
| 4. Zones tactiles de 44 px sous `pointer: coarse` (utilitaire `touch-hit`), règle dans `AGENTS.md` | `5a6dae4` |
| 5. Button en chargement : `aria-busy`, `aria-disabled`, garde le focus | `8940a04` |
| 6. Démo de Dropdown Menu sans prop propre à Base UI | `5f01cd2` |
| 7. ReaderStrip : conteneur de défilement retrouvé à chaque mesure | `757aea7` |
| 8. Pages du lecteur en mode sombre : passe-partout papier net | `757aea7` |
| 9. Manga reader : plein écran, VolumeCard en tête des chapitres | `c31ba4f` |
| 10. `NOTES-page.md` : défauts de Panel, PanelGrid et SpeechBubble | `1186cc8` |

Vérifications faites :

- **Menus ouverts sous Firefox et WebKit, clair et sombre** : Dropdown Menu, Context Menu, Menubar, Combobox, Select et Date Picker. Les 24 menus s'ouvrent et sont dessinés comme sous Chromium. Je les ai tous regardés.
- **Les 8 interfaces en lecture droite→gauche**, à 375 et 1280 px : aucun débordement horizontal, les cases et les bulles se retournent, le texte reste de gauche à droite.
- **Vidéo du lot C** (AI chat, ReactionPicker, lecteur) : faite et envoyée par le chat du lot C.

## Étape 2 — Le parcours Auth

Fait par le chat du lot B, puis vérifié ici :

- 5 écrans, un `registry:block` chacun : Sign in, Sign up, Forgot password, Verify code, Reset password.
- L'exemple `#examples/auth` passe d'un écran à l'autre, et chaque écran s'ouvre aussi seul.
- Les pièces `SocialButton` (emplacement logo de 32 px, séparateur « or ») et `PasswordStrength` (jauge en lignes de vitesse, quatre paliers).
- Les états : erreur d'identifiants (G8), chargement, tampon de réussite.
- **Logos** : le « G » officiel de Google, non modifié, se trouve seulement dans la démo du site (`site/public/brands/`, avec sa source et ses règles d'usage). L'item du registre n'embarque aucun logo. Le logo Apple n'est pas branché : son fichier officiel est un `.dmg`, et `p7zip` n'est pas installé dans WSL.
- **Captures des 5 écrans à 375, 768 et 1280 px, en clair et en sombre** : aucun débordement. Je les ai toutes regardées. À 375 px, l'e-mail de Reset password se coupait au milieu (« mika@inkwell.a / pp ») ; corrigé, il passe maintenant à la ligne en entier.
- **Installation dans 4 projets neufs** (Vite et Next.js, Base UI et Radix), les 5 écrans installés depuis GitHub : les 4 builds passent (`tsc` + Vite, `next build`). Contrôle visuel de Vite + Base UI à 375 px en clair et de Next + Radix à 1280 px en sombre : conformes à la vitrine. Ce test a révélé deux défauts du kit, corrigés (voir « Ce qui a cassé »).

## Étape 3 — Préparer la sortie

- **README en anglais** : capture de l'accueil, animation (HIT ME, Landing page, AI chat, Catalog ; 2,7 Mo), installation en une commande, serveur MCP, liste des 106 items et des interfaces. Le site n'étant pas en ligne, tous les liens pointent sur `https://DOMAIN/`, à remplacer une fois le domaine connu.
- **Image de partage** `site/public/og.png` (1200×630) et balises `og:` et `twitter:` dans `site/index.html`. L'adresse y est écrite au build à partir de `SITE_URL`.
- **Dossier de demande d'ajout à l'annuaire shadcn** : `docs/directory-submission.md`, `docs/directory-pr.md`, `docs/directory-entry.json`. Il est prêt mais n'a pas été envoyé.
- **Dépôt** : `CONTRIBUTING.md`, modèles de tickets (`.github/ISSUE_TEMPLATE/`), modèle de PR, `CHANGELOG.md`.

### Accessibilité

- **Contrastes** : tous au niveau AA. Encre sur papier : 16,8:1 en clair, 16,3:1 en sombre ; accents de 5,7:1 à 9,2:1 sur les quatre couleurs.
- **Clavier** : j'ai fait 40 tabulations par page sur 12 pages, à 1280 et 375 px, en clair et en sombre. Chaque arrêt montre un anneau de focus. Deux manques sont corrigés : le panneau de Tabs (`e5269d7`) et le graphique de Chart (`68eccfe`).
- **Mouvement réduit** : avec `prefers-reduced-motion: reduce`, aucune animation ne tourne sur les 11 pages testées. Sans préférence, les animations attendues tournent (impact, points, curseur, spinner).
- **Lecteur d'écran** : j'ai seulement vérifié l'arbre d'accessibilité (contrôles tous nommés, langue de la page, images avec `alt`). Je n'ai pas fait de test avec un vrai lecteur (NVDA, VoiceOver).
- **Restent à corriger** :
  - deux `h1` sur les pages d'interface et sur l'accueil desktop (le `h1` du bloc s'ajoute à celui de la page) ;
  - des identifiants de motif en double (`mg-chart-*`) quand deux graphiques sont sur la même page.

### Performance

Mesures sur téléphone simulé (375 px, 1,6 Mb/s, 150 ms, processeur ×4), médiane de 3 essais :

| Page | Premier affichage | Temps bloqué | Poids transféré |
| --- | --- | --- | --- |
| Accueil | 6,5 → 4,3 s | 2 945 → 583 ms | 918 → 517 Ko |
| Fiche Button | 6,5 → 4,2 s | 1 216 → 416 ms | 896 → 504 Ko |
| Dashboard | 6,9 → 4,2 s | 1 425 → 952 ms | 896 → 666 Ko |

- Le gain vient du chargement à la demande des démos, des interfaces et des pages (`0810d87`).
- La mise en page bouge au plus de 0,037.
- Le CSS pèse 143 Ko compressé, les polices du premier affichage environ 60 Ko.
- Le serveur de test était en HTTP/1.1 : un hébergement en HTTP/2 fera mieux.

## Ce qui a cassé et comment je l'ai réparé

- **Grave : toute installation neuve cassait le build** depuis l'ajout de `touch-hit` (`5a6dae4`). La CLI shadcn abîme un sélecteur imbriqué dans un `@media`, lui-même dans un `@utility` : elle écrit `@media (pointer:not(:active, [data-fx])::after: coarse)`, et Vite (lightningcss) comme Next (Turbopack) refusent ce CSS. `touch-hit` est maintenant une classe simple dans `@layer base` (`7b071b5`), et les 4 projets neufs construisent. J'ai prévenu les chats Page, Lecture et Narration.
- **Défilement de côté sur téléphone dans un projet neuf** : les lignes d'impact d'un bouton pleine largeur, invisibles mais présentes dans la mise en page, dépassaient de 10 px. La vitrine le masquait. Elles sont maintenant retirées de la mise en page au repos (`936c652`). Pendant l'appui et l'impact, elles s'affichent toujours ; c'est vérifié.
- **Encodage** : des fichiers écrits depuis Git Bash ou le Python de Windows sont sortis en ISO-8859 ou en CRLF. Je les ai restaurés, et depuis tout passe par les outils d'édition ou par WSL.
- **Page qui s'ouvrait déjà défilée** : la vignette de Command montait un vrai `cmdk`, qui fait défiler l'élément choisi jusqu'à l'écran. Elle est remplacée par un dessin statique.
- **Captures Firefox et WebKit bloquées** : `playwright-core` n'a pas de délai par défaut pour les actions. J'ai ajouté des délais et corrigé les sélecteurs.

## Règles spéciales proposées

- Aucune nouvelle.
- Une remarque : sous WebKit, le mois du Date Picker suit la langue du navigateur (« JANV. » sur une machine en français), alors que le reste de l'interface est en anglais. C'est le comportement d'`Intl` ; à décider si le kit doit fixer la langue.

## Besoins du socle

Aucun.

## Ce que je n'ai pas pu vérifier

- Un vrai lecteur d'écran.
- Le logo Apple (il faut `p7zip`).

## Choix faits seul

- Les liens publics pointent sur `https://DOMAIN/` plutôt que sur GitHub Pages, qui n'est pas activé.
- Le passage image à gauche / formulaire à droite des écrans Auth suit la largeur du bloc (48 rem, soit 768 px), selon la règle des requêtes de conteneur du kit. Dans la vitrine à 768 px de fenêtre, le bloc est un peu plus étroit à cause des marges du site, donc l'image reste au-dessus du formulaire.

## Avant la mise en ligne

1. **Le nom de domaine** : remplacer `DOMAIN` dans `README.md`, `registry/index.json` (puis `npm run build`) et `docs/directory-*`. Construire avec `SITE_URL=https://<domaine>/`.
2. **L'identifiant Umami** : `VITE_UMAMI_WEBSITE_ID` dans `.env.production.local`.
3. **La confirmation de l'adresse Hostinger** : la procédure d'envoi est dans `docs/deploy.md`.
4. **Le logo Apple** : lancer `wsl.exe -d ubuntu-24.04 -- sudo apt-get install -y p7zip-full`, puis l'ajouter à la démo.
5. **La demande à l'annuaire shadcn** : le dossier est prêt dans `docs/`, à envoyer une fois le site en ligne.
