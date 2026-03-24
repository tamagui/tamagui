/**
 * Stress page for profiling Tamagui component render performance.
 *
 * Renders a diverse set of components to simulate a realistic page:
 * styled components with defaults + variants, token values, theme tokens,
 * nested themes, text with font resolution, lists with many repeated items.
 *
 * Usage:
 *   http://localhost:9000/?test=StressPage
 *   http://localhost:9000/?test=StressPage&profile=true
 *
 * With profile=true:
 *   - sets up @tamagui/timer on globalThis.time so all internal
 *     getSplitStyles / createComponent checkpoints are captured
 *   - exposes window.__PERF_RESULT__ with wall-clock + breakdown data
 */
import { timer } from '@tamagui/timer'
import React from 'react'
import {
  Button,
  Card,
  H1,
  H2,
  H3,
  Input,
  Label,
  Paragraph,
  Separator,
  SizableText,
  Switch,
  Theme,
  View,
  XStack,
  YStack,
  styled,
} from 'tamagui'

const shouldProfile =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('profile') === 'true'

// set up the timer globally so createComponent/getSplitStyles checkpoints fire
// (bypasses the broken require('@tamagui/timer') in the built @tamagui/web dist)
if (shouldProfile) {
  const t = timer()
  ;(globalThis as any).time = t.start()
  ;(globalThis as any).__TIMER__ = t
}

// styled components with variants
const StyledCard = styled(Card, {
  padding: '$4',
  borderRadius: '$4',
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$borderColor',
  elevation: '$2',

  variants: {
    highlighted: {
      true: {
        backgroundColor: '$blue2',
        borderColor: '$blue6',
      },
    },
    size: {
      sm: { padding: '$2' },
      md: { padding: '$4' },
      lg: { padding: '$6' },
    },
  } as const,
})

const Badge = styled(View, {
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  borderRadius: '$10',
  backgroundColor: '$blue4',

  variants: {
    color: {
      green: { backgroundColor: '$green4' },
      red: { backgroundColor: '$red4' },
      orange: { backgroundColor: '$orange4' },
    },
  } as const,
})

const StatBox = styled(YStack, {
  padding: '$3',
  borderRadius: '$3',
  backgroundColor: '$backgroundHover',
  gap: '$1',
  flex: 1,
})

const items = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  title: `Item ${i + 1}`,
  desc: `Description for item ${i + 1} with some extra text`,
  badge: (['green', 'red', 'orange'] as const)[i % 3],
}))

const stats = [
  { label: 'Users', value: '12,345' },
  { label: 'Revenue', value: '$98.7k' },
  { label: 'Orders', value: '3,456' },
  { label: 'Growth', value: '+23%' },
]

function Header() {
  return (
    <YStack gap="$2" padding="$4" backgroundColor="$background">
      <H1 color="$color" fontWeight="800">
        Dashboard
      </H1>
      <Paragraph color="$color8" size="$4">
        Overview of your application metrics and recent activity
      </Paragraph>
      <XStack gap="$2" flexWrap="wrap">
        {['All', 'Active', 'Pending', 'Archived'].map((tab) => (
          <Button key={tab} size="$3" variant={tab === 'All' ? undefined : 'outlined'}>
            {tab}
          </Button>
        ))}
      </XStack>
    </YStack>
  )
}

function StatsRow() {
  return (
    <XStack gap="$3" paddingHorizontal="$4" flexWrap="wrap">
      {stats.map((s) => (
        <StatBox key={s.label}>
          <SizableText size="$2" color="$color8">
            {s.label}
          </SizableText>
          <SizableText size="$8" fontWeight="700" color="$color">
            {s.value}
          </SizableText>
        </StatBox>
      ))}
    </XStack>
  )
}

