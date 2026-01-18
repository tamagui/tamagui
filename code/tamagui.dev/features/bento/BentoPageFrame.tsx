import { Image, Theme, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

const Wave = () => {
  return (
    <YStack
      pointerEvents="none"
      position="absolute"
      top={-10}
      rotate="220deg"
      left="50%"
      x={-250}
      opacity={0.4}
      $theme-dark={{
        opacity: 0.14,
      }}
      zIndex={1}
      mixBlendMode="color-burn"
      filter="blur(2px)"
      mask="linear-gradient(black 80%, transparent)"
    >
      <Image alt="ocean" width={2000} height={2000} src="/takeout/wave.svg" />
    </YStack>
  )
}

const Break = () => {
  return (
    <YStack
      pointerEvents="none"
      position="absolute"
      rotate="20deg"
      top={-90}
      left="100%"
      scale={0.85}
      x={-1050}
      opacity={0.07}
      $theme-dark={{
        opacity: 0.02,
      }}
      zIndex={-1}
    >
      <Image width={2000} height={2000} src="/takeout/geometric.svg" />
    </YStack>
  )
}

export const BentoPageFrame = ({
  children,
  simpler,
}: { children: any; simpler?: boolean }) => {
  return (
    <>
      <YStack maxWidth="100%" paddingTop={simpler ? 0 : '$2'}>
        <Theme name="tan">
          <YStack
            pointerEvents="none"
            overflow="hidden"
            fullscreen
            y={simpler ? 0 : -100}
            bottom={-100}
          >
            <YStack fullscreen backgroundColor="$color6" />

            <YStack
              className="grain"
              fullscreen
              opacity={0.5}
              zIndex={100}
              $theme-light={{
                opacity: 0.75,
              }}
              style={{
                imageRendering: 'pixelated',
                maskImage: 'linear-gradient(to right, #000, transparent 50%)',
              }}
            />

            <YStack
              fullscreen
              maxHeight={1000}
              className="mask-gradient-down"
              mixBlendMode="hard-light"
            >
              <Theme name="blue">
                <LinearGradient
                  colors={[`transparent`, `$color9`]}
                  start={[0, 0.5]}
                  end={[1, 0.5]}
                  fullscreen
                  left="30%"
                  opacity={0.2}
                />
              </Theme>

              <Break />

              <Wave />

              <YStack x={100} y={100}>
                <Wave />
              </YStack>
            </YStack>
          </YStack>
        </Theme>

        {children}
      </YStack>
    </>
  )
}
