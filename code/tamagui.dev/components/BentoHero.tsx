// @ts-expect-error - bento component wildcard import
import { LocationNotification } from '@tamagui/bento/component/user/preferences/LocationNotification'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
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
          gap="6"
          pb="3"
          bg="transparent"
          justify="space-between"
          width="100%"
          flexDirection="sm:column"
        >
          <YStack
            mb={40}
            mt={60}
            maxW="55% sm:100%"
            z={100}
            justify="space-between"
            flex={10}
            items="flex-start sm:center"
            minHeight="sm:max-content"
          >
            <YStack
              className="ms200 ease-in all"
              transformOrigin="center top"
              mb="xxs:-80px xs:-80px sm:-60px md:-100px"
              scale="xxs:0.4 xs:0.5 sm:0.6 md:0.72"
              self="sm:center"
            >
              <BentoLogo />
            </YStack>

            <Spacer size="6" />

            <YStack maxW="500px sm:400px" gap="7" mx="auto" px="sm:4">
              <XStack gap="6">
                <Paragraph
                  fontFamily="mono"
                  fontSize="22px md:22px"
                  text="center"
                  lineHeight="40px md:38px"
                  color="color11"
                  maxH={120}
                  mt="md:6"
                >
                  Copy-paste UI for React&nbsp;Native and&nbsp;React web, free and paid.
                </Paragraph>
              </XStack>
              <XStack
                justify="space-between"
                items="center"
                marginLeft="8 md:0px"
                marginRight="4 md:0px"
                flexDirection="md:column"
                gap="md:3"
              >
                <Paragraph
                  fontFamily="mono"
                  color="color7"
                  fontSize="md:3"
                  lineHeight="md:3"
                  size="5"
                >
                  One-time Purchase
                </Paragraph>

                <XStack items="center" justify="space-between">
                  <Spacer />
                  <Theme name="green">
                    <Button
                      className="box-3d all ease-in-out ms100"
                      size="4"
                      self="flex-end"
                      mr="4"
                      bg="color9 hover:color10 press:color9"
                      outlineColor="background02 hover:background04 press:background06"
                      borderColor="hover:color11"
                      outlineOffset={2}
                      outlineWidth={3}
                      outlineStyle="solid"
                      onPress={() => {
                        showAppropriateModal()
                      }}
                    >
                      <Button.Text fontFamily="mono" size="5" color="color1">
                        Pro
                      </Button.Text>
                    </Button>
                  </Theme>
                </XStack>

                <Paragraph
                  fontFamily="mono"
                  color="color7"
                  fontSize="md:3"
                  lineHeight="md:3"
                  size="5"
                >
                  Lifetime rights
                </Paragraph>
              </XStack>
            </YStack>
          </YStack>

          <YStack
            className="ms300 ease-in all"
            mr="-300px md:-400px"
            ml={-150}
            maxW={1000}
            mt="-125px md:-150px"
            pl={100}
            pr={300}
            pt={100}
            x={20}
            mb={-500}
            y={-20}
            scale="md:0.9"
            display="sm:none"
            style={{
              maskImage: `linear-gradient(rgba(0, 0, 0, 1) 40%, transparent 65%)`,
            }}
          >
            <XStack
              pointerEvents="none"
              mt="sm:-85px"
              mb="sm:-60px"
              style={{
                transform: `rotate(4deg) scale(0.75)`,
              }}
            >
              <YStack rounded="4" shadowColor="rgba(0,0,0,0.1)" shadowRadius="8">
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
                rounded="4"
                shadowColor="rgba(0,0,0,0.1)"
                shadowRadius="8"
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
