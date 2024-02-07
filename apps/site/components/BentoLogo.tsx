import { ThemeTintAlt, ThemeTint } from '@tamagui/logo'
import { H1, YStack } from 'tamagui'

export const BentoLogo = () => (
  <YStack h={200} w={600}>
    <H1
      ff="$cherryBomb"
      px="$3"
      mx="$-3"
      whiteSpace="pre"
      color="$color9"
      maw="100%"
      f={1}
      ls={-21}
      lh={180}
      fos={198}
      ussel="none"
      pe="none"
      className="bento-shadow"
      // o={0}
    >
      BENTO&nbsp;
    </H1>

    <ThemeTintAlt>
      <H1
        // o={0}
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
        style={{
          mixBlendMode: 'color-dodge',
          backgroundImage: 'linear-gradient(var(--background025), var(--color8))',
        }}
      >
        BENTO&nbsp;
      </H1>
    </ThemeTintAlt>

    <ThemeTint>
      <H1
        // o={0}
        pos="absolute"
        t={0}
        l={0}
        zi={1100}
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
        style={{
          backgroundImage: 'linear-gradient(var(--color10), transparent)',
          textShadow: `0 0 10px var(--color025), 0 0 8px rgba(255,255,255,0.2)`,
          // maskImage: `linear-gradient(rgba(0, 0, 0, 1), transparent 20%)`,
          mixBlendMode: 'hard-light',
        }}
      >
        BENTO&nbsp;
      </H1>
    </ThemeTint>
  </YStack>
)
