import { ThemeTintAlt } from '@tamagui/logo'
import { Check, X } from '@tamagui/lucide-icons'
import { H3, Paragraph, SizableText, XStack, YStack, styled, useThemeName } from 'tamagui'

const FeatureLabel = styled(SizableText, {
  size: '$3',
  fontWeight: '600',
  color: '$color12',
  fontFamily: '$mono',
})

type Feature = {
  feature: string
  description: string
  takeout: string | boolean
  others: string | boolean
}

const features: Feature[] = [
  {
    feature: 'UI Components',
    description: 'Hand-refined components across 45 categories with full accessibility',
    takeout: '350+',
    others: '25-50',
  },
  {
    feature: 'Premium Components',
    description: 'Access to Bento copy-paste component library',
    takeout: 'Bento included',
    others: false,
  },
  {
    feature: 'AI Theme Generator',
    description: 'Generate custom themes with AI, export to your app',
    takeout: true,
    others: false,
  },
  {
    feature: 'Web Performance',
    description:
      'Compiler extracts styles to CSS, One optimizes builds, react-native-web-lite cuts bundle size',
    takeout: '100 Lighthouse',
    others: 'Mobile only / slow',
  },
  {
    feature: 'Code Sharing',
    description:
      'Share UI, logic, and routing across all platforms without the typical performance hit',
    takeout: '95%+',
    others: '~80%',
  },
  {
    feature: 'Unified Framework',
    description: 'One repo, one package.json, one bundler, one router',
    takeout: 'One',
    others: '2+ frameworks',
  },
  {
    feature: 'SSR / SSG / SPA',
    description: 'Mix render modes per-route: static marketing, SSR app, SPA dashboard',
    takeout: true,
    others: false,
  },
  {
    feature: 'Sync Engine',
    description:
      'Optimistic mutations, realtime sync, relations, full types. Runs on Postgres, not proprietary',
    takeout: 'Zero',
    others: 'Minimal',
  },
  {
    feature: 'Style Compiler',
    description: 'Styles extracted at build time, not computed at runtime',
    takeout: 'Tamagui',
    others: 'Runtime only',
  },
  {
    feature: 'Dark Mode SSR',
    description: 'No hydration flicker, works with SSR/SSG, respects system preference',
    takeout: 'No flicker',
    others: 'Basic',
  },
  {
    feature: 'Animation',
    description: 'CSS/Motion on web for performance, Reanimated on native for 60fps',
    takeout: 'CSS + Motion + Reanimated',
    others: 'Reanimated only',
  },
  {
    feature: 'Agent Docs',
    description: 'Hand-written markdown docs for AI agents to ship features fast',
    takeout: '25+',
    others: '0-2',
  },
  {
    feature: 'CLI Scripts',
    description: 'Organized commands for dev, build, deploy, migrations, upgrades',
    takeout: '46+',
    others: '~5',
  },
  {
    feature: 'IaC CI/CD',
    description: 'Full infrastructure-as-code with automated deployments',
    takeout: 'SST / Uncloud',
    others: 'Manual',
  },
  {
    feature: 'Onboarding CLI',
    description: 'Interactive setup wizard for env, secrets, Docker, migrations',
    takeout: true,
    others: false,
  },
  {
    feature: 'User Onboarding',
    description: 'Animated multi-stage flow: waitlist → profile → avatar → notifications',
    takeout: 'Multi-stage',
    others: 'Basic / none',
  },
  {
    feature: 'Docs Site',
    description: 'Built-in SSG documentation site with search and navigation',
    takeout: '11 pages',
    others: 'README',
  },
  {
    feature: 'Testing',
    description: 'Unit and E2E tests configured and passing out of the box',
    takeout: 'Vitest + Playwright',
    others: 'None / basic',
  },
  {
    feature: 'Hot Updates (OTA)',
    description: 'Push updates to iOS/Android without app store review',
    takeout: true,
    others: false,
  },
]

const FeatureRow = ({ feature, description, takeout, others }: Feature) => {
  const renderCell = (value: string | boolean, isPositive?: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={18} color="var(--green10)" strokeWidth={3} />
      ) : (
        <X size={18} color="var(--color8)" strokeWidth={2} />
      )
    }
    return (
      <SizableText
        size="$3"
        color={isPositive ? '$green11' : '$color10'}
        fontFamily="$mono"
        fontWeight="600"
      >
        {value}
      </SizableText>
    )
  }

  return (
    <YStack
      py="$3"
      px="$4"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      bg="transparent"
      hoverStyle={{
        bg: '$color2',
      }}
    >
      <XStack items="center">
        <YStack flex={1.2}>
          <FeatureLabel>{feature}</FeatureLabel>
        </YStack>
        <XStack flex={1} justify="center" items="center">
          {renderCell(takeout, true)}
        </XStack>
        <XStack flex={1} justify="center" items="center">
          {renderCell(others, false)}
        </XStack>
      </XStack>
      <SizableText size="$2" color="$color9" mt="$1" style={{ lineHeight: 1.4 }}>
        {description}
      </SizableText>
    </YStack>
  )
}

export function TakeoutVsCompetitors() {
  const isDark = useThemeName().startsWith('dark')

  return (
    <YStack items="center" gap="$6" maxW={900} mx="auto" width="100%" py="$8" px="$4">
      <YStack items="center" gap="$4">
        <H3
          fontSize={32}
          fontWeight="700"
          text="center"
          color="$color12"
          style={{ lineHeight: '1.2' }}
          $sm={{ fontSize: 28 }}
        >
          Why{' '}
          <ThemeTintAlt>
            <SizableText
              fontSize={32}
              fontWeight="700"
              color="$color10"
              $sm={{ fontSize: 28 }}
            >
              Takeout
            </SizableText>
          </ThemeTintAlt>
        </H3>
        <Paragraph
          fontSize={16}
          color="$color11"
          text="center"
          style={{ lineHeight: '1.6' }}
          maxW={500}
        >
          Not just another boilerplate. A production-grade universal app.
        </Paragraph>
      </YStack>

      <YStack
        bg={isDark ? 'rgba(255,255,255,0.03)' : '$color2'}
        rounded="$6"
        borderWidth={1}
        borderColor={isDark ? 'rgba(255,255,255,0.08)' : '$color4'}
        overflow="hidden"
        width="100%"
        style={{
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <XStack
          py="$3"
          px="$4"
          borderBottomWidth={1}
          borderBottomColor="$color6"
          bg="$background02"
        >
          <YStack flex={1.2} justify="center">
            <SizableText
              size="$2"
              fontWeight="600"
              color="$color10"
              fontFamily="$mono"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Feature
            </SizableText>
          </YStack>
          <XStack flex={1} justify="center" items="center">
            <ThemeTintAlt>
              <SizableText size="$3" fontWeight="700" color="$color10" fontFamily="$mono">
                Takeout
              </SizableText>
            </ThemeTintAlt>
          </XStack>
          <XStack flex={1} justify="center" items="center">
            <SizableText size="$3" fontWeight="600" color="$color9" fontFamily="$mono">
              Others
            </SizableText>
          </XStack>
        </XStack>

        {/* Rows */}
        {features.map((row) => (
          <FeatureRow key={row.feature} {...row} />
        ))}
      </YStack>
    </YStack>
  )
}
