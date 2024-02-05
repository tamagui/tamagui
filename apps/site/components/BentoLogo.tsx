import { ThemeTintAlt, ThemeTint } from '@tamagui/logo'
import { H1 } from 'tamagui'

export const BentoLogo = () => (
  <>
    <H1
      ff="$cherryBomb"
      px="$3"
      mx="$-3"
      whiteSpace="pre"
      color="$color11"
      maw="100%"
      f={1}
      ls={-21}
      lh={180}
      fos={198}
      ussel="none"
      pe="none"
      className="bento-shadow"
    >
      BENTO&nbsp;
    </H1>

    <ThemeTintAlt>
      <H1
        pos="absolute"
        t={0}
        l={0}
        zi={10}
        ff="$cherryBomb"
        px="$3"
        mx="$-3"
        whiteSpace="pre"
        color="$color10"
        maw="100%"
        f={1}
        ls={-21}
        lh={180}
        fos={198}
        ussel="none"
        pe="none"
        className="clip-text mask-gradient-up"
        // @ts-ignore
        style={{
          mixBlendMode: 'hard-light',
          backgroundImage: 'linear-gradient(var(--background025), var(--color7))',
        }}
      >
        BENTO&nbsp;
      </H1>
    </ThemeTintAlt>

    <ThemeTint>
      <H1
        pos="absolute"
        t={0}
        l={0}
        zi={11}
        ff="$cherryBomb"
        px="$3"
        mx="$-3"
        whiteSpace="pre"
        color="$color8"
        maw="100%"
        f={1}
        ls={-21}
        lh={180}
        fos={198}
        ussel="none"
        pe="none"
        className="clip-text mask-gradient-down"
        // @ts-ignore
        style={{
          backgroundImage: 'linear-gradient(var(--color8), transparent)',
          textShadow: `0 0 4px var(--color075), 0 0 10px rgba(255,255,255,0.35)`,
          mixBlendMode: 'hard-light',
        }}
      >
        BENTO&nbsp;
      </H1>
    </ThemeTint>
  </>
)
