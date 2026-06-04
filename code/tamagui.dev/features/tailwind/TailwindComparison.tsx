import { Paragraph, Separator, XStack, YStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { HomeH2, HomeH3 } from '~/features/site/home/HomeHeaders'
import {
  coverageRows,
  coverageSummary,
  variantRows,
  type CoverageRow,
  type Support,
} from './tailwindData'

const cols = ['tamagui', 'tailwind', 'nativewind', 'uniwind'] as const
const colLabels: Record<(typeof cols)[number], string> = {
  tamagui: 'Tamagui',
  tailwind: 'Tailwind',
  nativewind: 'NativeWind',
  uniwind: 'Uniwind',
}

const mark: Record<Support, { glyph: string; color: string }> = {
  full: { glyph: '●', color: '$green10' },
  partial: { glyph: '◐', color: '$yellow10' },
  web: { glyph: 'web', color: '$blue10' },
  none: { glyph: '–', color: '$color7' },
}

function Cell({ s }: { s: Support }) {
  const m = mark[s]
  return (
    <YStack width={92} items="center">
      <Paragraph fontFamily="$mono" size="$2" color={m.color}>
        {m.glyph}
      </Paragraph>
    </YStack>
  )
}

function Matrix({ title, rows }: { title: string; rows: CoverageRow[] }) {
  return (
    <YStack
      self="center"
      width="100%"
      maxW={820}
      rounded="$6"
      borderWidth={1}
      borderColor="$borderColor"
      bg="$color1"
      overflow="hidden"
      style={{ overflowX: 'auto' }}
      minWidth={0}
    >
      <YStack minWidth={520}>
        <XStack px="$4" py="$3" items="center" bg="$color2">
          <YStack flex={1} minWidth={150}>
            <Paragraph fontFamily="$mono" size="$2" color="$color11">
              {title}
            </Paragraph>
          </YStack>
          {cols.map((c) => (
            <YStack key={c} width={92} items="center">
              <Paragraph
                fontFamily="$mono"
                size="$2"
                color={c === 'tamagui' ? '$color12' : '$color10'}
              >
                {colLabels[c]}
              </Paragraph>
            </YStack>
          ))}
        </XStack>
        <Separator />
        {rows.map((row, i) => (
          <YStack key={row.utility}>
            {i > 0 && <Separator opacity={0.5} />}
            <XStack px="$4" py="$3" items="center">
              <YStack flex={1} minWidth={150}>
                <Paragraph fontFamily="$mono" size="$2" color="$color11">
                  {row.utility}
                </Paragraph>
              </YStack>
              <Cell s={row.tamagui} />
              <Cell s={row.tailwind} />
              <Cell s={row.nativewind} />
              <Cell s={row.uniwind} />
            </XStack>
          </YStack>
        ))}
      </YStack>
    </YStack>
  )
}

export function TailwindComparison() {
  return (
    <ContainerLarge py="$12" gap="$8">
      <YStack items="center" gap="$3">
        <HomeH2>Coverage, measured</HomeH2>
        <HomeH3>
          Coverage counts how many of 138 CSS utilities a framework supports. It does not
          measure whether they render the same across platforms. That is what the 94 and
          97 above are for.
        </HomeH3>
      </YStack>

      {/* summary */}
      <XStack
        self="center"
        flexWrap="wrap"
        gap="$3"
        justify="center"
        maxW={760}
        width="100%"
      >
        {coverageSummary.map((f) => (
          <YStack
            key={f.name}
            flex={1}
            minWidth={150}
            gap="$2"
            p="$4"
            rounded="$6"
            borderWidth={1}
            borderColor="$borderColor"
            bg="$color1"
          >
            <Paragraph fontFamily="$mono" size="$3" color="$color11">
              {f.name}
            </Paragraph>
            <Paragraph fontFamily="$mono" size="$9" color="$color12">
              {f.pct}%
            </Paragraph>
            <Paragraph
              fontFamily="$mono"
              size="$1"
              color={f.cross ? '$green10' : '$color9'}
            >
              {f.cross ? 'cross-platform' : 'web only'}
            </Paragraph>
          </YStack>
        ))}
      </XStack>

      <Matrix title="Utility" rows={coverageRows} />
      <Matrix title="Variants & states" rows={variantRows} />

      <Paragraph fontFamily="$mono" size="$1" color="$color9" self="center">
        ● full · ◐ partial · web web-only · – none
      </Paragraph>
      <Paragraph
        self="center"
        maxW={680}
        text="center"
        size="$3"
        color="$color10"
        lineHeight="$5"
      >
        NativeWind covers more raw utilities. Tamagui covers fewer, renders them
        identically across platforms, and does it inside the same compiler as your themes,
        tokens, and components.
      </Paragraph>
    </ContainerLarge>
  )
}
