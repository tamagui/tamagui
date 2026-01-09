import { Image } from '@tamagui/image'
import { ThemeTint, ThemeTintAlt, useTint } from '@tamagui/logo'
import { Dot } from '@tamagui/lucide-icons'
import { useClientValue, useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { Suspense, lazy, memo, useEffect, useMemo, useState } from 'react'
import {
  AnimatePresence,
  Button,
  H2,
  H3,
  Paragraph,
  SizableText,
  Theme,
  XStack,
  YStack,
  composeRefs,
  isClient,
  styled,
  useThemeName,
} from 'tamagui'
import { useHoverGlow } from '~/components/HoverGlow'
import { ContainerLarge } from '~/components/Containers'
import { ErrorBoundary } from '~/components/ErrorBoundary'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { Footer } from '~/features/site/Footer'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { PurchaseButton, isSafariMobile } from '~/features/site/purchase/helpers'
import { TakeoutLogo } from '~/features/takeout/TakeoutLogo'
import { VersionComparison } from '~/features/takeout/VersionComparison'
import { PageThemeCarousel } from '../../features/site/PageThemeCarousel'
import { useSubscriptionModal } from '../../features/site/purchase/useSubscriptionModal'
import { ThemeNameEffect } from '../../features/site/theme/ThemeNameEffect'
import type React from 'react'

const TakeoutBox3D = lazy(() => import('../../features/takeout/TakeoutBox3D'))

// Import gallery store and dialog for opening gallery from screenshots
import {
  useGalleryStore,
  TakeoutGalleryDialog,
} from '../../features/takeout/TakeoutGallery'

const heroHeight = 1050

// Scroll progress thresholds
const HERO_SCROLL_END = 150
const WEB_FRAME_SCROLL_START = heroHeight - 200
const WEB_FRAME_SCROLL_END = heroHeight + 50

// Custom hook for scroll-based animations
const useScrollProgress = (start = 0, end = 150) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const newProgress = Math.max(0, Math.min(1, (scrollY - start) / (end - start)))
      setProgress(newProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [start, end])

  return progress
}

// Custom hook for raw scroll position tracking
const useScrollPosition = (offset = 0) => {
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      const sy = document.documentElement?.scrollTop ?? 0
      setScrollTop(sy + offset)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return scrollTop
}

