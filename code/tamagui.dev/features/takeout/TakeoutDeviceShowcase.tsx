import { Image } from '@tamagui/image'
import { ThemeTintAlt } from '@tamagui/logo'
import { H2, Paragraph, styled, Theme, XStack, YStack } from 'tamagui'

const HighlightText = styled(Paragraph, {
  fontSize: 32,
  fontWeight: '700',
  color: '$green10',
  style: {
    lineHeight: '1.2',
  },

  $sm: {
    fontSize: 40,
  },
})

const BrowserFrame = styled(YStack, {
  bg: '$color2',
  rounded: '$6',
  borderWidth: 0.5,
  borderColor: '$color4',
  overflow: 'hidden',
  shadowColor: '$shadowColor',
  shadowRadius: 40,
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.15,
  style: {
    backdropFilter: 'blur(12px)',
  },
})

const BrowserHeader = styled(XStack, {
  bg: '$color3',
  px: '$4',
  py: '$3',
  items: 'center',
  gap: '$3',
  borderBottomWidth: 1,
  borderBottomColor: '$color4',
})

const BrowserDot = styled(YStack, {
  width: 12,
  height: 12,
  rounded: 999,
})

const BrowserUrlBar = styled(YStack, {
  flex: 1,
  bg: '$color1',
  rounded: '$3',
  px: '$3',
  py: '$1.5',
  mx: '$4',
})

const BrowserContent = styled(YStack, {
  bg: '$color1',
  minH: 320,
  items: 'center',
  justify: 'center',
  p: '$6',
})

const FeatureChip = styled(XStack, {
  px: '$4',
  py: '$2',
  rounded: '$10',
  items: 'center',
  gap: '$2',
})

