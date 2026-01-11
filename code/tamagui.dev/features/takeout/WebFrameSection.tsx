import type React from 'react'
import { Image } from '@tamagui/image'
import { ThemeTintAlt } from '@tamagui/logo'
import { Dot } from '@tamagui/lucide-icons'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import {
  H3,
  Paragraph,
  SizableText,
  Theme,
  XStack,
  YStack,
  composeRefs,
  styled,
  useThemeName,
} from 'tamagui'
import { useHoverGlow } from '~/components/HoverGlow'
import { Link } from '~/components/Link'
import {
  useScrollProgress,
  WEB_FRAME_SCROLL_START,
  WEB_FRAME_SCROLL_END,
} from './useScrollProgress'

const pointsCards = [
  {
    title: 'Stack',
    icon: 'retro-icons/coding-apps-websites-module-21.svg',
    theme: 'orange',
    points: [
      'One framework - universal React routing.',
      'Zero real-time sync - instant updates.',
      'Better Auth - OAuth & email auth.',
    ],
  },
  {
    title: 'Scripts',
    icon: 'retro-icons/coding-apps-websites-programming-hold-code-9.svg',
    theme: 'yellow',
    points: [
      'bun tko CLI with built-in docs.',
      'Onboarding wizard for easy setup.',
      'Check, lint, and type commands.',
    ],
  },
  {
    title: 'Deploy',
    icon: 'retro-icons/computers-devices-electronics-vintage-mac-54.svg',
    theme: 'green',
    points: [
      'Uncloud for self-hosted (single command).',
      'SST for AWS serverless.',
      'GitHub Actions CI/CD ready.',
    ],
  },
  {
    title: 'Screens',
    icon: 'retro-icons/coding-app-website-ui-62.svg',
    theme: 'blue',
    points: [
      'Auth, onboarding, feed, profile.',
      'Settings and account management.',
      'Universal forms with validation.',
    ],
  },
  {
    title: 'Web',
    icon: 'retro-icons/coding-apps-websites-programming-browser-44.svg',
    theme: 'purple',
    points: [
      'Vite for lightning-fast HMR.',
      'SSR & static generation.',
      'Optimized production builds.',
    ],
  },
  {
    title: '& More',
    icon: 'retro-icons/design-color-painting-palette-25.svg',
    theme: 'red',
    points: [
      'Phosphor icons library.',
      'Vitest + Playwright tests.',
      'Private Discord + GitHub access.',
    ],
  },
]

const CodeInline = styled(Paragraph, {
  tag: 'code',
  fontFamily: '$mono',
  color: '$color12',
  bg: 'color-mix(in srgb, var(--color8) 50%, transparent 50%)' as any,
  cursor: 'inherit',
  rounded: '$3',
  fontSize: '85%' as any,
  p: '$1.5',
})

const Point = ({
  children,
  size = '$4',
}: { children: React.ReactNode; size?: string }) => {
  return (
    <XStack tag="li" items="flex-start" gap="$3">
      <YStack py="$1">
        <Dot size={14} color="$color10" />
      </YStack>
      <Paragraph color="$color" size={size as any}>
        {children}
      </Paragraph>
    </XStack>
  )
}

const PointsCard = ({
  title,
  icon,
  theme,
  points: cardPoints,
  index = 0,
}: {
  title: string
  icon: string
  theme: string
  points: string[]
  index?: number
}) => {
  const isDark = useThemeName().startsWith('dark')
  const isHydrated = useDidFinishSSR()
  const innerGlow = useHoverGlow({
    resist: 30,
    size: 300,
    strategy: 'blur',
    blurPct: 60,
    color: isDark ? 'var(--color1)' : 'var(--color4)',
    opacity: isDark ? 0.18 : 0.35,
    background: 'transparent',
    style: {
      transition: `all ease-out 300ms`,
    },
  })

  return (
    <Theme name={theme as any}>
      <YStack
        ref={composeRefs(innerGlow.parentRef) as any}
        minW={260}
        maxW={300}
        flex={1}
        elevation="$1"
        overflow="hidden"
        rounded="$5"
        p="$5"
        position="relative"
        bg="$background"
        borderWidth={1}
        borderColor="$borderColor"
      >
        {isHydrated && <innerGlow.Component />}

        <YStack gap="$4" z={100} position="relative">
          <XStack gap="$3" items="center">
            <Image
              className="pixelate"
              src={icon}
              alt={title}
              width={24}
              height={24}
              filter={isDark ? 'none' : 'invert(1)'}
            />
            <H3
              fontFamily="$mono"
              size="$5"
              letterSpacing={2}
              color="$color11"
              textTransform="uppercase"
            >
              {title}
            </H3>
          </XStack>

          <YStack gap="$2" tag="ul" p={0} m={0}>
            {cardPoints.map((point) => (
              <Point key={point} size="$3">
                {point}
              </Point>
            ))}
          </YStack>
        </YStack>
      </YStack>
    </Theme>
  )
}

