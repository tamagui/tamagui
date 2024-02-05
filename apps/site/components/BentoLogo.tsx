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
      ls={-20}
      lh={200}
      fos={198}
      ussel="none"
      pe="none"
      style={{
        textShadow: `1px 1px 1px var(--color9), 1px 2px 1px var(--color8),
                  1px 3px 1px var(--color7), 1px 4px 1px var(--color7), 1px 5px 1px var(--color6),
                  1px 6px 1px var(--color6), 1px 7px 1px var(--color5), 1px 8px 1px var(--color5),
                  1px 9px 1px var(--color4), 1px 12px 1px var(--color4),
                  1px 10px 150px rgba(255,255,255,0.2)`,
      }}
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
        ls={-20}
        lh={200}
        fos={198}
        ussel="none"
        pe="none"
        className="clip-text mask-gradient-up"
        // @ts-ignore
        style={{
          mixBlendMode: 'hard-light',
          backgroundImage: 'linear-gradient(var(--color8), var(--color1))',
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
        color="$color6"
        maw="100%"
        f={1}
        ls={-20}
        lh={200}
        fos={198}
        ussel="none"
        pe="none"
        className="clip-text mask-gradient-down"
        // @ts-ignore
        style={{
          backgroundImage: 'linear-gradient(var(--color11), var(--color8))',
          textShadow: '0 5px 20px rgba(255,255,255,0.6)',
          mixBlendMode: 'hard-light',
        }}
      >
        BENTO&nbsp;
      </H1>
    </ThemeTint>
  </>
)
