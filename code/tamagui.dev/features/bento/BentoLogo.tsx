import { H1, Theme, YStack } from 'tamagui'

export const BentoLogo = ({
  children = 'Bento',
  scale = 1,
  noShadow,
  backgrounded,
}: { children?: string; scale?: number; noShadow?: boolean; backgrounded?: boolean }) => {
  return (
    <Theme name="accent">
      <YStack pe="none" scale={scale}>
        <H1
          componentName="span"
          ff="$mono"
          color="$color5"
          maw="100%"
          f={1}
          lh={120}
          fos={120}
          ussel="none"
          pe="none"
        >
          {children}
        </H1>
      </YStack>
    </Theme>
  )
}