export function TakeoutDeviceShowcase() {
  return (
    <YStack gap="$8" py="$12" px="$4" items="center">
      <YStack items="center" gap="$4" maxW={600}>
        <H2
          fontSize={32}
          fontWeight="700"
          text="center"
          color="$color12"
          style={{ lineHeight: '1.2' }}
          $sm={{ fontSize: 40 }}
        >
          Cross-Platform{' '}
          <ThemeTintAlt>
            <HighlightText render="span">Excellence.</HighlightText>
          </ThemeTintAlt>
        </H2>
        <Paragraph
          fontSize={16}
          color="$color11"
          text="center"
          style={{ lineHeight: '1.6' }}
          $sm={{ fontSize: 18 }}
        >
          Get a perfect 100 Lighthouse score on static or server-rendered pages, while
          sharing your entire setup - design system, styling, UI kit, routing, and data.
        </Paragraph>
      </YStack>

      <XStack gap="$8" items="center" justify="center" flexWrap="wrap" maxW={1000}>
        {/* browser frame - web */}
        <YStack gap="$3" items="center">
          <BrowserFrame width={380} $sm={{ width: 500 }}>
            <BrowserHeader>
              <XStack gap="$2">
                <BrowserDot bg="#ff5f57" />
                <BrowserDot bg="#ffbd2e" />
                <BrowserDot bg="#28ca42" />
              </XStack>
              <BrowserUrlBar>
                <Paragraph fontSize={12} color="$color9" fontFamily="$mono">
                  localhost:5173
                </Paragraph>
              </BrowserUrlBar>
            </BrowserHeader>
            <BrowserContent>
              <YStack gap="$3" items="center">
                <YStack
                  width={56}
                  height={56}
                  rounded="$4"
                  bg="$blue10"
                  items="center"
                  justify="center"
                >
                  <Paragraph fontSize={24} fontWeight="700" color="white">
                    T
                  </Paragraph>
                </YStack>
                <Paragraph fontSize={18} fontWeight="600" color="$color12">
                  Your App
                </Paragraph>
                <Paragraph fontSize={14} color="$color10">
                  Running on Vite
                </Paragraph>
              </YStack>
            </BrowserContent>
          </BrowserFrame>
          <Theme name="blue">
            <FeatureChip
              bg="$color4"
              borderWidth={0.5}
              borderColor="$color6"
              style={{
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
              }}
            >
              <YStack width={6} height={6} rounded={999} bg="$color10" />
              <Paragraph fontSize={13} color="$color11" fontWeight="600">
                Web
              </Paragraph>
              <Paragraph fontSize={11} color="$color9">
                -
              </Paragraph>
              <Paragraph fontSize={13} color="$color11" fontWeight="500">
                SSR
              </Paragraph>
              <Paragraph fontSize={11} color="$color9">
                -
              </Paragraph>
              <Paragraph fontSize={13} color="$color11" fontWeight="500">
                SSG
              </Paragraph>
            </FeatureChip>
          </Theme>
        </YStack>

        {/* iphone frame - native */}
        <YStack gap="$3" items="center">
          <YStack
            position="relative"
            width={200}
            height={410}
            $sm={{ width: 240, height: 490 }}
          >
            {/* iPhone frame image */}
            <Image
              src="/takeout/iphone-frame.png"
              alt="iPhone frame"
              position="absolute"
              t={0}
              l={0}
              width="100%"
              height="100%"
              objectFit="contain"
              z={10}
              pointerEvents="none"
            />
            {/* Screen content */}
            <YStack
              position="absolute"
              t="3%"
              l="6%"
              r="6%"
              b="3%"
              rounded="$6"
              overflow="hidden"
              bg="$color1"
              items="center"
              justify="center"
              z={1}
            >
              <YStack gap="$2" items="center">
                <YStack
                  width={44}
                  height={44}
                  rounded="$3"
                  bg="$green10"
                  items="center"
                  justify="center"
                >
                  <Paragraph fontSize={20} fontWeight="700" color="white">
                    T
                  </Paragraph>
                </YStack>
                <Paragraph fontSize={15} fontWeight="600" color="$color12">
                  Your App
                </Paragraph>
                <Paragraph fontSize={12} color="$color10">
                  Native iOS
                </Paragraph>
              </YStack>
            </YStack>
          </YStack>
          <Theme name="green">
            <FeatureChip
              bg="$color4"
              borderWidth={0.5}
              borderColor="$color6"
              style={{
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)',
              }}
            >
              <YStack width={6} height={6} rounded={999} bg="$color10" />
              <Paragraph fontSize={13} color="$color11" fontWeight="600">
                iOS
              </Paragraph>
              <Paragraph fontSize={11} color="$color9">
                -
              </Paragraph>
              <Paragraph fontSize={13} color="$color11" fontWeight="500">
                Android
              </Paragraph>
            </FeatureChip>
          </Theme>
        </YStack>
      </XStack>

      {/* feature pills */}
      <XStack gap="$3" flexWrap="wrap" justify="center" mt="$4" maxW={700}>
        {[
          { label: '100 Lighthouse score', theme: 'green' as const },
          { label: 'SSR & SSG support', theme: 'blue' as const },
          { label: 'Native UI elements', theme: 'gray' as const },
          { label: 'Shared design system', theme: 'yellow' as const },
          { label: 'Per-platform divergence', theme: 'red' as const },
        ].map((feature) => (
          <Theme key={feature.label} name={feature.theme}>
            <XStack
              px="$4"
              py="$2.5"
              rounded="$10"
              bg="$color3"
              borderWidth={0.5}
              borderColor="$color5"
              gap="$2"
              items="center"
              cursor="pointer"
              hoverStyle={{ bg: '$color4', borderColor: '$color6' }}
              style={{ transition: 'all 200ms ease' }}
            >
              <YStack width={5} height={5} rounded={999} bg="$color10" />
              <Paragraph fontSize={13} color="$color11" fontWeight="500">
                {feature.label}
              </Paragraph>
            </XStack>
          </Theme>
        ))}
      </XStack>
    </YStack>
  )
}
