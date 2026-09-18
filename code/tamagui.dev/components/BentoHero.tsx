import { Paragraph, Spacer, YStack } from 'tamagui'
import { BentoLogo } from '../features/bento/BentoLogo'
import { LoadCherryBomb } from '../features/site/fonts/LoadFonts'
import { ContainerLarge } from './Containers'

export const BentoHero = () => {
  return (
    <YStack position="relative" z={10}>
      <LoadCherryBomb />
      <ContainerLarge>
        <YStack mt={60} mb={40} z={100} width="100%" items="center">
          <YStack
            className="ms200 ease-in all"
            transformOrigin="center top"
            mb="xxs:-80px xs:-80px sm:-60px md:-100px"
            scale="xxs:0.4 xs:0.5 sm:0.6 md:0.72"
          >
            <BentoLogo />
          </YStack>

          <Spacer size="6" />

          <YStack maxW="500px sm:400px" gap="7" px="sm:4">
            <Paragraph
              fontFamily="mono"
              fontSize="22px md:22px"
              text="center"
              lineHeight="40px md:38px"
              color="color-11"
              maxH={120}
              mt="md:6"
            >
              Copy-paste UI for React&nbsp;Native and&nbsp;React web. Free, forever.
            </Paragraph>
          </YStack>
        </YStack>
      </ContainerLarge>
    </YStack>
  )
}
