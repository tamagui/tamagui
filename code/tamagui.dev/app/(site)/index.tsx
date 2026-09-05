import { TamaguiIconSvg } from '@tamagui/logo'
import { H1, Paragraph, Text, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { HomeStyleToggle } from '~/features/site/home/HomeStyleToggle'
import { InstallInput } from '~/features/site/home/InstallInput'

export default function TamaguiHomePage() {
  return (
    <>
      <HeadInfo
        title="Tamagui"
        description="Type-safe styles for React and React Native, with an optimizing compiler and Tailwind compatibility."
      />

      <YStack
        render="main"
        width="100%"
        maxW={1080}
        mx="auto"
        px="5 gtMd:6"
        pt="8 gtMd:12"
        pb="8"
        gap="8 gtMd:12"
      >
        <XStack flexDirection="column gtMd:row" items="center" gap="10">
          <YStack flexGrow={1} flexShrink={1} gap="6" minW={0} width="100%">
            <TamaguiIconSvg width={48} height={48} />

            <H1
              fontSize="28px gtXs:32px gtMd:38px"
              lineHeight="34px gtXs:40px gtMd:46px"
              fontWeight="600"
              letterSpacing={0}
              maxW={520}
            >
              The style engine that feels native on native and web.
            </H1>

            <Paragraph fontSize={16} lineHeight={26} color="color11" maxW={520}>
              Tamagui v3 simplifies the core and adds Tailwind support. It's got a Rust
              powered optimizing compiler for best-in-class performance, and a new native
              runtime for best-in-class native runtime performance, too.
            </Paragraph>

            <XStack gap="3" items="center" flexWrap="wrap">
              <Link asChild href="/docs/intro/introduction">
                <Button
                  render="a"
                  size="lg"
                  rounded={10}
                  bg="color"
                  color="background"
                  aria-label="Get started (docs)"
                >
                  <Button.Text color="background" fontWeight="600">
                    Get started ↗
                  </Button.Text>
                </Button>
              </Link>
              <Link asChild target="_blank" href="https://github.com/tamagui/tamagui">
                <Button
                  render="a"
                  size="lg"
                  rounded={10}
                  variant="outlined"
                  aria-label="GitHub"
                >
                  <GithubIcon width={18} />
                  <Button.Text>GitHub</Button.Text>
                </Button>
              </Link>
            </XStack>

            <InstallInput />

            <XStack gap="5" flexWrap="wrap">
              <Link asChild href="/ui/button">
                <Text render="a" fontSize={13} color="color11 hover:color12">
                  Explore the components ↗
                </Text>
              </Link>
              <Link asChild href="/docs/core/tailwind">
                <Text render="a" fontSize={13} color="color11 hover:color12">
                  Speaks Tailwind, too ↗
                </Text>
              </Link>
            </XStack>
          </YStack>

          <YStack width="100% gtMd:400px" flexShrink={0}>
            <HomeStyleToggle />
          </YStack>
        </XStack>
      </YStack>
    </>
  )
}
