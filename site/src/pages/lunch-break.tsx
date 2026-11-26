import { Page, Panel, PanelCaption, Place, Tier } from "@registry/manga/signature/panel"
import { Screentone } from "@registry/manga/signature/screentone"
import { Sfx } from "@registry/manga/signature/sfx"
import { SpeechBubble } from "@registry/manga/signature/speech-bubble"
import { SpeedLines } from "@registry/manga/signature/speed-lines"
import { Bench, Mochi, Onigiri, RinBust, RinHead, Scene, Tree, Wall } from "./lunch-art"

/** "Lunch break": a page drawn for the kit, written in JSX (Tier, Panel, Place). */
export function LunchBreak({ reading }: { reading?: "ltr" | "rtl" }) {
  return (
    <Page format="pocket" reading={reading} label="Lunch break, a manga page">
      <Tier height={1.1}>
        <Panel bleed label="A park at noon. Rin sits on a bench with a rice ball.">
          <Screentone density={20} fade="bottom" className="absolute inset-x-0 top-0 h-3/5" />
          <Scene w={260} h={100}>
            <Tree at={{ x: 40, y: 52, s: 0.55 }} />
            <Tree at={{ x: 228, y: 46, s: 0.7 }} />
            <path d="M0 82 H260" strokeWidth={1.6} />
            <Bench at={{ x: 132, y: 78, s: 0.42 }} />
            <RinBust at={{ x: 132, y: 54, s: 0.17 }} face="happy" arms="hold" />
          </Scene>
          <Place x="3%" y="7%" anchor="top-left">
            <PanelCaption position="free">Noon. The park.</PanelCaption>
          </Place>
          <Place x="64%" y="14%" anchor="top-left" maxWidth="34%">
            <SpeechBubble pointAt={{ x: "53%", y: "50%" }}>Finally, lunch!</SpeechBubble>
          </Place>
        </Panel>
      </Tier>
      <Tier slant={-4}>
        <Panel slant={5} label="Rin, eyes closed, lifts the rice ball.">
          <Scene>
            <RinBust at={{ x: 66, y: 46, s: 0.42 }} face="closed" arms="hold" />
          </Scene>
          <Place x="96%" y="8%" anchor="top-right" maxWidth="46%">
            <SpeechBubble variant="thought" pointAt={{ x: "62%", y: "36%" }}>
              Just you and me, little rice ball.
            </SpeechBubble>
          </Place>
        </Panel>
        <Panel width={1.1} label="Her phone rings. She turns away, the rice ball left on the bench.">
          <Scene>
            <path d="M0 80 H142" strokeWidth={1.6} />
            <Bench at={{ x: 60, y: 92, s: 0.7 }} />
            <Onigiri at={{ x: 36, y: 74, s: 0.4 }} />
            <RinBust at={{ x: 102, y: 44, s: 0.36, flip: true }} face="side" arms="phone" />
          </Scene>
          <Place x="8%" y="10%" anchor="top-left">
            <Sfx size="md" rotate={-10}>
              BRRR
            </Sfx>
          </Place>
          <Place x="40%" y="40%" anchor="top-right" maxWidth="40%">
            <SpeechBubble variant="speech" pointAt={{ x: "80%", y: "30%" }}>
              Yes? Now?!
            </SpeechBubble>
          </Place>
        </Panel>
      </Tier>
      <Tier slant={5}>
        <Panel shape="tilted" tilt={-3} label="Behind the bench, Mochi the cat eyes the rice ball.">
          <Screentone pattern="lines" density={18} angle={0} className="absolute inset-0" />
          <Scene>
            <Mochi at={{ x: 72, y: 54, s: 0.62 }} eyes="sly" />
          </Scene>
          <Place x="6%" y="8%" anchor="top-left" maxWidth="36%">
            <SpeechBubble variant="whisper" pointAt={{ x: "52%", y: "40%" }}>
              …
            </SpeechBubble>
          </Place>
        </Panel>
        <Panel width={1.1} shape="jagged" label="Rin turns back. The rice ball is gone. She screams.">
          <SpeedLines hole={0.4} className="absolute inset-0" />
          <Scene>
            <RinHead at={{ x: 71, y: 56, s: 0.5 }} face="shock" />
          </Scene>
          <Place x="50%" y="6%" anchor="top" maxWidth="70%">
            <SpeechBubble variant="shout" pointAt={{ x: "56%", y: "56%" }}>
              My lunch?!
            </SpeechBubble>
          </Place>
        </Panel>
      </Tier>
      <Tier height={1.2}>
        <Panel label="On a wall, Mochi chews the rice ball. Rin shakes her fist far below.">
          <Scene w={260} h={100}>
            <Wall y={56} />
            <Mochi at={{ x: 122, y: 34, s: 0.34 }} chew />
            <RinBust at={{ x: 52, y: 84, s: 0.15 }} face="angry" arms="fist" />
          </Scene>
          <Place x="80%" y="80%" anchor="center">
            <Sfx size="md" rotate={-8} variant="outline">
              NOM NOM
            </Sfx>
          </Place>
          <Place x="6%" y="10%" anchor="top-left" maxWidth="40%">
            <SpeechBubble variant="shout" pointAt={{ x: "21%", y: "70%" }}>
              Mochi!!
            </SpeechBubble>
          </Place>
        </Panel>
        <Panel inset={{ x: 66, y: 6, w: 30, h: 46 }} shape="cloud" label="Mochi winks.">
          <Scene w={100} h={100}>
            <Mochi at={{ x: 50, y: 52, s: 0.7 }} eyes="wink" />
          </Scene>
        </Panel>
      </Tier>
    </Page>
  )
}
