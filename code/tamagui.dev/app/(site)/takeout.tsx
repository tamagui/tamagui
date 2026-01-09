import { Image } from '@tamagui/image'
import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { useClientValue, useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { Suspense, lazy, useEffect, useState } from 'react'
import {
  H2,
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
import { Footer } from '~/features/site/Footer'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { PurchaseButton, isSafariMobile } from '~/features/site/purchase/helpers'
import { TakeoutLogo } from '~/features/takeout/TakeoutLogo'
import { PageThemeCarousel } from '../../features/site/PageThemeCarousel'
import { useSubscriptionModal } from '../../features/site/purchase/useSubscriptionModal'
import { ThemeNameEffect } from '../../features/site/theme/ThemeNameEffect'

const TakeoutBox3D = lazy(() => import('../../features/takeout/TakeoutBox3D'))

const heroHeight = 1050

export default function TakeoutPage() {
  const { showAppropriateModal, subscriptionStatus } = useSubscriptionModal()
  const isProUser = subscriptionStatus?.pro

  return (
    <YStack maxW="100%">
      <ThemeNameEffect colorKey="$color5" />
      <LoadCherryBomb />
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
          opacity: 0.4,
        }}
        style={{
          background:
            'linear-gradient(180deg, var(--color5) 0%, var(--color3) 50%, var(--color5) 100%)',
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
            <Theme name="accent">
              <PurchaseButton
                onPress={() => {
                  showAppropriateModal()
                }}
                size="$4"
              >
                {isProUser ? 'Access' : 'Buy'}
              </PurchaseButton>
            </Theme>
          </YStack>

          <TakeoutHero />
        </YStack>

        {/* Content area */}
        <YStack mt={heroHeight} minH={200} />

        <Footer />
      </ContainerLarge>
    </YStack>
  )
}

const TakeoutHero = () => {
  const enable3d = useClientValue(
    () => !isSafariMobile && !window.location.search?.includes('disable-3d')
  )

  // Track scroll progress for floating icons animation
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (!isClient) return

    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) based on scroll position
      // Icons should animate within the first 150px of scroll (faster)
      const progress = Math.min(1, window.scrollY / 150)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    desc: 'Share 95% of code',
    theme: 'blue',
  },
  {
    icon: 'retro-icons/design-color-painting-palette-25.svg',
    title: 'DRY & Simple',
    desc: 'Less code, more power',
    theme: 'purple',
  },
] as const

const FeatureCardFrame = styled(YStack, {
  width: '100%',
  elevation: '$0.5',
  overflow: 'hidden',
  rounded: '$4',
  p: '$4',
  position: 'relative',
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

        <XStack gap="$3" items="center" z={100} position="relative">
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

  // Start bigger (1.5x), shrink to normal size (1x) for toPhone icons
  // Start bigger (1.5x), shrink and fade for away icons
  const startScale = 1.5

  if (toPhone && targetX !== undefined) {
    // Animate to target position in a row under phone header (y ~120 from phone center)
    const targetY = 120
    x = initialX + (targetX - initialX) * progress
    y = initialY + (targetY - initialY) * progress
    // Scale from 1.5 down to 1 (original size)
    scale = startScale - progress * 0.5
  } else {
    // Move up and away (further up)
    x = initialX * (1 + progress * 0.5)
    y = initialY - progress * 400
    opacity = 1 - progress * 0.8
    // Scale from 1.5 down to smaller
    scale = startScale - progress * 0.9
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
                fontFamily="$mono"
                fontWeight="800"
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
          l={28}
          r={28}
          py="$2"
          px="$3"
          justify="space-around"
          items="center"
          rounded="$10"
          className="blur-medium"
          z={1}
          borderWidth={1}
          borderColor="$color5"
        >
          <YStack
            position="absolute"
            fullscreen
            rounded="$10"
            bg="$color3"
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
