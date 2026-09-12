import { TamaguiIconSvg } from '@tamagui/logo'
import { Check } from '@tamagui/lucide-icons-2'
import { H1, Paragraph, Span, Text, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { PAGE_MAX_WIDTH } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { HomeStyleToggle } from '~/features/site/home/HomeStyleToggle'
import { InstallInput } from '~/features/site/home/InstallInput'

// a superscript marker rather than a second word: at the label's own size it
// read as heavy as the label and sat on the baseline
const CtaArrow = () => (
  // verticalAlign top pins it to the line box, which sits above the cap line, so
  // the arrow floated off the top of the label. the nudge lands its top edge on
  // the top of the letters
  <Span
    fontSize={11}
    lineHeight={11}
    ml={1}
    display="inline-block"
    verticalAlign="top"
    y={5}
  >
    ↗
  </Span>
)

const features: { label: string; href: string }[][] = [
  [{ label: 'Native runtime', href: '/docs/core/native' }],
  [{ label: 'New Rust compiler', href: '/docs/intro/compiler-install' }],
  [{ label: 'React Strict DOM html.*', href: '/docs/core/html-primitives' }],
  [{ label: 'Tailwind support', href: '/docs/core/tailwind' }],
  [{ label: 'Level-based themes', href: '/docs/core/surfaces' }],
  [
    { label: 'Signal-like theme', href: '/docs/core/use-theme' },
    { label: 'media hooks', href: '/docs/core/use-media' },
  ],
  [{ label: '0-rerender animation drivers', href: '/docs/core/animation-drivers' }],
  [{ label: '0-runtime mode', href: '/docs/guides/zero-runtime' }],
  [{ label: 'Flat, typed style values', href: '/docs/guides/flat-values' }],
  [{ label: 'SSR safe nested themes', href: '/docs/intro/themes' }],
]

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
            <XStack items="center" gap="4">
              <TamaguiIconSvg width={24} height={24} />
              <Link asChild href="/blog/version-three">
                <Text render="a" fontSize={13} color="color-11 hover:color-12">
                  Version 3 is out ↗
                </Text>
              </Link>
            </XStack>

            <H1
              fontSize="28px gtXs:32px gtMd:38px"
              lineHeight="34px gtXs:40px gtMd:46px"
              fontWeight="600"
              letterSpacing={0}
            >
              The style engine that feels great on native and web.
            </H1>

            <YStack gap="4" mt="-4">
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

            <XStack gap="2" items="center" flexWrap="wrap">
              <Link asChild href="/docs/intro/introduction">
                <Button
                  render="a"
                  size="lg"
                  rounded={10}
                  bg="color"
                  color="background"
                  borderless
                  aria-label="Core docs"
                >
                  <Button.Text color="background" fontWeight="600">
                    Core
                    <CtaArrow />
                  </Button.Text>
                </Button>
              </Link>
              <Link asChild href="/ui/intro">
                <Button
                  render="a"
                  size="lg"
                  rounded={10}
                  bg="color"
                  color="background"
                  borderless
                  aria-label="Components docs"
                >
                  <Button.Text color="background" fontWeight="600">
                    Components
                    <CtaArrow />
                  </Button.Text>
                </Button>
              </Link>
              <Link asChild target="_blank" href="https://github.com/tamagui/tamagui">
                <Button
                  render="a"
                  size="lg"
                  rounded={10}
                  variant="quiet"
                  borderless
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

      {/* the hero width (540 + 32 + 460) plus this section's own side padding, so the list lines
          up with the copy above rather than the wider page container */}
      <YStack
        render="section"
        width="100%"
        maxW="gtMd:1064px"
        mx="auto"
        px="4"
        py="12 gtMd:16"
        gap="8"
      >
        <Paragraph size="5" color="color-11" maxW={540}>
          What you get, on every platform. Each one has a page in the docs.
        </Paragraph>

        <XStack flexWrap="wrap" rowGap="4">
          {features.map((feature) => (
            <XStack
              key={feature[0].href}
              width="100% gtSm:50%"
              pr="gtSm:8"
              items="flex-start"
              gap="3"
            >
              <YStack
                mt={3}
                width={16}
                height={16}
                rounded={4}
                borderWidth={1}
                borderColor="color-6"
                items="center"
                justify="center"
                flexShrink={0}
              >
                <Check size={11} color="color-9" />
              </YStack>
              <Text fontSize={15} lineHeight={22} color="color-12">
                {feature.map((link, i) => (
                  <Span key={link.href}>
                    {i > 0 ? ' and ' : ''}
                    <Link asChild href={link.href}>
                      <Text
                        render="a"
                        fontSize="inherit"
                        lineHeight="inherit"
                        color="color-12 hover:color-11"
                        textDecorationLine="underline"
                        textDecorationColor="color-6"
                      >
                        {link.label}
                      </Text>
                    </Link>
                  </Span>
                ))}
              </Text>
            </XStack>
          ))}
        </XStack>
      </YStack>
    </>
  )
}
