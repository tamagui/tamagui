import { ThemeTintAlt } from '@tamagui/logo'
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
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: 1,
  borderWidth: 0.5,

  variants: {
    variant: {
      new: {
        bg: '$green4',
        color: '$green11',
        borderColor: '$green7',
      },
      free: {
        bg: '$blue4',
        color: '$blue11',
        borderColor: '$blue7',
      },
      legacy: {
        bg: '$gray4',
        color: '$gray11',
        borderColor: '$gray7',
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
      items="center"
      gap="$6"
      py="$6"
      maxW={1000}
      mx="auto"
      width="100%"
      $sm={{ display: 'none' }}
    >
      <YStack items="center" gap="$4">
        <H3
          fontSize={32}
          fontWeight="700"
          text="center"
          color="$color12"
          style={{ lineHeight: '1.2' }}
          $sm={{ fontSize: 40 }}
        >
          Three Flavors
        </H3>
        <Paragraph
          fontSize={16}
          color="$color11"
          text="center"
          style={{ lineHeight: '1.6' }}
        >
          Pro subscribers get access to both v1 and v2 repositories.
        </Paragraph>
      </YStack>

      <YStack
        bg={isDark ? 'rgba(255,255,255,0.03)' : '$color2'}
        rounded="$6"
        p="$6"
        borderWidth={0.5}
        borderColor={isDark ? 'rgba(255,255,255,0.08)' : '$color4'}
        gap="$4"
        overflow="hidden"
        width="100%"
        style={{
          backdropFilter: 'blur(12px)',
        }}
      >
        <YStack
          rounded="$4"
          borderWidth={0.5}
          borderColor="$color6"
          overflow="hidden"
          bg="$background02"
          style={{
            boxShadow: '0 0 30px var(--color4)',
          }}
        >
          <XStack py="$3" px="$3" borderBottomWidth={1} borderBottomColor="$color6">
            <YStack flex={1.5} justify="center">
              <SizableText
                size="$2"
                fontWeight="600"
                color="$color11"
                fontFamily="$mono"
                textTransform="uppercase"
              >
                Feature
              </SizableText>
            </YStack>
            <XStack flex={1} justify="center" items="center" gap="$2">
              <SizableText
                size="$2"
                fontWeight="600"
                color="$yellow10"
                fontFamily="$mono"
              >
                v1
              </SizableText>
              <Theme name="gray">
                <VersionBadge variant="legacy">Conservative</VersionBadge>
              </Theme>
            </XStack>
            <XStack flex={1} justify="center" items="center" gap="$2">
              <SizableText size="$2" fontWeight="600" color="$green10" fontFamily="$mono">
                v2
              </SizableText>
              <Theme name="green">
                <VersionBadge variant="new">New</VersionBadge>
              </Theme>
            </XStack>
            <XStack flex={1} justify="center" items="center" gap="$2">
              <SizableText size="$2" fontWeight="600" color="$blue10" fontFamily="$mono">
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

        <XStack gap="$3" flexWrap="wrap" justify="center" pt="$4">
          <Link href="https://takeout.tamagui.dev/docs/introduction" target="_blank">
            <ThemeTintAlt>
              <Button
                size="$4"
                bg="$color5"
                borderWidth={0.5}
                borderColor="$color7"
                cursor="pointer"
                hoverStyle={{ bg: '$color6', borderColor: '$color8' }}
                pressStyle={{ bg: '$color7' }}
              >
                <Button.Text fontFamily="$mono" color="$color12">
                  Docs
                </Button.Text>
              </Button>
            </ThemeTintAlt>
          </Link>
          <Link href="https://github.com/tamagui/starter-free" target="_blank">
            <Button
              size="$4"
              bg="$color3"
              borderWidth={0.5}
              borderColor="$color6"
              cursor="pointer"
              hoverStyle={{ bg: '$color4', borderColor: '$color8' }}
              pressStyle={{ bg: '$color5' }}
            >
              <Button.Text fontFamily="$mono" color="$color12">
                Try v2-free (OSS)
              </Button.Text>
            </Button>
          </Link>
        </XStack>
      </YStack>
    </YStack>
  )
}
