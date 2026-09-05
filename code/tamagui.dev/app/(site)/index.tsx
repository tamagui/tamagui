import { TamaguiIconSvg } from '@tamagui/logo'
import { H1, H2, Paragraph, Text, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { GithubIcon } from '~/features/icons/GithubIcon'
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
            <XStack items="center" gap="3">
              <TamaguiIconSvg width={48} height={48} />
              <Link asChild href="/blog/version-three">
                <Text
                  render="a"
                  fontFamily="mono"
                  fontSize={12}
                  color="color11 hover:color12"
                  letterSpacing={1}
                >
                  TAMAGUI / V3 BETA
                </Text>
              </Link>
            </XStack>

            <H1
              fontSize="40px gtXs:48px gtMd:60px"
              lineHeight="44px gtXs:52px gtMd:64px"
              fontWeight="600"
              letterSpacing={-1.8}
            >
              Your style.
              <br />
              Every platform.
            </H1>

            <Paragraph fontSize={18} lineHeight={29} color="color11" maxW={460}>
              Type-safe styles and customizable components for React and React Native,
              with an optimizing compiler built in.
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

          <YStack
            width="100% gtMd:400px"
            flexShrink={0}
            bg="color2"
            borderWidth={1}
            borderColor="color5"
            rounded={16}
            overflow="hidden"
          >
            <XStack height={3} bg="#edd400" />
            <XStack
              px="5"
              py="4"
              borderBottomWidth={1}
              borderColor="color5"
              justify="space-between"
            >
              <Text fontFamily="mono" fontSize={12} color="color11">
                Hello, Tamagui.
              </Text>
              <Text fontFamily="mono" fontSize={12} color="color10">
                web + native
              </Text>
            </XStack>
            <YStack px="4 gtMd:6" py="5 gtMd:6" gap="5">
              <Text
                render="pre"
                margin={0}
                fontFamily="mono"
                fontSize={12}
                lineHeight={24}
                color="color12"
              >
                <Text color="purple10">import</Text>
                {` { html } from `}
                <Text color="green10">'tamagui'</Text>
                {'\n\n'}
                <Text color="blue10">{'<html.button'}</Text>
                {'\n  padding='}
                <Text color="green10">{'"3"'}</Text>
                {'\n  rounded='}
                <Text color="green10">{'"4"'}</Text>
                {'\n  bg='}
                <Text color="green10">{'"background"'}</Text>
                {'\n  opacity='}
                <Text color="green10">{'"1 hover:0.8"'}</Text>
                {'\n'}
                <Text color="blue10">{'>'}</Text>
                {'\n  Make something yours\n'}
                <Text color="blue10">{'</html.button>'}</Text>
              </Text>
              <YStack borderTopWidth={1} borderColor="color5" pt="5">
                <Text fontSize={13} lineHeight={21} color="color11">
                  Familiar HTML. Shared styles. Native primitives.
                </Text>
                <Link asChild href="/docs/core/html-primitives">
                  <Text render="a" fontSize={13} color="color12" mt="3">
                    Explore HTML primitives ↗
                  </Text>
                </Link>
              </YStack>
            </YStack>
          </YStack>
        </XStack>

        <XStack
          flexDirection="column gtMd:row"
          gap="6"
          justify="space-between"
          items="center"
          py="6"
          borderTopWidth={1}
          borderBottomWidth={1}
          borderColor="color5"
        >
          <YStack gap="2">
            <H2 fontSize={18} lineHeight={25} letterSpacing={-0.3}>
              Start making it yours.
            </H2>
            <Paragraph fontSize={14} color="color11">
              A fresh app, ready for web and native.
            </Paragraph>
          </YStack>
          <InstallInput />
        </XStack>
      </YStack>
    </>
  )
}
