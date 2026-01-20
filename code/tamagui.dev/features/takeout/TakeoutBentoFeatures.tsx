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
import { useHoverGlow } from '~/components/HoverGlow'
import { SubTitle } from '../../components/SubTitle'

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
    description: 'One codebase. iOS, Android, & Web. 90%+ shared code.',
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
}: {
  title: string
  description: string
  Icon: typeof Globe
}) {
  const isDark = useThemeName().startsWith('dark')
  const isHydrated = useDidFinishSSR()
  const innerGlow = useHoverGlow({
    resist: 80,
    size: 200,
    strategy: 'blur',
    blurPct: 60,
    color: isDark ? 'var(--red3)' : 'var(--red4)',
    opacity: isDark ? 0.3 : 0.35,
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
      borderWidth={0.5}
      borderColor="$color4"
      overflow="hidden"
      position="relative"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {isHydrated && <innerGlow.Component />}

      <IconWrapper bg="$color5" z={1} position="relative">
        <Icon size={22} color="$color12" />
      </IconWrapper>

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

      <Paragraph size="$3" color="$color11" z={1} position="relative">
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
          Modern, robust, maintained
        </H2>
        <SubTitle maxW={680} text="center">
          A complete startup stack for production apps, not a boilerplate.
        </SubTitle>
      </YStack>

      {/* 4 cards per row on desktop, 2 on tablet, 1 on mobile */}
      <XStack flexWrap="wrap" gap="$4" justify="center" z={1}>
        {features.map((feature, index) => (
          <YStack
            key={feature.title}
            width="calc(25% - 40px)"
            minW={240}
            $md={{ width: 'calc(25% - 12px)' }}
            $sm={{ width: 'calc(50% - 8px)' }}
            $xs={{ width: '100%' }}
          >
            <ThemeTintAlt offset={index}>
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
