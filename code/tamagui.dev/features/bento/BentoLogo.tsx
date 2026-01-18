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
  backgrounded,
}: { children?: string; scale?: number; backgrounded?: boolean }) => {
  return (
    <YStack
      pointerEvents="none"
      height={200}
      width={650}
      my={-(1 - scale) * 100}
      mx={-(1 - scale) * 270}
      scale={scale}
      {...(backgrounded && {
        bg: '$background',
      })}
    >
      <BentoLogoTheme offset={-1 + offsetAdjust}>
        <H1
          componentName="span"
          fontFamily="$cherryBomb"
          px="$3"
          mx="$-3"
          whiteSpace="pre"
          color="$color1"
          $theme-dark={{
            color: '$color8',
          }}
          maxWidth="100%"
          flex={1}
          letterSpacing={-21}
          lineHeight={280}
          my={-45}
          fontSize={180}
          userSelect="none"
          pointerEvents="none"
          className="bento-shadow"
        >
          {children}&nbsp;
        </H1>
      </BentoLogoTheme>

      <BentoLogoTheme offset={-1 + offsetAdjust}>
        <H1
          position="absolute"
          t={0}
          x={2}
          l={0}
          zIndex={1100}
          fontFamily="$cherryBomb"
          px="$3"
          mx="$-3"
          whiteSpace="pre"
          color="$color8"
          maxWidth="100%"
          flex={1}
          letterSpacing={-21}
          lineHeight={280}
          $theme-dark={{
            opacity: 0.5,
          }}
          my={-45}
          fontSize={180}
          userSelect="none"
          pointerEvents="none"
          className="clip-text mask-gradient-down"
          style={{
            backgroundImage: 'linear-gradient(var(--color10), transparent)',
            textShadow: `0 0 10px var(--color025), 0 0 8px rgba(255,255,255,0.44)`,
            maskImage: `linear-gradient(transparent 20%, rgba(0, 0, 0, 1))`,
          }}
        >
          {children}&nbsp;
        </H1>
      </BentoLogoTheme>

      <BentoLogoTheme offset={-2 + offsetAdjust}>
        <H1
          position="absolute"
          t={0}
          x={-1}
          l={0}
          zIndex={10}
          fontFamily="$cherryBomb"
          px="$3"
          mx="$-3"
          whiteSpace="pre"
          maxWidth="100%"
          flex={1}
          letterSpacing={-21}
          lineHeight={280}
          my={-45}
          fontSize={180}
          userSelect="none"
          pointerEvents="none"
          className="clip-text mask-gradient-down bento-text-3"
        >
          {children}&nbsp;
        </H1>
      </BentoLogoTheme>

      <BentoLogoTheme offset={-2 + offsetAdjust}>
        <H1
          position="absolute"
          t={0}
          l={0}
          x={1}
          opacity={0.5}
          zIndex={1100000000}
          fontFamily="$cherryBomb"
          px="$3"
          mx="$-3"
          whiteSpace="pre"
          color="$color8"
          className="mix-blend-color-burn-dodge"
          maxWidth="100%"
          flex={1}
          letterSpacing={-21}
          lineHeight={280}
          my={-45}
          fontSize={180}
          userSelect="none"
          pointerEvents="none"
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
