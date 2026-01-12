import { Check, X } from '@tamagui/lucide-icons'
import {
  Button,
  H3,
  Paragraph,
  SizableText,
  Theme,
  XStack,
  YStack,
  styled,
  useThemeName,
} from 'tamagui'
import { Link } from '~/components/Link'

const VersionBadge = styled(SizableText, {
  px: '$2',
  py: '$1',
  rounded: '$3',
  fontSize: '$2',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: 1,
  borderWidth: 2,

  variants: {
    variant: {
      new: {
        backgroundColor: '$green4',
        color: '$green11',
        borderColor: '$green7',
      },
      free: {
        backgroundColor: '$blue4',
        color: '$blue11',
        borderColor: '$blue7',
      },
      legacy: {
        backgroundColor: '$orange4',
        color: '$orange11',
        borderColor: '$orange7',
      },
    },
  } as const,
})

const FeatureRow = ({
  feature,
  v1,
  v2,
  v2free,
}: {
  feature: string
  v1: string | boolean
  v2: string | boolean
  v2free: string | boolean
}) => {
  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={18} color="var(--green10)" strokeWidth={3} />
      ) : (
        <X size={18} color="var(--color8)" strokeWidth={2} />
      )
    }
    return (
      <SizableText size="$3" color="$color11" fontFamily="$mono" fontWeight="600">
        {value}
      </SizableText>
    )
  }

  return (
    <XStack
      py="$3"
      px="$3"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      items="center"
      bg="transparent"
    >
      <YStack flex={1.5}>
        <SizableText size="$3" fontWeight="700" color="$color12" fontFamily="$mono">
          {feature}
        </SizableText>
      </YStack>
      <XStack flex={1} justify="center" items="center">
        {renderCell(v1)}
      </XStack>
      <XStack flex={1} justify="center" items="center">
        {renderCell(v2)}
      </XStack>
      <XStack flex={1} justify="center" items="center">
        {renderCell(v2free)}
      </XStack>
    </XStack>
  )
}

const features = [
  { feature: 'Framework', v1: 'Next.js + Expo', v2: 'One', v2free: 'One' },
  { feature: 'Real-time Sync', v1: false, v2: 'Zero', v2free: 'Zero' },
  { feature: 'Authentication', v1: 'Supabase', v2: 'Better Auth', v2free: 'Better Auth' },
  {
    feature: 'Database',
    v1: 'Supabase',
    v2: 'Postgres + Drizzle',
    v2free: 'Postgres + Drizzle',
  },
  { feature: 'Deployment', v1: 'Vercel + EAS', v2: 'SST / Uncloud', v2free: false },
  { feature: 'CLI Tools', v1: false, v2: 'bun tko', v2free: false },
  { feature: 'Private GitHub', v1: true, v2: true, v2free: false },
  { feature: 'Private Discord', v1: true, v2: true, v2free: false },
  { feature: 'Native Apps', v1: true, v2: true, v2free: true },
  { feature: 'Tamagui UI', v1: true, v2: true, v2free: true },
]

export function VersionComparison() {
  const isDark = useThemeName().startsWith('dark')

  return (
    <YStack
      className="blur-medium"
      bg={isDark ? '$color2' : '$color3'}
      rounded="$6"
      p="$6"
      borderWidth={2}
      borderColor="$borderColor"
      gap="$4"
      overflow="hidden"
      $sm={{ display: 'none' }}
      style={{
        boxShadow: '0 0 50px var(--color4)',
      }}
    >
      <YStack gap="$2">
        <H3
          fontFamily="$mono"
          letterSpacing={3}
          color="$color11"
          textTransform="uppercase"
          style={{
            textShadow: '0 0 30px var(--color8)',
          }}
        >
          Version Comparison
        </H3>
        <Paragraph color="$color11" size="$4" fontFamily="$mono">
          Pro subscribers get access to both v1 and v2 repositories.
        </Paragraph>
      </YStack>

      <YStack
        rounded="$4"
        borderWidth={1}
        borderColor="$color6"
        overflow="hidden"
        bg="$background02"
        style={{
          boxShadow: '0 0 30px var(--color4)',
        }}
      >
        <XStack py="$3" px="$3" borderBottomWidth={2} borderBottomColor="$color6">
          <YStack flex={1.5} justify="center">
            <SizableText
              size="$2"
              fontWeight="800"
              color="$color11"
              fontFamily="$mono"
              textTransform="uppercase"
            >
              Feature
            </SizableText>
          </YStack>
          <XStack flex={1} justify="center" items="center" gap="$2">
            <SizableText size="$2" fontWeight="800" color="$orange10" fontFamily="$mono">
              v1
            </SizableText>
            <Theme name="orange">
              <VersionBadge variant="legacy">Legacy</VersionBadge>
            </Theme>
          </XStack>
          <XStack flex={1} justify="center" items="center" gap="$2">
            <SizableText size="$2" fontWeight="800" color="$green10" fontFamily="$mono">
              v2
            </SizableText>
            <Theme name="green">
              <VersionBadge variant="new">New</VersionBadge>
            </Theme>
          </XStack>
          <XStack flex={1} justify="center" items="center" gap="$2">
            <SizableText size="$2" fontWeight="800" color="$blue10" fontFamily="$mono">
              v2-free
            </SizableText>
            <Theme name="blue">
              <VersionBadge variant="free">OSS</VersionBadge>
            </Theme>
          </XStack>
        </XStack>

        {features.map((row) => (
          <FeatureRow key={row.feature} {...row} />
        ))}
      </YStack>

      <XStack gap="$4" flexWrap="wrap" justify="center" pt="$4">
        <Link href="https://takeout.tamagui.dev/docs/introduction" target="_blank">
          <Theme name="green">
            <Button
              size="$3"
              rounded="$4"
              bg="$color9"
              borderWidth={2}
              borderColor="$color10"
              cursor="pointer"
              transition="quick"
              hoverStyle={{ bg: '$color10', scale: 1.02 }}
              pressStyle={{ bg: '$color8', scale: 0.98 }}
            >
              <Button.Text fontFamily="$mono" fontWeight="800" color="white">
                Read the Docs
              </Button.Text>
            </Button>
          </Theme>
        </Link>
        <Link href="https://github.com/tamagui/starter-free" target="_blank">
          <Theme name="blue">
            <Button
              size="$3"
              rounded="$4"
              bg="$color9"
              borderWidth={2}
              borderColor="$color10"
              cursor="pointer"
              transition="quick"
              hoverStyle={{ bg: '$color10', scale: 1.02 }}
              pressStyle={{ bg: '$color8', scale: 0.98 }}
            >
              <Button.Text fontFamily="$mono" fontWeight="800" color="white">
                Try v2-free (OSS)
              </Button.Text>
            </Button>
          </Theme>
        </Link>
      </XStack>
    </YStack>
  )
}
