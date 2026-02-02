import { ThemeTintAlt } from '@tamagui/logo'
import {
  Cloud,
  Code,
  Globe,
  Rocket,
  Shield,
  Smartphone,
  Terminal,
  Zap,
} from '@tamagui/lucide-icons'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { H2, H3, Paragraph, styled, useThemeName, XStack, YStack } from 'tamagui'
import { useHoverGlow } from '~/components/HoverGlow'
import { SubTitle } from '../../components/SubTitle'

const IconWrapper = styled(YStack, {
  width: 52,
  height: 52,
  rounded: '$5',
  items: 'center',
  justify: 'center',
  mb: '$3',
  transition: 'medium',
})

const features = [
  {
    title: 'Universal Apps',
    description: 'One codebase. iOS, Android, & Web. 90%+ shared code.',
    Icon: Globe,
    featured: true,
  },
  {
    title: 'Real-time Sync',
    description: 'Zero provides instant sync with optimistic updates.',
    Icon: Zap,
    featured: true,
  },
  {
    title: 'Native Feel',
    description: 'Tamagui + Reanimated for smooth 60fps animations.',
    Icon: Smartphone,
  },
  {
    title: 'Type-Safe',
    description: 'End-to-end TypeScript with Valibot validation.',
    Icon: Shield,
  },
  {
    title: 'Deploy Anywhere',
    description: 'SST for AWS serverless or Uncloud for self-hosting.',
    Icon: Cloud,
  },
  {
    title: 'CLI Powered',
    description: 'The tko CLI handles dev, build, deploy, testing, migrations.',
    Icon: Terminal,
  },
  {
    title: 'Agent Ready',
    description: 'Structured docs for AI agents to ship features fast.',
    Icon: Rocket,
  },
  {
    title: 'Production Ready',
    description: 'Auth, CI/CD, monitoring included. Ship day one.',
    Icon: Code,
  },
]

function BentoCard({
  title,
  description,
  Icon,
  featured = false,
}: {
  title: string
  description: string
  Icon: typeof Globe
  featured?: boolean
}) {
  const isDark = useThemeName().startsWith('dark')
  const isHydrated = useDidFinishSSR()

  const innerGlow = useHoverGlow({
    resist: 65,
    size: featured ? 280 : 220,
    strategy: 'blur',
    blurPct: 50,
    color: isDark ? 'var(--color3)' : 'var(--color6)',
    opacity: 0.2,
    background: 'transparent',
  })

  return (
    <YStack
      ref={innerGlow.parentRef as any}
      height="100%"
      gap="$3"
      rounded="$6"
      p="$5"
      bg={isDark ? '$background02' : '$background04'}
      borderWidth={1}
      borderColor="$borderColor"
      overflow="hidden"
      position="relative"
      transition="medium"
    >
      {isHydrated && <innerGlow.Component />}

      <IconWrapper bg="$color4" z={1} position="relative">
        <Icon size={featured ? 26 : 24} color="$color11" transition="200ms" />
      </IconWrapper>

      <H3
        fontSize={featured ? 18 : 16}
        fontWeight="700"
        color="$color12"
        z={1}
        position="relative"
        style={{ lineHeight: '1.3' }}
      >
        {title}
      </H3>

      <Paragraph
        size={featured ? '$4' : '$3'}
        color="$color11"
        z={1}
        position="relative"
        transition="quick"
      >
        {description}
      </Paragraph>
    </YStack>
  )
}

// Animated background orbs
function BackgroundOrbs() {
  return (
    <>
      {/* Primary large glow */}
      <ThemeTintAlt>
        <YStack
          position="absolute"
          t="10%"
          l="50%"
          x={-350}
          width={700}
          height={700}
          rounded={999}
          bg="$color7"
          opacity={0.06}
          pointerEvents="none"
          transition="superLazy"
          style={{
            filter: 'blur(100px)',
          }}
        />
      </ThemeTintAlt>

      {/* Secondary accent glow */}
      <ThemeTintAlt offset={2}>
        <YStack
          position="absolute"
          t="40%"
          r="-10%"
          width={500}
          height={500}
          rounded={999}
          bg="$color8"
          opacity={0.04}
          pointerEvents="none"
          transition="superLazy"
          style={{
            filter: 'blur(120px)',
          }}
        />
      </ThemeTintAlt>

      {/* Tertiary glow */}
      <ThemeTintAlt offset={4}>
        <YStack
          position="absolute"
          b="10%"
          l="-5%"
          width={400}
          height={400}
          rounded={999}
          bg="$color6"
          opacity={0.05}
          pointerEvents="none"
          transition="superLazy"
          style={{
            filter: 'blur(100px)',
          }}
        />
      </ThemeTintAlt>
    </>
  )
}

export function TakeoutBentoFeatures() {
  const isHydrated = useDidFinishSSR()

  // Separate featured (first 2) from regular features
  const featuredFeatures = features.slice(0, 2)
  const regularFeatures = features.slice(2)

  return (
    <YStack
      id="features"
      gap="$4"
      py="$10"
      px="$4"
      maxW={1200}
      self="center"
      width="100%"
      position="relative"
      $gtMd={{
        gap: '$6',
      }}
    >
      {isHydrated && <BackgroundOrbs />}

      {/* Header section */}
      <YStack items="center" gap="$4" z={1}>
        <ThemeTintAlt>
          <Paragraph
            fontFamily="$mono"
            fontSize={12}
            fontWeight="600"
            color="$color10"
            textTransform="uppercase"
            letterSpacing={2}
            opacity={0.8}
          >
            Why Takeout
          </Paragraph>
        </ThemeTintAlt>

        <H2
          fontSize={28}
          fontWeight="800"
          text="center"
          color="$color12"
          style={{ lineHeight: '1.15' }}
          $gtSm={{ fontSize: 44 }}
        >
          Modern, robust, maintained
        </H2>

        <SubTitle maxW={680} text="center" size="$5" px="$2">
          We get it, starter kits are a dime a dozen. Takeout is built by industry
          veterans, and extracted out of real-world large apps.
        </SubTitle>
      </YStack>

      {/* Featured cards - larger, 2 per row */}
      <XStack flexWrap="wrap" gap="$4" justify="center" z={1}>
        {featuredFeatures.map((feature, index) => (
          <YStack
            key={feature.title}
            width="calc(50% - 16px)"
            minW={280}
            $md={{ width: 'calc(50% - 8px)' }}
            $sm={{ width: '100%' }}
          >
            <ThemeTintAlt offset={index}>
              <BentoCard
                title={feature.title}
                description={feature.description}
                Icon={feature.Icon}
                featured
              />
            </ThemeTintAlt>
          </YStack>
        ))}
      </XStack>

      {/* Regular cards - 3 per row on desktop */}
      <XStack flexWrap="wrap" gap="$4" justify="center" z={1}>
        {regularFeatures.map((feature, index) => (
          <YStack
            key={feature.title}
            width="calc(33.333% - 22px)"
            minW={240}
            $md={{ width: 'calc(50% - 8px)' }}
            $sm={{ width: '100%' }}
          >
            <ThemeTintAlt offset={index + 2}>
              <BentoCard
                title={feature.title}
                description={feature.description}
                Icon={feature.Icon}
              />
            </ThemeTintAlt>
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}
