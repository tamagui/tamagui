import { Check, X } from '@tamagui/lucide-icons'
import { Button, H3, Paragraph, SizableText, XStack, YStack, styled } from 'tamagui'
import { Link } from '~/components/Link'

const VersionBadge = styled(SizableText, {
  px: '$2',
  py: '$1',
  rounded: '$2',
  fontSize: '$2',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: 1,

  variants: {
    variant: {
      new: {
        backgroundColor: '$green5',
        color: '$green11',
      },
      free: {
        backgroundColor: '$blue5',
        color: '$blue11',
      },
      legacy: {
        backgroundColor: '$gray5',
        color: '$gray11',
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
      return value ? <Check size={16} color="$green10" /> : <X size={16} color="$gray8" />
    }
    return (
      <SizableText size="$3" color="$color11">
        {value}
      </SizableText>
    )
  }

  return (
    <XStack py="$3" borderBottomWidth={1} borderBottomColor="$borderColor" items="center">
      <YStack flex={2}>
        <SizableText size="$4" fontWeight="500">
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
  { feature: 'Real-time Sync', v1: false, v2: 'Zero', v2free: false },
  { feature: 'Authentication', v1: 'Supabase', v2: 'Better Auth', v2free: false },
  { feature: 'Database', v1: 'Supabase', v2: 'PostgreSQL + Drizzle', v2free: false },
  { feature: 'Deployment', v1: 'Vercel + EAS', v2: 'SST / Uncloud', v2free: false },
  { feature: 'CLI Tools', v1: false, v2: 'bun tko', v2free: false },
  { feature: 'Private GitHub', v1: true, v2: true, v2free: false },
  { feature: 'Private Discord', v1: true, v2: true, v2free: false },
  { feature: 'Native Apps', v1: true, v2: true, v2free: true },
  { feature: 'Tamagui UI', v1: true, v2: true, v2free: true },
]

export function VersionComparison() {
  return (
    <YStack
      className="blur-medium"
      bg="$color2"
      rounded="$6"
      p="$6"
      borderWidth={1}
      borderColor="$borderColor"
      gap="$4"
    >
      <YStack gap="$2">
        <H3 fontFamily="$mono" letterSpacing={2}>
          Version Comparison
        </H3>
        <Paragraph color="$color10" size="$4">
          Pro subscribers get access to both v1 and v2 repositories.
        </Paragraph>
      </YStack>

      <YStack>
        <XStack py="$3" borderBottomWidth={2} borderBottomColor="$borderColor">
          <YStack flex={2}>
            <SizableText size="$3" fontWeight="600" color="$color10">
              Feature
            </SizableText>
          </YStack>
          <XStack flex={1} justify="center" items="center" gap="$2">
            <SizableText size="$3" fontWeight="600">
              v1
            </SizableText>
            <VersionBadge variant="legacy">Legacy</VersionBadge>
          </XStack>
          <XStack flex={1} justify="center" items="center" gap="$2">
            <SizableText size="$3" fontWeight="600">
              v2
            </SizableText>
            <VersionBadge variant="new">New</VersionBadge>
          </XStack>
          <XStack flex={1} justify="center" items="center" gap="$2">
            <SizableText size="$3" fontWeight="600">
              v2-free
            </SizableText>
            <VersionBadge variant="free">OSS</VersionBadge>
          </XStack>
        </XStack>

        {features.map((row) => (
          <FeatureRow key={row.feature} {...row} />
        ))}
      </YStack>

      <XStack gap="$4" flexWrap="wrap" justify="center" pt="$4">
        <Link href="https://takeout.tamagui.dev/docs/introduction" target="_blank">
          <Button size="$4" rounded="$10" theme="alt1">
            <Button.Text fontFamily="$mono">Read the Docs</Button.Text>
          </Button>
        </Link>
        <Link href="https://github.com/tamagui/starter-free" target="_blank">
          <Button size="$4" rounded="$10" theme="blue">
            <Button.Text fontFamily="$mono">Try v2-free (OSS)</Button.Text>
          </Button>
        </Link>
      </XStack>
    </YStack>
  )
}