export const WebFrameSection = () => {
  const isDark = useThemeName().startsWith('dark')
  const scrollProgress = useScrollProgress(WEB_FRAME_SCROLL_START, WEB_FRAME_SCROLL_END)

  const opacity = scrollProgress
  const y = 40 * (1 - scrollProgress)
  const scale = 0.97 + 0.03 * scrollProgress

  return (
    <YStack
      items="center"
      gap="$6"
      maxW={1200}
      mx="auto"
      opacity={opacity}
      y={y}
      scale={scale}
      className="ease-out ms500 all"
    >
      <YStack position="relative" width="100%">
        <XStack
          bg="$color3"
          borderTopLeftRadius="$4"
          borderTopRightRadius="$4"
          px="$4"
          py="$3"
          items="center"
          gap="$3"
          borderWidth={1}
          borderBottomWidth={0}
          borderColor="$borderColor"
        >
          <XStack gap="$2" pointerEvents="none" aria-hidden={true}>
            <YStack width={12} height={12} rounded={100} bg="#ff5f57" opacity={0.9} />
            <YStack width={12} height={12} rounded={100} bg="#febc2e" opacity={0.9} />
            <YStack width={12} height={12} rounded={100} bg="#28c840" opacity={0.9} />
          </XStack>

          <XStack
            flex={1}
            bg="$color2"
            rounded="$2"
            px="$3"
            py="$1.5"
            items="center"
            justify="center"
          >
            <SizableText size="$2" color="$color10" fontFamily="$mono">
              takeout.tamagui.dev/
            </SizableText>
          </XStack>
        </XStack>

        <YStack
          bg={isDark ? '$color2' : '$color3'}
          borderBottomLeftRadius="$4"
          borderBottomRightRadius="$4"
          borderWidth={1}
          borderTopWidth={0}
          borderColor="$borderColor"
          p="$6"
          gap="$8"
        >
          <YStack gap="$5" maxW={800} mx="auto">
            <ThemeTintAlt>
              <Paragraph
                className="text-wrap-balance"
                size="$6"
                $sm={{ size: '$5' }}
                text="center"
              >
                Takeout is a full-stack, cross-platform starter kit for building modern
                web and mobile apps with React Native. It funds the OSS development of
                Tamagui.
              </Paragraph>

              <Paragraph
                className="text-wrap-balance"
                size="$5"
                $sm={{ size: '$4' }}
                text="center"
                color="$color11"
              >
                Built on{' '}
                <Link href="https://onestack.dev" target="_blank">
                  One
                </Link>{' '}
                for universal routing,{' '}
                <Link href="https://zero.rocicorp.dev" target="_blank">
                  Zero
                </Link>{' '}
                for real-time sync, and{' '}
                <Link href="https://better-auth.com" target="_blank">
                  Better Auth
                </Link>{' '}
                for authentication. Deploy with a single command using Uncloud or SST.
                Includes <CodeInline>bun tko</CodeInline> CLI with built-in docs and
                scripts.
              </Paragraph>
            </ThemeTintAlt>
          </YStack>

          <ThemeTintAlt>
            <YStack height={1} bg="$color5" opacity={0.3} mx="$4" />
          </ThemeTintAlt>

          <YStack items="center" gap="$6">
            <ThemeTintAlt>
              <SizableText
                size="$8"
                fontFamily="$silkscreen"
                color="$color11"
                letterSpacing={3}
                text="center"
              >
                WHAT'S INCLUDED
              </SizableText>
            </ThemeTintAlt>

            <XStack flexWrap="wrap" gap="$4" justify="center">
              {pointsCards.map((card, index) => (
                <PointsCard key={card.title} {...card} index={index} />
              ))}
            </XStack>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  )
}
