import { H1, Theme, YStack } from 'tamagui'

export const BentoLogo = ({
  children = 'Bento',
  scale = 1,
  noShadow,
  backgrounded,
}: { children?: string; scale?: number; noShadow?: boolean; backgrounded?: boolean }) => {
  return (
    <Theme name="accent">
      <YStack pointerEvents="none" scale={scale}>
        <H1
          componentName="span"
          fontFamily="$mono"
          color="$color5"
          maxW="100%"
          flex={1}
          lineHeight={120}
          fontSize={120}
          select="none"
          pointerEvents="none"
        >
          {children}
        </H1>
      </YStack>
    </Theme>
  )
}
