// @ts-expect-error - bento component wildcard import
import { LocationNotification } from '@tamagui/bento/component/user/preferences/LocationNotification'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'
import { BentoLogo } from '../features/bento/BentoLogo'
import { LoadCherryBomb } from '../features/site/fonts/LoadFonts'
import { ContainerLarge } from './Containers'

export const BentoHero = () => {
  return (
    <YStack position="relative" z={10}>
      <LoadCherryBomb />
      <ContainerLarge>
        <XStack
          gap="8"
          pb="3"
          bg="transparent"
          justify="space-between"
          width="100%"
          flexDirection="max-md:column"
        >
          <YStack
            mb={40}
            mt={60}
            maxW="55% max-md:100%"
            z={100}
            justify="space-between"
            flex={10}
            items="flex-start max-md:center"
            minHeight="max-md:max-content"
          >
            <YStack
              className="ms200 ease-in all"
              transformOrigin="center top"
              mb="max-xs:-80px max-sm:-80px max-md:-60px max-lg:-100px"
              scale="max-xs:0.4 max-sm:0.5 max-md:0.6 max-lg:0.72"
              self="max-md:center"
            >
              <BentoLogo />
            </YStack>

            <Spacer size="8" />

            <YStack maxW="500px max-md:400px" gap="10" mx="auto" px="max-md:4">
              <XStack gap="8">
                <Paragraph
                  fontSize="22px max-lg:22px"
                  text="center"
                  lineHeight="40px max-lg:38px"
                  color="color-11"
                  maxH={120}
                  mt="max-lg:8"
                >
                  Copy-paste UI for React&nbsp;Native and&nbsp;React web. Free, forever.
                </Paragraph>
              </XStack>
            </YStack>
          </YStack>

          <YStack
            className="ms300 ease-in all"
            mr="-300px max-lg:-400px"
            ml={-150}
            maxW={1000}
            mt="-125px max-lg:-150px"
            pl={100}
            pr={300}
            pt={100}
            x={20}
            mb={-500}
            y={-20}
            scale="max-lg:0.9"
            display="max-md:none"
            style={{
              maskImage: `linear-gradient(rgba(0, 0, 0, 1) 40%, transparent 65%)`,
            }}
          >
            <XStack
              pointerEvents="none"
              mt="max-md:-85px"
              mb="max-md:-60px"
              style={{
                transform: `rotate(4deg) scale(0.75)`,
              }}
            >
              <YStack rounded="4" shadowColor="rgba(0,0,0,0.1)" shadowRadius="20">
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
                shadowRadius="20"
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
