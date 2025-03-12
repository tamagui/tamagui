import { H1, YStack } from 'tamagui'

export const BentoLogo = ({
  children = 'Bento',
  scale = 1,
  noShadow,
  backgrounded,
}: { children?: string; scale?: number; noShadow?: boolean; backgrounded?: boolean }) => {
  return (
    <YStack
      pe="none"
      h={150}
      w={480}
      x={20}
      my={-(1 - scale) * 100}
      mx={-(1 - scale) * 270}
      scale={scale}
      {...(backgrounded && {
        backgroundColor: '$background',
      })}
    >
      <H1
        componentName="span"
        ff="$mono"
        px="$3"
        mx="$-3"
        whiteSpace="pre"
        color="$color12"
        maw="100%"
        f={1}
        lh={260}
        my={-45}
        fos={120}
        ussel="none"
        pe="none"
        // className="bento-shadow"
      >
        {children}&nbsp;
      </H1>
    </YStack>
  )
}
