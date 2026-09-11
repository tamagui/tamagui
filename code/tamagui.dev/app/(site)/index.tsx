import { TamaguiIconSvg } from '@tamagui/logo'
import { H1, Paragraph, Text, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { PAGE_MAX_WIDTH } from '~/components/Containers'
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
        maxW={PAGE_MAX_WIDTH}
        mx="auto"
        px="4"
        pt="8 gtMd:12"
        pb="8"
        gap="8 gtMd:12"
        minH="calc(100vh - 100px)"
        justify="center"
      >
        {/* the text column caps at the width its own copy wants, so the code
            sample sits next to the paragraphs instead of across a gap the
            growing column left behind */}
        <XStack flexDirection="column gtMd:row" items="center" justify="center" gap="8">
          <YStack
            flexGrow={1}
            flexShrink={1}
            gap="6"
            minW={0}
            width="100%"
            maxW="gtMd:540px"
          >
            <TamaguiIconSvg width={24} height={24} />

            <H1
              fontSize="28px gtXs:32px gtMd:38px"
              lineHeight="34px gtXs:40px gtMd:46px"
              fontWeight="600"
              letterSpacing={0}
            >
              The style engine that feels great on native and web.
            </H1>

            <YStack gap="4">
              <Paragraph size="5" color="color-11">
                Tamagui is the only style library that gets you platform-native feel while
                going cross platform, now with Tailwind mode.
              </Paragraph>

              <Paragraph size="5" color="color-11">
                Version 3 gets faster and simpler with React Strict DOM, a new Rust
                optimizing compiler, and a 0-render native runtime. It's the fastest style
                engine there is on web or native.
              </Paragraph>
            </YStack>

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
                <Text render="a" fontSize={13} color="color-11 hover:color-12">
                  Explore the components ↗
                </Text>
              </Link>
              <Link asChild href="/docs/core/tailwind">
                <Text render="a" fontSize={13} color="color-11 hover:color-12">
                  Speaks Tailwind, too ↗
                </Text>
              </Link>
            </XStack>
          </YStack>

          <YStack width="100% gtMd:460px" flexShrink={0}>
            <HomeStyleToggle />
          </YStack>
        </XStack>
      </YStack>
    </>
  )
}
