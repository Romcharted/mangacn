/** Legal notice / Mentions légales (#legal), in English and in French. */
const EDITOR = { name: "Romain Sonnet", email: "romain.sonnet2003@gmail.com" }
const HOST = {
  name: "Hostinger International Limited",
  address: "61 Lordou Vironos str., 6023 Larnaca",
  country: { en: "Cyprus", fr: "Chypre" },
  site: "https://www.hostinger.com",
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-1.5">
      <h3 className="font-letter text-xl uppercase">{title}</h3>
      <div className="grid gap-1.5 text-base">{children}</div>
    </section>
  )
}

const mail = (
  <a href={`mailto:${EDITOR.email}`} className="underline decoration-2 underline-offset-2 focus-ink">
    {EDITOR.email}
  </a>
)

export function Legal() {
  return (
    <article aria-labelledby="legal-title" className="mx-auto max-w-3xl pt-6">
      <a href="#/" className="inline-flex h-9 items-center border-ink px-3 font-letter text-sm uppercase hover:ink-fill focus-ink">
        ← All components
      </a>
      <h1 id="legal-title" className="mt-6 font-letter text-5xl leading-none uppercase">
        Legal notice <span className="block text-3xl">Mentions légales</span>
      </h1>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div lang="en" className="grid content-start gap-6">
          <h2 className="font-sfx text-2xl uppercase">English</h2>
          <Block title="Publisher">
            <p>
              {EDITOR.name}, director of publication. Contact: {mail}
            </p>
          </Block>
          <Block title="Hosting">
            <p>
              {HOST.name}, {HOST.address}, {HOST.country.en}. <a href={HOST.site} className="underline focus-ink">{HOST.site.replace("https://", "")}</a>
            </p>
          </Block>
          <Block title="Audience statistics">
            <p>
              Visits are counted anonymously with Umami, without cookies and without personal data. No statistics are
              collected when your browser sends “Do Not Track”.
            </p>
          </Block>
          <Block title="Licences">
            <p>The code is released under the MIT licence. The fonts are under the SIL Open Font License.</p>
            <p>mangacn is an independent project, not affiliated with shadcn.</p>
          </Block>
        </div>

        <div lang="fr" className="grid content-start gap-6">
          <h2 className="font-sfx text-2xl uppercase">Français</h2>
          <Block title="Éditeur">
            <p>
              {EDITOR.name}, directeur de la publication. Contact : {mail}
            </p>
          </Block>
          <Block title="Hébergement">
            <p>
              {HOST.name}, {HOST.address}, {HOST.country.fr}. <a href={HOST.site} className="underline focus-ink">{HOST.site.replace("https://", "")}</a>
            </p>
          </Block>
          <Block title="Statistiques de fréquentation">
            <p>
              Les visites sont mesurées de façon anonyme avec Umami, sans cookie et sans donnée personnelle. Aucune
              statistique n’est recueillie si votre navigateur envoie « Do Not Track ».
            </p>
          </Block>
          <Block title="Licences">
            <p>Le code est publié sous licence MIT. Les polices sont sous licence SIL Open Font License.</p>
            <p>mangacn est un projet indépendant, non affilié à shadcn.</p>
          </Block>
        </div>
      </div>
    </article>
  )
}