function ItemRow({ item }: { item: (typeof items)[0] }) {
  return (
    <XStack
      padding="$3"
      gap="$3"
      alignItems="center"
      borderBottomColor="$borderColor"
      borderBottomWidth={1}
      hoverStyle={{ backgroundColor: '$backgroundHover' }}
    >
      <View width={40} height={40} borderRadius="$10" backgroundColor="$blue5" />
      <YStack flex={1} gap="$1">
        <SizableText fontWeight="600" size="$4">
          {item.title}
        </SizableText>
        <SizableText size="$2" color="$color8" numberOfLines={1}>
          {item.desc}
        </SizableText>
      </YStack>
      <Badge color={item.badge}>
        <SizableText size="$1" color="white">
          {item.badge}
        </SizableText>
      </Badge>
    </XStack>
  )
}

function ItemList() {
  return (
    <StyledCard size="md">
      <H3 marginBottom="$2">Recent Activity</H3>
      <YStack>
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </YStack>
    </StyledCard>
  )
}

function FormSection() {
  return (
    <StyledCard highlighted size="md">
      <H3 marginBottom="$3">Settings</H3>
      <YStack gap="$3">
        {['Name', 'Email', 'Company', 'Role'].map((field) => (
          <YStack key={field} gap="$1">
            <Label size="$3">{field}</Label>
            <Input size="$3" placeholder={`Enter ${field.toLowerCase()}`} />
          </YStack>
        ))}
        <XStack gap="$3" alignItems="center">
          <Switch size="$3" />
          <SizableText size="$3">Enable notifications</SizableText>
        </XStack>
        <Button size="$4">Save Changes</Button>
      </YStack>
    </StyledCard>
  )
}

function ThemedSection() {
  return (
    <Theme name="blue">
      <YStack gap="$3" padding="$4" backgroundColor="$background" borderRadius="$4">
        <H2 color="$color">Themed Section</H2>
        <XStack gap="$2" flexWrap="wrap">
          {Array.from({ length: 12 }, (_, i) => (
            <Theme key={i} name={i % 2 === 0 ? 'surface1' : 'surface2'}>
              <View
                width={80}
                height={60}
                borderRadius="$3"
                backgroundColor="$background"
                padding="$2"
              >
                <SizableText size="$1" color="$color">
                  Card {i + 1}
                </SizableText>
              </View>
            </Theme>
          ))}
        </XStack>
      </YStack>
    </Theme>
  )
}

function Footer() {
  return (
    <XStack
      padding="$4"
      gap="$4"
      justifyContent="space-between"
      borderTopColor="$borderColor"
      borderTopWidth={1}
    >
      {['About', 'Privacy', 'Terms', 'Contact', 'Help', 'Status'].map((link) => (
        <SizableText key={link} size="$2" color="$color8" cursor="pointer">
          {link}
        </SizableText>
      ))}
    </XStack>
  )
}

export function StressPage() {
  // render profiling: mark start before React render, measure in effect after commit
  if (shouldProfile) {
    performance.mark('stress-render-start')
  }

  React.useEffect(() => {
    if (!shouldProfile) return
    performance.mark('stress-render-end')
    performance.measure('stress-render', 'stress-render-start', 'stress-render-end')
    const measure = performance.getEntriesByName('stress-render', 'measure')[0]

    const t = (globalThis as any).__TIMER__
    const profile = t?.profile()

    const result = {
      renderMs: Math.round(measure.duration * 100) / 100,
      breakdown: profile?.timings,
      runs: profile?.runs,
      timestamp: Date.now(),
    }

    ;(window as any).__PERF_RESULT__ = result
    t?.print()
    console.log(`[StressPage] render: ${result.renderMs}ms`)
  }, [])

  return (
    <YStack width="100%" maxWidth={900} gap="$4" paddingBottom="$6">
      <Header />
      <Separator />
      <StatsRow />
      <Separator />
      <XStack gap="$4" paddingHorizontal="$4" flexWrap="wrap">
        <YStack flex={2} minWidth={400} gap="$4">
          <ItemList />
        </YStack>
        <YStack flex={1} minWidth={280} gap="$4">
          <FormSection />
          <ThemedSection />
        </YStack>
      </XStack>
      <Separator />
      <Footer />
    </YStack>
  )
}
