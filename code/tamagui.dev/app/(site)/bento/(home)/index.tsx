// @ts-expect-error - bento component wildcard import
import { LocationNotification } from '@tamagui/bento/component/user/preferences/LocationNotification'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Globe, Leaf, Puzzle } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { Button, Circle, H4, Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'
import { BentoStore, ComponentSection } from '~/components/BentoComponentSection'
import { ContainerLarge } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { BentoLogo } from '~/features/bento/BentoLogo'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { useSubscriptionModal } from '~/features/site/purchase/useSubscriptionModal'

export default function BentoPage() {
  const store = useStore(BentoStore)

  return (
    <>
      <LoadCherryBomb />

      <HeadInfo
        title="Copy-paste UI for React Native and Web - Tamagui Bento"
        description="Tamagui Bento - Copy-paste components and screens for React and React Native"
        openGraph={{
          url: '/bento',
          images: [
            {
              url: '/bento/social.png',
            },
          ],
        }}
      />

      <BentoPageFrame>
        <YStack
          onLayout={(e) => {
            store.heroHeight = e.nativeEvent.layout.height
          }}
        >
          <Hero />
          <Intermediate />
        </YStack>
        <ComponentSection />
      </BentoPageFrame>
    </>
  )
}

const Intermediate = () => {
  return (
    <ContainerLarge z={1000}>
      <XStack
        gap="$4"
        py="$6"
        pt={20}
        mb={-20}
        mx="auto"
        maxW={900}
        $sm={{
          flexDirection: 'column',
          px: '$2',
          pt: '$4',
          mb: 0,
        }}
      >
        <IntermediateCard Icon={Globe} title="Universal">
          Whether light or dark mode, native or web, or any screen size.
        </IntermediateCard>
        <IntermediateCard Icon={Puzzle} title="Copy & Paste">
          Customize to your design system, designed to be used independently.
        </IntermediateCard>
        <IntermediateCard Icon={Leaf} title="Free">
          Expanding free components. Lifetime&nbsp;rights paid.
        </IntermediateCard>
      </XStack>
    </ContainerLarge>
  )
}

const IntermediateCard = ({
  title,
  children,
  Icon,
}: {
  title?: any
  children?: any
  Icon?: any
}) => {
  return (
    <XStack overflow="hidden" flex={1} gap="$5" px="$5" py="$4" minHeight={80}>
      <YStack flex={1} gap="$2">
        <H4
          opacity={0.5}
          fontFamily="$silkscreen"
          color="$color11"
          className="text-glow"
          size="$2"
        >
          {title}
        </H4>
        <Paragraph mb={-5} size="$3" color="$color12" opacity={0.7}>
          {children}
        </Paragraph>
      </YStack>
      <Circle
        outlineColor="$color02"
        outlineOffset={-4}
        outlineWidth={1}
        outlineStyle="solid"
        size="$5"
        elevation="$0.5"
        backdropFilter="blur(5px)"
      >
        <Icon color="$color11" o={0.85} />
      </Circle>
    </XStack>
  )
}

const Hero = () => {
  const { showAppropriateModal } = useSubscriptionModal()

  return (
    <YStack position="relative" z={10}>
      <ContainerLarge>
        <XStack
          gap="$6"
          pb="$3"
          bg="transparent"
          justify="space-between"
          width="100%"
          $sm={{
            flexDirection: 'column',
          }}
        >
          <YStack
            mb={40}
            mt={60}
            maxW="55%"
            z={100}
            justify="space-between"
            flex={10}
            items="flex-start"
            $sm={{
              maxW: '100%',
              items: 'center',
              minHeight: 'max-content',
            }}
          >
            <YStack
              className="ms200 ease-in all"
              transformOrigin="center top"
              $xxs={{
                scale: 0.4,
                mb: -80,
              }}
              $xs={{
                scale: 0.5,
                mb: -80,
              }}
              $sm={{
                self: 'center',
                scale: 0.6,
                mb: -60,
              }}
              $md={{ mb: -100, scale: 0.72 }}
            >
              <BentoLogo />
            </YStack>

            <Spacer size="$6" />

            <YStack maxW={500} gap="$7" mx="auto" $sm={{ px: '$4', maxW: 400 }}>
              <XStack gap="$6">
                <Paragraph
                  fontFamily="$mono"
                  fontSize={22}
                  lineHeight={40}
                  color="$color11"
                  maxH={120}
                  $md={{
                    mt: '$6',
                    fontSize: 22,
                    lineHeight: 38,
                  }}
                  $sm={{
                    text: 'center',
                  }}
                >
                  Copy-paste UI for React&nbsp;Native and&nbsp;React web, free and paid.
                </Paragraph>
              </XStack>
              <XStack
                justify="space-between"
                items="center"
                ml="$8"
                mr="$4"
                $md={{ mx: 0, flexDirection: 'column', gap: '$3' }}
              >
                <Paragraph
                  fontFamily="$mono"
                  color="$color10"
                  size="$5"
                  $md={{ size: '$3' }}
                >
                  One-time Purchase
                </Paragraph>

                <Circle size={4} bg="$color10" $md={{ display: 'none' }} />

                <XStack items="center" justify="space-between">
                  <Spacer />
                  <Theme name="green">
                    <Button
                      className="box-3d all ease-in-out ms100"
                      size="$3"
                      self="flex-end"
                      mr="$4"
                      bg="$color9"
                      outlineColor="$background02"
                      outlineOffset={2}
                      outlineWidth={3}
                      outlineStyle="solid"
                      hoverStyle={{
                        bg: '$color10',
                        outlineColor: '$background04',
                        borderColor: '$color11',
                      }}
                      pressStyle={{
                        bg: '$color9',
                        outlineColor: '$background06',
                      }}
                      onPress={() => {
                        showAppropriateModal()
                      }}
                    >
                      <Button.Text fontFamily="$mono" size="$4" color="$color1">
                        Pro
                      </Button.Text>
                    </Button>
                  </Theme>
                </XStack>

                <Circle size={4} bg="$color10" $md={{ display: 'none' }} />

                <Paragraph
                  fontFamily="$mono"
                  color="$color10"
                  size="$5"
                  $md={{ size: '$3' }}
                >
                  Lifetime rights
                </Paragraph>
              </XStack>
            </YStack>
          </YStack>

          <YStack
            className="ms300 ease-in all"
            mr={-300}
            ml={-150}
            maxW={1000}
            mt={-125}
            pl={100}
            pr={300}
            pt={100}
            x={20}
            mb={-500}
            y={-20}
            style={{
              maskImage: `linear-gradient(rgba(0, 0, 0, 1) 40%, transparent 65%)`,
            }}
            $md={{
              mr: -400,
              mt: -150,
              scale: 0.9,
            }}
            $sm={{
              display: 'none',
            }}
          >
            <XStack
              pointerEvents="none"
              style={{
                transform: `rotate(4deg) scale(0.75)`,
              }}
              $sm={{
                mt: -85,
                mb: -60,
              }}
            >
              <YStack rounded="$4" shadowColor="rgba(0,0,0,0.1)" shadowRadius="$8">
                <ThemeTintAlt>
                  <Theme name="surface2">
                    <LocationNotification />
                  </Theme>
                </ThemeTintAlt>
              </YStack>

              <YStack
                position="absolute"
                z={1}
                l={0}
                style={{
                  clipPath: `polygon(0% 0%, 105% 0%, 65% 100%, 0% 100%)`,
                }}
              >
                <ThemeTintAlt>
                  <Theme name="surface1">
                    <LocationNotification />
                  </Theme>
                </ThemeTintAlt>
              </YStack>

              <YStack
                position="absolute"
                z={1}
                l={0}
                style={{
                  clipPath: `polygon(0% 0%, 75% 0%, 30% 100%, 0% 100%)`,
                }}
              >
                <ThemeTintAlt>
                  <LocationNotification />
                </ThemeTintAlt>
              </YStack>

              <YStack
                position="absolute"
                z={1}
                l={0}
                style={{
                  clipPath: `polygon(0% 0%, 45% 0%, 0% 100%, 0% 100%)`,
                }}
              >
                <LocationNotification />
              </YStack>

              <YStack
                position="absolute"
                z={-1}
                l="15%"
                scale={0.9}
                rotate="5deg"
                rounded="$4"
                shadowColor="rgba(0,0,0,0.1)"
                shadowRadius="$8"
              >
                <ThemeTint>
                  <Theme name="surface1">
                    <LocationNotification />
                  </Theme>
                </ThemeTint>
              </YStack>
            </XStack>
          </YStack>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}
