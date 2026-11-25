import { AuthDivider, SocialButton } from "@registry/manga/signature/social-button"
import { Button } from "@registry/manga/ui/button"
import { Tile, Tiles, force } from "../state-grid"
// The official Google icon, showcase only (the SocialButton item ships no logo).
import { GoogleMark } from "../brands"

// A neutral stand-in for a mark (a letter in a fine frame), used in the frozen tiles.
function Placeholder({ letter }: { letter: string }) {
  return <span className="grid size-5 place-items-center border-ink-fine font-letter text-sm leading-none">{letter}</span>
}


export function Preview() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <SocialButton provider="google" logo={<GoogleMark />}>
        Continue with Google
      </SocialButton>
      <SocialButton provider="apple" logo={<Placeholder letter="A" />}>
        Continue with Apple
      </SocialButton>
      <AuthDivider />
      <Button fullWidth variant="default" className="h-11!">
        Continue with email
      </Button>
    </div>
  )
}

export function States() {
  return (
    <Tiles>
      <Tile size="lg" label="rest · logo slot G">
        <SocialButton provider="google" logo={<Placeholder letter="G" />} tabIndex={-1} className="w-full">
          Continue with Google
        </SocialButton>
      </Tile>
      <Tile size="lg" label="hover · logo slot G">
        <SocialButton provider="google" logo={<Placeholder letter="G" />} {...force("hover")} tabIndex={-1} className="w-full">
          Continue with Google
        </SocialButton>
      </Tile>
      <Tile size="lg" label="focus · logo slot G">
        <SocialButton provider="google" logo={<Placeholder letter="G" />} {...force("focus")} className="w-full">
          Continue with Google
        </SocialButton>
      </Tile>
      <Tile size="lg" label="pressed · logo slot A">
        <SocialButton provider="apple" logo={<Placeholder letter="A" />} {...force("active")} tabIndex={-1} className="w-full">
          Continue with Apple
        </SocialButton>
      </Tile>
      <Tile size="lg" label="loading · logo slot A">
        <SocialButton provider="apple" logo={<Placeholder letter="A" />} loading className="w-full">
          Continue with Apple
        </SocialButton>
      </Tile>
      <Tile size="lg" label="disabled · logo slot G">
        <SocialButton provider="google" logo={<Placeholder letter="G" />} disabled tabIndex={-1} className="w-full">
          Continue with Google
        </SocialButton>
      </Tile>
      <Tile size="lg" label="without logo">
        <SocialButton tabIndex={-1} className="w-full">
          Continue with Google
        </SocialButton>
      </Tile>
      <Tile size="lg" label="divider">
        <AuthDivider className="max-w-xs" />
      </Tile>
    </Tiles>
  )
}

export function Thumb() {
  return (
    <SocialButton provider="google" logo={<Placeholder letter="G" />} tabIndex={-1} fullWidth={false} className="w-56 text-sm">
      Continue with Google
    </SocialButton>
  )
}
