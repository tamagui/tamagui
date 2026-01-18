import {
  composeRefs,
  H2,
  H3,
  Paragraph,
  styled,
  useThemeName,
  XStack,
  YStack,
} from 'tamagui'
import { ThemeTintAlt } from '@tamagui/logo'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import {
  Globe,
  Zap,
  Smartphone,
  Shield,
  Cloud,
  Terminal,
  Rocket,
  Code,
} from '@tamagui/lucide-icons'
import { useHoverGlow } from '~/components/HoverGlow'
import { HighlightText } from './HighlightText'

const BentoCardFrame = styled(YStack, {
  rounded: '$5',
  p: '$5',
  bg: '$background04',
  borderWidth: 1,
  borderColor: '$borderColor',
  overflow: 'hidden',
  position: 'relative',
  style: {
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
})

const IconWrapper = styled(YStack, {
  width: 44,
  height: 44,
  rounded: '$4',
  items: 'center',
  justify: 'center',
  mb: '$3',
})

const features = [
  {
    title: 'Universal Apps',
    description: 'One codebase for iOS, Android, and Web. Share 95%+ of code.',
    Icon: Globe,
  },
  {
    title: 'Real-time Sync',
    description: 'Zero provides instant sync with optimistic updates.',
    Icon: Zap,
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
    description: 'The tko CLI handles dev, build, deploy, and migrations.',
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
}: {
  title: string
  description: string
  Icon: typeof Globe
}) {
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
    <YStack
      ref={composeRefs(innerGlow.parentRef) as any}
      height="100%"
      gap="$2"
      rounded="$5"
      p="$5"
      bg="$background04"
      borderWidth={1}
      borderColor="$color4"
      overflow="hidden"
      position="relative"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {isHydrated && <innerGlow.Component />}

      <ThemeTintAlt>
        <IconWrapper bg="$color5" z={1} position="relative">
          <Icon size={22} color="$color12" />
        </IconWrapper>
      </ThemeTintAlt>

      <H3
        fontSize={16}
        fontWeight="600"
        color="$color12"
        z={1}
        position="relative"
        style={{ lineHeight: '1.3' }}
      >
        {title}
      </H3>

      <Paragraph
        fontSize={14}
        color="$color11"
        z={1}
        position="relative"
        style={{ lineHeight: '1.5' }}
      >
        {description}
      </Paragraph>
    </YStack>
  )
}

export function TakeoutBentoFeatures() {
  return (
    <YStack
      id="features"
      gap="$6"
      py="$8"
      px="$4"
      maxW={1100}
      self="center"
      width="100%"
      position="relative"
    >
      {/* Large ambient glow behind the entire section */}
      <ThemeTintAlt>
        <YStack
          position="absolute"
          t="20%"
          l="50%"
          x={-300}
          width={600}
          height={600}
          rounded={999}
          bg="$color8"
          opacity={0.08}
          pointerEvents="none"
          style={{
            filter: 'blur(120px)',
          }}
        />
      </ThemeTintAlt>

      <YStack items="center" gap="$4" z={1}>
        <H2
          fontSize={32}
          fontWeight="700"
          text="center"
          color="$color12"
          style={{ lineHeight: '1.2' }}
          $sm={{ fontSize: 40 }}
        >
          Everything{' '}
          <ThemeTintAlt>
            <HighlightText tag="span">you need.</HighlightText>
          </ThemeTintAlt>
        </H2>
        <Paragraph
          fontSize={16}
          color="$color11"
          text="center"
          maxW={500}
          style={{ lineHeight: '1.6' }}
          $sm={{ fontSize: 18 }}
        >
          A complete stack for building production apps, not a boilerplate.
        </Paragraph>
      </YStack>

      {/* 4 cards per row on desktop, 2 on tablet, 1 on mobile */}
      <XStack flexWrap="wrap" gap="$4" justify="center" z={1}>
        {features.map((feature) => (
          <YStack
            key={feature.title}
            width="calc(25% - 40px)"
            minW={240}
            $md={{ width: 'calc(25% - 12px)' }}
            $sm={{ width: 'calc(50% - 8px)' }}
            $xs={{ width: '100%' }}
          >
            <BentoCard
              title={feature.title}
              description={feature.description}
              Icon={feature.Icon}
            />
          </YStack>
        ))}
      </XStack>
    </YStack>
  )
}
