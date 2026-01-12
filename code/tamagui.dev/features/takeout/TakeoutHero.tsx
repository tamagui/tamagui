import { Image } from '@tamagui/image'
import { ThemeTintAlt } from '@tamagui/logo'
import { useClientValue, useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import {
  Button,
  H2,
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
import { isSafariMobile } from '~/features/site/purchase/helpers'
import { TakeoutLogo } from './TakeoutLogo'
import { useScrollProgress, HERO_SCROLL_END } from './useScrollProgress'

const featureCards = [
  {
    icon: 'retro-icons/coding-apps-websites-module-21.svg',
    title: 'Cross-platform',
    desc: 'Web, iOS, Android',
    theme: 'orange',
  },
  {
    icon: 'retro-icons/coding-apps-websites-mobile-47.svg',
    title: 'Native feel',
    desc: 'Real native components',
    theme: 'green',
  },
  {
    icon: 'retro-icons/coding-apps-websites-programming-hold-code-9.svg',
    title: 'One codebase',
    desc: 'Shared code everywhere',
    theme: 'blue',
  },
  {
    icon: 'retro-icons/design-color-painting-palette-25.svg',
    title: 'DRY & Simple',
    desc: 'Less code, more power',
    theme: 'purple',
  },
] as const

const leftSideCards = [
  {
    icon: 'retro-icons/coding-apps-websites-live-status-4.svg',
    title: 'Zero Sync',
    desc: 'Real-time data sync across all devices',
    theme: 'orange',
  },
  {
    icon: 'retro-icons/coding-apps-websites-programming-browser-44.svg',
    title: 'bun tko CLI',
    desc: 'Built-in docs, scripts & onboarding wizard',
    theme: 'green',
  },
]

const rightSideCards = [
  {
    icon: 'retro-icons/coding-apps-websites-plugin-33.svg',
    title: 'Hot Updates',
    desc: 'Push OTA updates without app store review',
    theme: 'blue',
  },
  {
    icon: 'retro-icons/coding-apps-websites-favorite-rate-5.svg',
    title: 'Pro Access',
    desc: 'Private GitHub repo & Discord support',
    theme: 'purple',
  },
]

const tabBarItems = [
  { icon: 'retro-icons/coding-app-website-ui-62.svg', label: 'Home' },
  { icon: 'retro-icons/search-coding-49.svg', label: 'Search' },
  { icon: 'retro-icons/coding-apps-websites-favorite-rate-5.svg', label: 'Favorites' },
  { icon: 'retro-icons/coding-apps-websites-setting-computer-19.svg', label: 'Settings' },
]

const floatingIcons = [
  {
    icon: '/takeout/pixel-icons/script.svg',
    alt: 'Scripts & CLI',
    x: -400,
    y: -380,
    toPhone: true,
    targetX: -75,
  },
  {
    icon: '/takeout/pixel-icons/start-up.svg',
    alt: 'Quick startup',
    x: 400,
    y: -320,
    toPhone: true,
    targetX: -25,
  },
  {
    icon: '/takeout/pixel-icons/calendar.svg',
    alt: 'Scheduling',
    x: -530,
    y: -50,
    toPhone: true,
    targetX: 25,
  },
  {
    icon: '/takeout/pixel-icons/trophy.svg',
    alt: 'Achievement',
    x: 450,
    y: 20,
    toPhone: true,
    targetX: 75,
  },
  {
    icon: '/takeout/pixel-icons/lightning-bolt.svg',
    alt: 'Fast performance',
    x: -460,
    y: -220,
    toPhone: false,
  },
  {
    icon: '/takeout/pixel-icons/disco-ball.svg',
    alt: 'Modern stack',
    x: 370,
    y: -160,
    toPhone: false,
  },
  {
    icon: '/takeout/pixel-icons/crown.svg',
    alt: 'Premium',
    x: -360,
    y: 100,
    toPhone: false,
  },
  {
    icon: '/takeout/pixel-icons/heart-eyes.svg',
    alt: 'Developer experience',
    x: 240,
    y: 100,
    toPhone: false,
  },
]

const FeatureCardFrame = styled(YStack, {
  width: '100%',
  elevation: '$0.5',
  overflow: 'hidden',
  rounded: '$4',
  p: '$4',
  position: 'relative',
})

const SideFeatureCardFrame = styled(YStack, {
  width: 250,
  elevation: '$1',
  overflow: 'hidden',
  rounded: '$5',
  p: '$4',
  position: 'relative',
  bg: '$background02',
  borderWidth: 1,
  borderColor: '$borderColor',
})

const FeatureCard = ({
  icon,
  title,
  desc,
  theme,
}: {
  icon: string
  title: string
  desc: string
  theme: string
}) => {
  const isDark = useThemeName().startsWith('dark')
  const isHydrated = useDidFinishSSR()
  const innerGlow = useHoverGlow({
    resist: 30,
    size: 200,
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
      <FeatureCardFrame ref={composeRefs(innerGlow.parentRef) as any}>
        {isHydrated && <innerGlow.Component />}

        <XStack gap="$4" items="center" z={100} position="relative">
          <Image
            src={icon}
            alt={title}
            width={28}
            height={28}
            className="pixelate"
            filter={isDark ? 'none' : 'invert(1)'}
          />
          <YStack flex={1} gap="$1">
            <H2
              fontFamily="$mono"
              size="$4"
              letterSpacing={2}
              color="$color10"
              $theme-light={{
                color: '$color11',
              }}
            >
              {title}
            </H2>
            <SizableText size="$2" color="$color10">
              {desc}
            </SizableText>
          </YStack>
        </XStack>
      </FeatureCardFrame>
    </Theme>
  )
}

const SideFeatureCard = ({
  icon,
  title,
  desc,
  theme,
  rotate = 0,
  scrollProgress,
  delay = 0,
}: {
  icon: string
  title: string
  desc: string
  theme: string
  rotate?: number
  scrollProgress: number
  delay?: number
}) => {
  const isDark = useThemeName().startsWith('dark')
  const isHydrated = useDidFinishSSR()
  const innerGlow = useHoverGlow({
    resist: 30,
    size: 250,
    strategy: 'blur',
    blurPct: 60,
    color: isDark ? 'var(--color1)' : 'var(--color4)',
    opacity: isDark ? 0.18 : 0.35,
    background: 'transparent',
    style: {
      transition: `all ease-out 300ms`,
    },
  })

  const showProgress = Math.max(0, Math.min(1, (scrollProgress - 0.5 - delay) * 3))
  const opacity = showProgress
  const slideX = rotate > 0 ? 50 * (1 - showProgress) : -50 * (1 - showProgress)

  return (
    <Theme name={theme as any}>
      <SideFeatureCardFrame
        ref={composeRefs(innerGlow.parentRef) as any}
        rotate={`${rotate}deg`}
        opacity={opacity}
        x={slideX}
        className="ease-out ms500 all"
      >
        {isHydrated && <innerGlow.Component />}

        <YStack gap="$3" z={100} position="relative">
          <Image
            src={icon}
            alt={title}
            width={32}
            height={32}
            className="pixelate"
            filter={isDark ? 'none' : 'invert(1)'}
          />
          <YStack gap="$1">
            <H2
              fontFamily="$mono"
              size="$3"
              letterSpacing={2}
              color="$color10"
              $theme-light={{
                color: '$color11',
              }}
            >
              {title}
            </H2>
            <SizableText size="$2" color="$color10">
              {desc}
            </SizableText>
          </YStack>
        </YStack>
      </SideFeatureCardFrame>
    </Theme>
  )
}

const FloatingIcon = ({
  icon,
  alt,
  initialX,
  initialY,
  toPhone,
  targetX,
  scrollProgress,
}: {
  icon: string
  alt: string
  initialX: number
  initialY: number
  toPhone: boolean
  targetX?: number
  scrollProgress: number
}) => {
  const progress = Math.min(1, Math.max(0, scrollProgress))

  let x = initialX
  let y = initialY
  let opacity = 1
  let scale = 1
  const startScale = 1.05

  if (toPhone && targetX !== undefined) {
    const targetY = 120
    x = initialX + (targetX - initialX) * progress
    y = initialY + (targetY - initialY) * progress
    scale = startScale - progress * 0.35
  } else {
    x = initialX * (1 + progress * 0.5)
    y = initialY - progress * 400
    opacity = 1 - progress * 0.8
    scale = startScale - progress * 0.65
  }

  return (
    <YStack
      position="absolute"
      x={x}
      y={y}
      opacity={opacity}
      scale={scale}
      className="ease-out ms500 all"
      pointerEvents="none"
    >
      <Image src={icon} alt={alt} width={56} height={56} />
    </YStack>
  )
}

const FloatingIcons = ({ scrollProgress }: { scrollProgress: number }) => {
  return (
    <>
      {floatingIcons.map((item, i) => (
        <FloatingIcon
          key={i}
          icon={item.icon}
          alt={item.alt}
          initialX={item.x}
          initialY={item.y}
          toPhone={item.toPhone}
          targetX={item.targetX}
          scrollProgress={scrollProgress}
        />
      ))}
    </>
  )
}

const IPhoneFrame = ({ scrollProgress }: { scrollProgress: number }) => {
  const isDark = useThemeName().startsWith('dark')
  const phoneY = scrollProgress * 80

  return (
    <YStack items="center" position="relative" y={phoneY} className="ease-out ms300 all">
      <FloatingIcons scrollProgress={scrollProgress} />

      <YStack
        position="absolute"
        l={-280}
        t={280}
        gap="$4"
        pointerEvents="auto"
        $md={{ display: 'none' }}
      >
        {leftSideCards.map((card, i) => (
          <SideFeatureCard
            key={card.title}
            {...card}
            rotate={-6}
            scrollProgress={scrollProgress}
            delay={i * 0.1}
          />
        ))}
      </YStack>

      <YStack
        position="absolute"
        r={-280}
        t={280}
        gap="$4"
        pointerEvents="auto"
        $md={{ display: 'none' }}
      >
        {rightSideCards.map((card, i) => (
          <SideFeatureCard
            key={card.title}
            {...card}
            rotate={6}
            scrollProgress={scrollProgress}
            delay={i * 0.1}
          />
        ))}
      </YStack>

      <Theme name="orange">
        <YStack
          position="absolute"
          width={500}
          height={500}
          rounded={1000}
          bg="$color5"
          opacity={isDark ? 0.3 : 0.5}
          t="50%"
          l="50%"
          x={-250}
          y={-250}
          z={0}
          style={{
            filter: 'blur(60px)',
          }}
        />
      </Theme>

      <YStack position="relative" width={360} height={730}>
        <YStack
          position="absolute"
          t={10}
          l={10}
          r={10}
          b={10}
          rounded="$9"
          overflow="hidden"
          z={1}
        >
          <YStack flex={1} p="$4" pt="$6" gap="$3">
            <YStack gap="$1.5" items="center" z={100} mt="$2">
              <SizableText
                size="$7"
                fontFamily="$silkscreen"
                color="$color"
                letterSpacing={2}
              >
                FEATURES
              </SizableText>
              <SizableText size="$2" color="$color10" fontFamily="$mono" opacity={0.8}>
                Your app, ready to ship
              </SizableText>
            </YStack>

            <YStack gap="$3" flex={1} justify="center" pointerEvents="auto">
              {featureCards.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </YStack>
          </YStack>
        </YStack>

        <XStack
          position="absolute"
          b={28}
          l={36}
          r={36}
          py="$2"
          px="$3"
          justify="space-around"
          items="center"
          rounded="$10"
          className="blur-medium"
          z={1}
          borderWidth={1}
          borderColor="$borderColor"
        >
          <YStack
            position="absolute"
            fullscreen
            rounded="$10"
            bg="$color2"
            opacity={0.7}
          />
          {tabBarItems.map((tab, index) => (
            <YStack
              key={tab.label}
              items="center"
              opacity={index === 0 ? 1 : 0.6}
              p="$1.5"
              cursor="pointer"
              transition="quick"
              hoverStyle={{ opacity: 1, scale: 1.1 }}
              aria-label={tab.label}
            >
              <Image
                src={tab.icon}
                alt={tab.label}
                width={20}
                height={20}
                className="pixelate"
                filter={isDark ? 'none' : 'invert(1)'}
              />
            </YStack>
          ))}
        </XStack>

        <Image
          src="/takeout/iphone-frame.png"
          alt="iPhone frame"
          width={360}
          height={730}
          position="absolute"
          t={0}
          l={0}
          z={2}
          pointerEvents="none"
        />
      </YStack>
    </YStack>
  )
}

export const heroHeight = 1050

export const TakeoutHero = () => {
  const enable3d = useClientValue(
    () => !isSafariMobile && !window.location.search?.includes('disable-3d')
  )

  const scrollProgress = useScrollProgress(0, HERO_SCROLL_END)

  return (
    <YStack
      y={heroHeight / 2 - 500}
      items="center"
      justify="center"
      className="ease-in ms300 all"
      pointerEvents="none"
      position="relative"
      scale={1}
      $xxs={{
        scale: 0.35,
      }}
      $xs={{
        scale: 0.45,
        y: 0,
      }}
      $sm={{
        scale: 0.65,
        y: 0,
      }}
      $md={{
        scale: 0.85,
        y: '20%',
      }}
    >
      <TakeoutLogo />

      <ThemeTintAlt>
        <Paragraph
          color="$color11"
          size="$6"
          fontFamily="$mono"
          fontWeight="bold"
          letterSpacing={1}
          text="center"
          opacity={0.9}
        >
          Full-stack, cross-platform starter kit
        </Paragraph>
      </ThemeTintAlt>

      <Link
        href="https://takeout.tamagui.dev/docs/introduction"
        target="_blank"
        mt="$3"
        pointerEvents="auto"
      >
        <Button
          aria-label="View Documentation"
          cursor="pointer"
          transition="quick"
          hoverStyle={{ scale: 1.05, opacity: 0.9 }}
          pressStyle={{ scale: 0.98 }}
        >
          <Button.Text fontFamily="$silkscreen">Docs &raquo;</Button.Text>
        </Button>
      </Link>

      <YStack mt="$6" pointerEvents="auto">
        <IPhoneFrame scrollProgress={scrollProgress} />
      </YStack>
    </YStack>
  )
}
