import { TamaguiIconSvg } from '@tamagui/logo'
import { Check } from '@tamagui/lucide-icons-2'
import { EnsureFlexed, H1, H5, Paragraph, Span, Text, XStack, YStack } from 'tamagui'
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
    ml={10}
    display="inline-block"
    verticalAlign="top"
    y={5}
    opacity={0.5}
  >
    ↗
  </Span>
)

// 540 of copy plus the gap plus the 460 code sample
const HERO_ROW_WIDTH = 1040

// each row is one short sentence, and only the object parts are linked, so the
// line reads as a claim rather than a bare label wearing a link
type FeaturePart = string | { label: string; href: string }

const features: FeaturePart[][] = [
  [
    'A ',
    { label: 'native runtime', href: '/docs/core/native' },
    ' with no re-renders at all.',
  ],
  [
    'An ',
    { label: 'optimizing compiler', href: '/docs/intro/compiler-install' },
    ' in Rust, flattening your tree.',
  ],
  [
    'A Rust ',
    { label: 'syntax and theme LSP', href: '/blog/version-three' },
    ' for every editor.',
  ],
  [
    { label: 'Bundler plugins', href: '/docs/guides/vite' },
    ' for Vite, Next, Metro, and Webpack.',
  ],
  [
    { label: 'React Strict DOM', href: '/docs/core/html-primitives' },
    ' primitives, real elements on the web.',
  ],
  [
    'Write ',
    { label: 'Tailwind classes', href: '/docs/core/tailwind' },
    ' on the same compiler.',
  ],
  [
    { label: 'Level-based themes', href: '/docs/core/surfaces' },
    ', nested as deep as you like.',
  ],
  [
    { label: 'Theme', href: '/docs/core/use-theme' },
    ' and ',
    { label: 'media hooks', href: '/docs/core/use-media' },
    ' with signal-like reads.',
  ],
  [
    { label: 'Animation drivers', href: '/docs/core/animation-drivers' },
    ' driven outside React.',
  ],
  [
    'A ',
    { label: '0-runtime mode', href: '/docs/guides/zero-runtime' },
    ' for plain CSS output.',
  ],
  [
    { label: 'Flat, typed style values', href: '/docs/guides/flat-values' },
    ' with conditions inline.',
  ],
  [{ label: 'Themes', href: '/docs/intro/themes' }, ' server rendered, with no flash.'],
]

export default function TamaguiHomePage() {
  return (
    <YStack gap="100px">
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
        pt="8"
        gap="8 gtMd:12"
        minH="auto gtMd:calc(90vh - 280px)"
        maxH="auto gtMd:940px"
        justify="center"
      >
        {/* the text column caps at the width its own copy wants, so the code
            sample sits next to the paragraphs instead of across a gap the
            growing column left behind */}
        <XStack
          flexDirection="column gtMd:row"
          items="center"
          justify="center"
          gap="8"
          width="100%"
          maxW={HERO_ROW_WIDTH}
          mx="auto"
        >
          <YStack flexGrow={1} flexShrink={1} gap="6" minW={0} maxW="640px">
            <EnsureFlexed />
            <XStack items="center" gap="4" mb="-4" mt="-3">
              <TamaguiIconSvg width={24} height={24} />
              <Link asChild href="/blog/version-three">
                <Text render="a" fontSize={13} color="color-12">
                  Version 3 is out ↗
                </Text>
              </Link>
            </XStack>

            <H1
              fontSize="22px gtXs:24px gtMd:26px"
              lineHeight="30px gtXs:34px gtMd:36px"
              fontWeight="600"
              letterSpacing={-0.2}
              textWrap="balance"
            >
              Fast on web. Fast on native.
              <br />
              Style all platforms, typed or Tailwind.
            </H1>

            <YStack gap="4" mt="-4">
              <Paragraph size="5" color="color-11">
                The fastest and most feature-complete style library for both web and React
                Native, now fully OSS across components, themes, patterns and starters. A
                new smarter compiler and new native runtime give you ideal performance on
                native and web.
              </Paragraph>

              <Paragraph size="5" color="color-11">
                Version three simplifies everything, aligns to web, then adds Tailwind,
                React Strict DOM, and some nice new components.
              </Paragraph>
            </YStack>

            <YStack gap="4">
              <XStack gap="3" items="center" flexWrap="wrap">
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
                    borderless
                    bg="transparent hover:color-2"
                    aria-label="Components docs"
                  >
                    <Button.Text fontWeight="600">
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
            </YStack>
          </YStack>

          <YStack maxW="640px" flexGrow={1} flexShrink={1}>
            <EnsureFlexed />
            <HomeStyleToggle />
          </YStack>
        </XStack>
      </YStack>

      <YStack
        maxW="640px gtMd:none"
        render="section"
        width="100%"
        mx="auto"
        px="4"
        pb="12 gtMd:16"
      >
        {/* the rows are much shorter than half of the hero's 1040, so two 50%
            columns across that width left the whole block sitting well left of
            centre with an empty gutter on the right. this is the width the copy
            actually wants, centered, and the heading shares its left edge */}
        <YStack self="center" width="100%" maxW={900} gap="5">
          <H5 size="6" color="color-12" fontWeight="700">
            Featuring
          </H5>

          {/* the `link` class is the site's blog underline: 2px at a 4px offset,
              thickening on hover. the decoration line and color have to come from
              props, because tamagui's Text sets text-decoration-line none at four
              times specificity and would otherwise hide the underline entirely */}
          <XStack className="link" flexWrap="wrap" rowGap="4">
            {features.map((parts, row) => (
              <XStack key={row} width="100% gtMd:50%" items="flex-start" gap="2-5">
                <YStack y={2} flexShrink={0}>
                  <Check size={18} color="color-4" />
                </YStack>
                <Text fontSize={15} lineHeight={22} color="color-9">
                  {parts.map((part, i) =>
                    typeof part === 'string' ? (
                      <Span key={i}>{part}</Span>
                    ) : (
                      <Link asChild key={i} href={part.href}>
                        <Text
                          render="a"
                          fontSize="inherit"
                          lineHeight="inherit"
                          color="color-11 hover:color-12"
                          textDecorationLine="underline"
                          textDecorationColor="yellow-3"
                        >
                          {part.label}
                        </Text>
                      </Link>
                    )
                  )}
                </Text>
              </XStack>
            ))}
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  )
}
