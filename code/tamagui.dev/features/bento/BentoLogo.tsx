import { useTint } from '@tamagui/logo'
import { H1, type ThemeProps, YStack, Theme } from 'tamagui'

const offsetAdjust = 1

export const BentoLogoTheme = ({
  children,
  disable,
  offset = 1,
  ...rest
}: ThemeProps & {
  disable?: boolean
  offset?: number
}) => {
  const curTint = useTint(offset).tintAlt
  const name = disable ? null : curTint
  return (
    <Theme name={name === 'purple' ? 'yellow' : name} {...rest}>
      {children}
    </Theme>
  )
}

export const BentoLogo = ({
  children = 'BENTO',
  scale = 1,
  noShadow,
  backgrounded,
}: { children?: string; scale?: number; noShadow?: boolean; backgrounded?: boolean }) => {
  return (
    <YStack
      pe="none"
      h={200}
      w={650}
      my={-(1 - scale) * 100}
      mx={-(1 - scale) * 270}
      scale={scale}
      {...(backgrounded && {
        backgroundColor: '$background',
      })}
    >
      <BentoLogoTheme offset={-1 + offsetAdjust}>
        <H1
          componentName="span"
          ff="$cherryBomb"
          px="$3"
          mx="$-3"
          whiteSpace="pre"
          color="$color1"
          $theme-dark={{
            color: '$color8',
          }}
          maw="100%"
          f={1}
          ls={-21}
          lh={280}
          my={-45}
          fos={198}
          ussel="none"
          pe="none"
          className="bento-shadow"
          // o={0}
        >
          {children}&nbsp;
        </H1>
      </BentoLogoTheme>

      <BentoLogoTheme offset={-1 + offsetAdjust}>
        <H1
          // o={0}
          pos="absolute"
          t={0}
          x={2}
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
          lh={280}
          $theme-dark={{
            opacity: 0.5,
          }}
          my={-45}
          fos={198}
          ussel="none"
          pe="none"
          className="clip-text mask-gradient-down"
          style={{
            backgroundImage: 'linear-gradient(var(--color10), transparent)',
            textShadow: `0 0 10px var(--color025), 0 0 8px rgba(255,255,255,0.44)`,
            maskImage: `linear-gradient(transparent 20%, rgba(0, 0, 0, 1))`,
            // mixBlendMode: 'hard-light',
          }}
        >
          {children}&nbsp;
        </H1>
      </BentoLogoTheme>

      <BentoLogoTheme offset={-2 + offsetAdjust}>
        <H1
          pos="absolute"
          t={0}
          x={-1}
          l={0}
          zi={10}
          ff="$cherryBomb"
          px="$3"
          mx="$-3"
          whiteSpace="pre"
          maw="100%"
          f={1}
          ls={-21}
          lh={280}
          my={-45}
          fos={198}
          ussel="none"
          pe="none"
          className="clip-text mask-gradient-down bento-text-3"
        >
          {children}&nbsp;
        </H1>
      </BentoLogoTheme>

      <BentoLogoTheme offset={-2 + offsetAdjust}>
        {!noShadow && (
          <H1
            className={`glow-shadow mask-gradient-up`}
            pos="absolute"
            t={0}
            l={0}
            zi={1100}
            ff="$cherryBomb"
            px="$3"
            mx="$-3"
            whiteSpace="pre"
            $theme-dark={{
              opacity: 0,
            }}
            color="$color8"
            maw="100%"
            f={1}
            ls={-21}
            lh={280}
            my={-45}
            fos={198}
            ussel="none"
            pe="none"
            style={{
              filter: noShadow ? '' : 'blur(2px)',
            }}
          >
            {children}&nbsp;
          </H1>
        )}
      </BentoLogoTheme>

      <BentoLogoTheme offset={1 + offsetAdjust}>
        {!noShadow && (
          <H1
            className={`glow-shadow mask-gradient-up`}
            pos="absolute"
            t={0}
            l={0}
            zi={1100}
            ff="$cherryBomb"
            px="$3"
            mx="$-3"
            whiteSpace="pre"
            $theme-light={{
              opacity: 0,
            }}
            color="$color8"
            maw="100%"
            f={1}
            ls={-21}
            lh={280}
            my={-45}
            fos={198}
            ussel="none"
            pe="none"
            style={{
              filter: noShadow ? '' : 'blur(2px)',
            }}
          >
            {children}&nbsp;
          </H1>
        )}
      </BentoLogoTheme>

      <BentoLogoTheme offset={-2 + offsetAdjust}>
        <H1
          pos="absolute"
          t={0}
          l={0}
          x={1}
          o={0.5}
          zi={1100000000}
          ff="$cherryBomb"
          px="$3"
          mx="$-3"
          whiteSpace="pre"
          color="$color8"
          className="mix-blend-color-burn-dodge"
          maw="100%"
          f={1}
          ls={-21}
          lh={280}
          my={-45}
          fos={198}
          ussel="none"
          pe="none"
          style={{
            maskImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0) 60%)`,
          }}
        >
          {children}&nbsp;
        </H1>
      </BentoLogoTheme>
    </YStack>
  )
}
