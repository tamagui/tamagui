// @ts-expect-error - bento component wildcard import
import { LocationNotification } from '@tamagui/bento/component/user/preferences/LocationNotification'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Button, Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'
import { BentoLogo } from '../features/bento/BentoLogo'
import { LoadCherryBomb } from '../features/site/fonts/LoadFonts'
import { useSubscriptionModal } from '../features/site/purchase/useSubscriptionModal'
import { ContainerLarge } from './Containers'

export const BentoHero = () => {
  const { showAppropriateModal } = useSubscriptionModal()

  return (
    <YStack position="relative" z={10}>
      <LoadCherryBomb />
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
                  text="center"
                  lineHeight={40}
                  color="$color11"
                  maxH={120}
                  $md={{
                    mt: '$6',
                    fontSize: 22,
                    lineHeight: 38,
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
                  color="$color7"
                  size="$5"
                  $md={{ size: '$3' }}
                >
                  One-time Purchase
                </Paragraph>

                <XStack items="center" justify="space-between">
                  <Spacer />
                  <Theme name="green">
                    <Button
                      className="box-3d all ease-in-out ms100"
                      size="$4"
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
                      <Button.Text fontFamily="$mono" size="$7" color="$color1">
                        Pro
                      </Button.Text>
                    </Button>
                  </Theme>
                </XStack>

                <Paragraph
                  fontFamily="$mono"
                  color="$color7"
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