export default function TakeoutPage() {
  const { showAppropriateModal, subscriptionStatus } = useSubscriptionModal()
  const isProUser = subscriptionStatus?.pro
  const { tint } = useTint()

  return (
    <YStack maxW="100%" overflow="hidden">
      <ThemeNameEffect colorKey="$color5" />
      <LoadCherryBomb />
      <PinnedNote />
      <HeadInfo
        title="🥡 Tamagui Takeout"
        description="Tamagui Takeout React Native Bootstrap Starter Kit"
        openGraph={{
          url: 'https://tamagui.dev/takeout',
          images: [
            {
              url: 'https://tamagui.dev/takeout/social.png',
            },
          ],
        }}
      />

      <PageThemeCarousel />

      <TakeoutGlow />

      <ThemeTintAlt>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background:
              'linear-gradient(140deg, var(--color02), var(--color0), var(--color0), var(--color0))',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      <YStack
        className="grain"
        fullscreen
        t={-60}
        b={0}
        opacity={0.5}
        $theme-light={{
          opacity: 0.8,
          filter: 'invert(1)',
        }}
        z={0}
        style={{
          imageRendering: 'pixelated',
        }}
      />

      <ThemeTintAlt offset={0}>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={-100}
          mixBlendMode="color-burn"
          b={0}
          style={{
            background: 'linear-gradient(10deg, var(--color5), var(--color1))',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      <ThemeTintAlt offset={3}>
        <YStack
          position="absolute"
          l={0}
          r={0}
          t={-100}
          b={0}
          style={{
            background:
              'linear-gradient(140deg, var(--color02), var(--color0), var(--color0), var(--color0))',
          }}
          z={-3}
        />
      </ThemeTintAlt>

      {/* Light mode banding effect with darker background */}
      <YStack
        position="absolute"
        l={0}
        r={0}
        t={-100}
        b={0}
        z={-2}
        opacity={0}
        $theme-light={{
          opacity: 1,
        }}
        style={{
          background:
            'linear-gradient(180deg, var(--color6) 0%, var(--color4) 30%, var(--color5) 50%, var(--color4) 70%, var(--color6) 100%)',
        }}
      />

      <YStack
        pointerEvents="none"
        position="absolute"
        t={-950}
        l="50%"
        x={-300}
        scale={1}
        rotate="120deg"
        opacity={0.02}
        $theme-light={{
          opacity: 0.12,
        }}
        z={-1}
      >
        <Image alt="mandala" width={2500} height={2500} src="/takeout/geometric.svg" />
      </YStack>

      {/* gradient on the end of the page */}
      <ThemeTint>
        <YStack
          z={-1}
          fullscreen
          style={{
            background: `linear-gradient(to bottom, transparent, transparent, var(--color2))`,
          }}
        />
      </ThemeTint>

      <ContainerLarge px={0}>
        <YStack height={0} maxH={0}>
          <YStack position="absolute" t={30} r="2%">
            <PurchaseButton
              onPress={() => {
                showAppropriateModal()
              }}
              size="$4"
              theme={tint as any}
            >
              {isProUser ? 'Plus | Free' : 'Buy Now'}
            </PurchaseButton>
          </YStack>

          <TakeoutHero />
        </YStack>

        {/* Section Title */}
        <YStack mt={heroHeight + 350} items="center" px="$4">
          <ThemeTintAlt>
            <SizableText
              size="$10"
              fontFamily="$silkscreen"
              color="$color11"
              letterSpacing={2}
              text="center"
              $sm={{ size: '$8' }}
            >
              FROM IDEA TO PRODUCTION
            </SizableText>
          </ThemeTintAlt>
        </YStack>

        {/* Web Frame Section - contains all feature content */}
        <YStack mt="$8" px="$4">
          <WebFrameSection />
        </YStack>

        {/* Version Comparison Section */}
        <YStack mt="$10" px="$4" maxW={1000} mx="auto" width="100%" gap="$6">
          <ThemeTintAlt>
            <SizableText
              size="$8"
              fontFamily="$silkscreen"
              color="$color11"
              letterSpacing={3}
              text="center"
            >
              PICK YOUR VERSION
            </SizableText>
          </ThemeTintAlt>
          <VersionComparison />
        </YStack>

        {/* Video Demo Section */}
        <YStack mt="$10" px="$4">
          <VideoSection />
        </YStack>

        {/* Screenshot Gallery */}
        <YStack mt="$10" px="$4">
          <ScreenshotGallery />
        </YStack>

        <Footer />
      </ContainerLarge>
    </YStack>
  )
}

// Floating pinned note component - appears with WebFrameSection
const PinnedNote = () => {
  const scrollProgress = useScrollProgress(WEB_FRAME_SCROLL_START, WEB_FRAME_SCROLL_END)

  const opacity = scrollProgress
  const x = 30 * (1 - scrollProgress)

  return (
    <YStack
      //@ts-ignore
      position="fixed"
      t={100}
      r={20}
      z={1000}
      rotate="-3deg"
      opacity={opacity}
      x={x}
      className="ease-out ms500 all"
      $md={{ r: 10 }}
      $sm={{ display: 'none' }}
    >
      {/* Pin icon */}
      <Image
        src="/takeout/pixel-icons/pin.png"
        alt="Pin"
        width={36}
        height={36}
        position="absolute"
        t={-18}
        l="50%"
        x={-18}
        z={1}
      />
      <Theme name="orange">
        <YStack
          bg="$color4"
          px="$4"
          py="$5"
          pt="$6"
          pb="$6"
          elevation="$2"
          width={120}
          minH={100}
          justify="center"
          style={{
            boxShadow: '2px 3px 8px rgba(0,0,0,0.15)',
          }}
        >
          <SizableText
            size="$3"
            fontFamily="$mono"
            color="$color12"
            fontWeight="500"
            text="center"
            lineHeight="$4"
          >
            Buy ONE get TWO
          </SizableText>
        </YStack>
      </Theme>
    </YStack>
  )
}

const TakeoutHero = () => {
  const enable3d = useClientValue(
    () => !isSafariMobile && !window.location.search?.includes('disable-3d')
  )

  // Track scroll progress for floating icons animation
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

      {/* Tagline description */}
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
        mt="$3"
        pointerEvents="auto"
      >
        <Button aria-label="Documentations" cursor="pointer">
          <Button.Text fontFamily="$silkscreen">Docs &raquo;</Button.Text>
        </Button>
      </Link>

      {/* iPhone Frame right after description */}
      <YStack mt="$6" pointerEvents="auto">
        <IPhoneFrame scrollProgress={scrollProgress} />
      </YStack>

      {/* 3D Takeout Box - temporarily disabled */}
      {/* <YStack
        position="absolute"
        pointerEvents="none"
        t={200}
        r={0}
        $md={{ r: -150 }}
        z={-1}
      >
        {enable3d && (
          <Suspense fallback={null}>
            <ErrorBoundary noMessage>
              <TakeoutBox3D />
            </ErrorBoundary>
          </Suspense>
        )}
      </YStack> */}
    </YStack>
  )
}

// Feature cards data
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

// Side feature cards that appear when scrolling - focus on developer benefits
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

const FeatureCardFrame = styled(YStack, {
  width: '100%',
  elevation: '$0.5',
  overflow: 'hidden',
  rounded: '$4',
  p: '$4',
  position: 'relative',
})

// Side feature card frame
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

// Side feature card component (for cards beside the phone)
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

  // Cards fade in and slide in when scroll progress is high enough
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

// Bottom tab bar icons
const tabBarItems = [
  { icon: 'retro-icons/coding-app-website-ui-62.svg', label: 'Home' },
  { icon: 'retro-icons/search-coding-49.svg', label: 'Search' },
  { icon: 'retro-icons/coding-apps-websites-favorite-rate-5.svg', label: 'Favorites' },
  { icon: 'retro-icons/coding-apps-websites-setting-computer-19.svg', label: 'Settings' },
]

// Floating icons data - randomly placed around the hero
// toPhone icons will animate into a row under the phone header
const floatingIcons = [
  // Icons that animate INTO the phone (under header) - script, start-up, calendar, trophy
  {
    icon: '/takeout/pixel-icons/script.png',
    x: -400,
    y: -380,
    toPhone: true,
    targetX: -75,
  },
  {
    icon: '/takeout/pixel-icons/start-up.png',
    x: 400,
    y: -320,
    toPhone: true,
    targetX: -25,
  },
  {
    icon: '/takeout/pixel-icons/calendar.png',
    x: -530,
    y: -50,
    toPhone: true,
    targetX: 25,
  },
  { icon: '/takeout/pixel-icons/trophy.png', x: 450, y: 20, toPhone: true, targetX: 75 },
  // Icons that float AWAY when scrolling
  { icon: '/takeout/pixel-icons/lightning-bolt.png', x: -460, y: -220, toPhone: false },
  { icon: '/takeout/pixel-icons/disco-ball.png', x: 370, y: -160, toPhone: false },
  { icon: '/takeout/pixel-icons/crown.png', x: -360, y: 100, toPhone: false },
  { icon: '/takeout/pixel-icons/heart-eyes.png', x: 240, y: 100, toPhone: false },
]

const FloatingIcon = ({
  icon,
  initialX,
  initialY,
  toPhone,
  targetX,
  scrollProgress,
}: {
  icon: string
  initialX: number
  initialY: number
  toPhone: boolean
  targetX?: number
  scrollProgress: number
}) => {
  // Calculate animated position based on scroll
  // toPhone icons move into a row under the phone header, others move up and away
  const progress = Math.min(1, Math.max(0, scrollProgress))

  let x = initialX
  let y = initialY
  let opacity = 1
  let scale = 1

  // Start bigger (1.05x), shrink to normal size (0.7x) for toPhone icons
  // Start bigger (1.05x), shrink and fade for away icons
  const startScale = 1.05

  if (toPhone && targetX !== undefined) {
    // Animate to target position in a row under phone header (y ~120 from phone center)
    const targetY = 120
    x = initialX + (targetX - initialX) * progress
    y = initialY + (targetY - initialY) * progress
    // Scale from 1.05 down to 0.7 (smaller size in phone)
    scale = startScale - progress * 0.35
  } else {
    // Move up and away (further up)
    x = initialX * (1 + progress * 0.5)
    y = initialY - progress * 400
    opacity = 1 - progress * 0.8
    // Scale from 1.05 down to smaller
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
      <Image src={icon} alt="Feature icon" width={56} height={56} />
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
  // Move phone down when scrolling so icons under header are visible
  const phoneY = scrollProgress * 80

  return (
    <YStack items="center" position="relative" y={phoneY} className="ease-out ms300 all">
      {/* Floating retro icons around the phone */}
      <FloatingIcons scrollProgress={scrollProgress} />

      {/* Left side feature cards */}
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

      {/* Right side feature cards */}
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

      {/* Big orange circle highlight behind the phone */}
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

      {/* Container for frame and content */}
      <YStack position="relative" width={360} height={730}>
        {/* Content inside the phone screen - behind the frame */}
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
          {/* Screen content area */}
          <YStack flex={1} p="$4" pt="$6" gap="$3">
            {/* App header inside phone */}
            <YStack gap="$1" items="center" z={100} mt="$2">
              <SizableText
                size="$6"
                fontFamily="$silkscreen"
                color="$color"
                letterSpacing={2}
              >
                FEATURES
              </SizableText>
              <SizableText size="$2" color="$color10" fontFamily="$mono">
                Your app, ready to ship
              </SizableText>
            </YStack>

            {/* Feature cards */}
            <YStack gap="$3" flex={1} justify="center" pointerEvents="auto">
              {featureCards.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </YStack>
          </YStack>
        </YStack>

        {/* Bottom Tab Bar - floating with blur */}
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
              opacity={index === 0 ? 1 : 0.5}
              p="$1.5"
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

        {/* iPhone frame image on top */}
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

// Feature points data with card metadata
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

// CodeInline styled component
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

// Point component for feature lists
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

// Web Frame Section - shows content in a retro web browser frame
const WebFrameSection = () => {
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
      {/* Web browser frame container */}
      <YStack position="relative" width="100%">
        {/* Browser chrome / title bar */}
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
          opacity={0.95}
        >
          {/* Traffic light buttons */}
          <XStack gap="$2">
            <YStack width={12} height={12} rounded={100} bg="#ff5f57" />
            <YStack width={12} height={12} rounded={100} bg="#febc2e" />
            <YStack width={12} height={12} rounded={100} bg="#28c840" />
          </XStack>

          {/* URL bar */}
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

        {/* Content area inside the frame */}
        <YStack
          bg={isDark ? '$color2' : '$color3'}
          borderBottomLeftRadius="$4"
          borderBottomRightRadius="$4"
          borderWidth={1}
          borderTopWidth={0}
          borderColor="$borderColor"
          p="$6"
          gap="$8"
          opacity={0.95}
        >
          {/* Intro section */}
          <YStack gap="$4" maxW={800} mx="auto">
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

          {/* Divider */}
          <ThemeTintAlt>
            <YStack height={1} bg="$color5" opacity={0.3} mx="$4" />
          </ThemeTintAlt>

          {/* Feature Points Section - now inside the frame */}
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

// Feature card for the points section
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

// Retro TV frame for video demo section
const VideoSection = () => {
  const isDark = useThemeName().startsWith('dark')

  return (
    <YStack items="center" gap="$6" maxW={900} mx="auto" width="100%">
      {/* Section title */}
      <ThemeTintAlt>
        <SizableText
          size="$8"
          fontFamily="$silkscreen"
          color="$color11"
          letterSpacing={3}
          text="center"
        >
          SEE IT IN ACTION
        </SizableText>
      </ThemeTintAlt>

      {/* Retro TV Frame */}
      <YStack position="relative" width="100%" maxW={800}>
        {/* TV outer casing */}
        <YStack
          bg={isDark ? '#2a2a2a' : '#d4d0c8'}
          rounded="$6"
          p="$5"
          borderWidth={4}
          borderColor={isDark ? '#444' : '#a0a0a0'}
          style={{
            boxShadow: isDark
              ? 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.3), 4px 4px 12px rgba(0,0,0,0.4)'
              : 'inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.2), 4px 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          {/* Screen bezel */}
          <YStack
            bg={isDark ? '#1a1a1a' : '#333'}
            rounded="$4"
            p="$3"
            borderWidth={3}
            borderColor={isDark ? '#111' : '#222'}
            style={{
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            }}
          >
            {/* CRT screen effect overlay */}
            <YStack
              position="absolute"
              t={12}
              l={12}
              r={12}
              b={12}
              rounded="$3"
              z={2}
              pointerEvents="none"
              opacity={0.03}
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
              }}
            />

            {/* Video container with 16:9 aspect ratio */}
            <YStack
              position="relative"
              width="100%"
              style={{
                paddingBottom: '56.25%', // 16:9 aspect ratio
              }}
              rounded="$2"
              overflow="hidden"
              bg="#000"
            >
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                src="https://www.youtube.com/embed/HWeUin_9asM"
                title="Takeout Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </YStack>
          </YStack>

          {/* TV controls panel */}
          <XStack mt="$4" justify="space-between" items="center" px="$2">
            {/* Brand label */}
            <YStack>
              <SizableText
                fontFamily="$silkscreen"
                size="$2"
                color={isDark ? '#666' : '#888'}
                letterSpacing={2}
              >
                TAMAGUI
              </SizableText>
            </YStack>

            {/* Control knobs */}
            <XStack gap="$4" items="center">
              {/* Volume knob */}
              <YStack items="center" gap="$1">
                <YStack
                  width={24}
                  height={24}
                  rounded={100}
                  bg={isDark ? '#444' : '#888'}
                  borderWidth={2}
                  borderColor={isDark ? '#555' : '#999'}
                  style={{
                    boxShadow: isDark
                      ? 'inset 1px 1px 2px rgba(255,255,255,0.2), 1px 1px 2px rgba(0,0,0,0.3)'
                      : 'inset 1px 1px 2px rgba(255,255,255,0.5), 1px 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                <SizableText
                  size="$1"
                  color={isDark ? '#555' : '#777'}
                  fontFamily="$mono"
                >
                  VOL
                </SizableText>
              </YStack>

              {/* Channel knob */}
              <YStack items="center" gap="$1">
                <YStack
                  width={24}
                  height={24}
                  rounded={100}
                  bg={isDark ? '#444' : '#888'}
                  borderWidth={2}
                  borderColor={isDark ? '#555' : '#999'}
                  style={{
                    boxShadow: isDark
                      ? 'inset 1px 1px 2px rgba(255,255,255,0.2), 1px 1px 2px rgba(0,0,0,0.3)'
                      : 'inset 1px 1px 2px rgba(255,255,255,0.5), 1px 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                <SizableText
                  size="$1"
                  color={isDark ? '#555' : '#777'}
                  fontFamily="$mono"
                >
                  CH
                </SizableText>
              </YStack>

              {/* Power LED */}
              <YStack items="center" gap="$1">
                <YStack
                  width={8}
                  height={8}
                  rounded={100}
                  bg="#00ff00"
                  style={{
                    boxShadow: '0 0 6px #00ff00, 0 0 12px #00ff0080',
                  }}
                />
                <SizableText
                  size="$1"
                  color={isDark ? '#555' : '#777'}
                  fontFamily="$mono"
                >
                  PWR
                </SizableText>
              </YStack>
            </XStack>
          </XStack>
        </YStack>

        {/* TV stand/feet */}
        <XStack justify="center" gap="$10" mt={-2}>
          <YStack
            width={60}
            height={12}
            bg={isDark ? '#333' : '#bbb'}
            borderBottomLeftRadius="$2"
            borderBottomRightRadius="$2"
            style={{
              boxShadow: isDark
                ? '2px 2px 4px rgba(0,0,0,0.3)'
                : '2px 2px 4px rgba(0,0,0,0.15)',
            }}
          />
          <YStack
            width={60}
            height={12}
            bg={isDark ? '#333' : '#bbb'}
            borderBottomLeftRadius="$2"
            borderBottomRightRadius="$2"
            style={{
              boxShadow: isDark
                ? '2px 2px 4px rgba(0,0,0,0.3)'
                : '2px 2px 4px rgba(0,0,0,0.15)',
            }}
          />
        </XStack>
      </YStack>
    </YStack>
  )
}

// Screenshot gallery - modern grid with hover effects
// Maps to indices in TakeoutGallery's takeoutImages array
const screenshotImages = [
  {
    src: '/takeout/starter-screenshots/ios.jpg',
    alt: 'iOS',
    label: 'iOS',
    galleryIdx: 0,
  },
  {
    src: '/takeout/starter-screenshots/web.jpg',
    alt: 'Web',
    label: 'Web',
    galleryIdx: 15,
  },
  {
    src: '/takeout/starter-screenshots/android.jpg',
    alt: 'Android',
    label: 'Android',
    galleryIdx: 26,
  },
  {
    src: '/takeout/starter-screenshots/ios-001.jpeg',
    alt: 'Login',
    label: 'Login',
    galleryIdx: 1,
  },
  {
    src: '/takeout/starter-screenshots/ios-002.jpeg',
    alt: 'Feed',
    label: 'Feed',
    galleryIdx: 2,
  },
  {
    src: '/takeout/starter-screenshots/web-001.jpeg',
    alt: 'Dashboard',
    label: 'Dashboard',
    galleryIdx: 16,
  },
]

const ScreenshotGallery = () => {
  const store = useGalleryStore()

  return (
    <YStack items="center" gap="$6" maxW={1000} mx="auto" width="100%">
      {/* Gallery Dialog */}
      <TakeoutGalleryDialog />

      {/* Section title */}
      <ThemeTintAlt>
        <SizableText
          size="$8"
          fontFamily="$silkscreen"
          color="$color11"
          letterSpacing={3}
          text="center"
        >
          SCREENSHOTS
        </SizableText>
      </ThemeTintAlt>

      {/* Grid of screenshots */}
      <XStack gap="$3" flexWrap="wrap" justify="center">
        {screenshotImages.map((img, i) => (
          <YStack
            key={i}
            width={150}
            height={150}
            rounded="$4"
            overflow="hidden"
            bg="$color3"
            borderWidth={1}
            borderColor="$borderColor"
            cursor="pointer"
            animation="quick"
            hoverStyle={{
              scale: 1.05,
              borderColor: '$color8',
            }}
            pressStyle={{
              scale: 0.98,
            }}
            position="relative"
            group
            onPress={() => {
              store.galleryImageIdx = img.galleryIdx
              store.galleryOpen = true
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={150}
              height={150}
              style={{
                objectFit: 'cover',
              }}
            />
            {/* Label overlay on hover */}
            <YStack
              position="absolute"
              b={0}
              l={0}
              r={0}
              py="$2"
              bg="rgba(0,0,0,0.6)"
              opacity={0}
              className="group-hover:opacity-100"
              animation="quick"
              $group-hover={{
                opacity: 1,
              }}
            >
              <SizableText
                size="$2"
                color="white"
                fontFamily="$mono"
                text="center"
                fontWeight="600"
              >
                {img.label}
              </SizableText>
            </YStack>
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}

// Glow positions that create movement
const glowPositions = [
  [-200, 420, 100],
  [-460, 128, 0],
  [424, 254, 0],
  [-270, 22, 0],
  [536, 122, 0],
  [-40, 290, 0],
  [672, 208, 0],
  [-282, 60, 0],
  [738, 196, 0],
  [-806, 2, 0],
  [678, 276, 0],
  [-84, 212, 0],
  [808, 172, 0],
  [-980, 120, 0],
  [310, 18, 0],
]

const glowScales = [
  [0.91, 1.05, 1.08],
  [0.92, 1.03, 1.07],
  [0.93, 1.04, 1.09],
  [0.94, 1.02, 1.06],
  [0.95, 1.01, 1.1],
  [0.96, 1.0, 1.05],
  [0.97, 1.06, 1.04],
  [0.98, 1.07, 1.03],
  [0.99, 1.08, 1.02],
  [1.0, 1.09, 1.01],
  [1.01, 1.1, 0.99],
  [1.02, 1.05, 0.98],
  [1.03, 1.04, 0.97],
  [1.04, 1.03, 0.96],
  [1.05, 1.02, 0.95],
]

// Glow effect for takeout page - moves based on scroll like HomeGlow
const TakeoutGlow = memo(() => {
  const { tints, tint, tintAlt, tintIndex } = useTint()
  const rawScrollTop = useScrollPosition(100)
  // Cap scroll position to prevent glow from extending page height
  const scrollTop = Math.min(rawScrollTop, 3000)
  const scale = 2.5

  const glows = useMemo(() => {
    return [
      tints[(tintIndex - 0) % tints.length],
      tints[(tintIndex + 1) % tints.length],
      tints[(tintIndex + 2) % tints.length],
    ].map((curTint, i) => {
      if (!curTint) return null

      const isOpposing = tintIndex % 2 === 0
      const isAlt = i === 1

      const xRand = glowPositions[(isOpposing ? 2 - i : i) % glowPositions.length][0]
      const yRand = glowPositions[(isOpposing ? 2 - i : i) % glowPositions.length][1]

      const x = xRand + (isAlt ? -300 : 300)

      return (
        <YStack
          key={`${i}${tint}${tintAlt}`}
          animation="superLazy"
          enterStyle={{
            opacity: 0,
          }}
          exitStyle={{
            opacity: 0,
          }}
          opacity={0.7}
          mixBlendMode={
            i === 0
              ? 'hard-light'
              : i === 1
                ? 'color-burn'
                : i === 2
                  ? 'exclusion'
                  : 'hue'
          }
          overflow="hidden"
          height="100vh"
          maxH={650}
          width={650}
          position="absolute"
          t={0}
          l={`calc(50vw - 500px)`}
          x={x}
          y={yRand + 250}
          scale={scale * (isAlt ? 0.5 : 1) * glowScales[tintIndex % glowScales.length][i]}
          scaleX={isOpposing ? 1 : 1}
        >
          <YStack
            fullscreen
            style={{
              background: `radial-gradient(var(--${curTint}7) 20%, transparent 50%)`,
              transition: `all ease-in-out 1000ms`,
            }}
          />
        </YStack>
      )
    })
  }, [scale, tint, tints, tintIndex, tintAlt])

  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      r={0}
      b={0}
      pointerEvents="none"
      overflow="hidden"
      z={0}
    >
      <YStack
        position="absolute"
        t={0}
        l={0}
        className="all ease-in-out s1"
        x={0}
        y={scrollTop}
        opacity={0.35}
      >
        <AnimatePresence>{glows}</AnimatePresence>
      </YStack>
    </YStack>
  )
})
