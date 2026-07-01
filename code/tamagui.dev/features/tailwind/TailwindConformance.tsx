import type { Href } from 'one'
import { Paragraph, Separator, SizableText, XStack, YStack } from 'tamagui'
import { ThemeTint } from '@tamagui/logo'
import { ContainerLarge } from '~/components/Containers'
import { ParagraphLink } from '~/components/Link'
import { HomeH2, HomeH3 } from '~/features/site/home/HomeHeaders'
import { conformance, proofCases, proofLegs, type ProofCase } from './tailwindData'

// one leg of a proof: the cropped harness render on a neutral specimen stage. uses a CSS
// background-image (reliable on web) so light-background crops read as intentional specimens.
function Specimen({ c, leg, scale }: { c: ProofCase; leg: string; scale: number }) {
  const w = Math.round(c.w * scale)
  const h = Math.round(c.h * scale)
  const pad = Math.round(16 * scale)
  return (
    <YStack
      width={w + pad}
      height={h + pad}
      items="center"
      justify="center"
      rounded="$4"
      bg="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <YStack
        width={w}
        height={h}
        style={{
          backgroundImage: `url(/tailwind/proof/${c.slug}.${leg}.png)`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
    </YStack>
  )
}

function ProofRow({ c, scale }: { c: ProofCase; scale: number }) {
  return (
    <XStack items="center" justify="center" gap="$2" flexWrap="wrap">
      {proofLegs.map((leg, i) => (
        <XStack key={leg.key} items="center" gap="$2">
          {i > 0 && (
            <SizableText fontFamily="$mono" size="$5" color="$color8">
              =
            </SizableText>
          )}
          <YStack items="center" gap="$2">
            <Specimen c={c} leg={leg.key} scale={scale} />
            <Paragraph fontFamily="$mono" size="$1" color="$color9">
              {leg.label}
            </Paragraph>
          </YStack>
        </XStack>
      ))}
    </XStack>
  )
}

function MatchChip({ diff }: { diff: number }) {
  return (
    <XStack items="center" gap="$2" bg="$green3" rounded={100} px={12} py={5}>
      <YStack width={7} height={7} rounded={100} bg="$green9" />
      <Paragraph fontFamily="$mono" size="$1" color="$green11">
        {diff === 0 ? '0.0% diff' : `${diff}% diff`}
      </Paragraph>
    </XStack>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <YStack items="center" gap="$1" px="$6" py="$3">
      <SizableText fontFamily="$mono" size="$10" color="$color12">
        {value}
      </SizableText>
      <Paragraph size="$2" color="$color10">
        {label}
      </Paragraph>
    </YStack>
  )
}

export function TailwindConformance() {
  const featured = proofCases.find((c) => c.featured) ?? proofCases[0]
  const rest = proofCases.filter((c) => c !== featured)
  return (
    <ContainerLarge py="$12" gap="$8">
      <YStack items="center" gap="$3">
        <HomeH2>Verified pixel by pixel</HomeH2>
        <HomeH3>
          Every utility renders the same className three ways, then the harness crops to
          the element and diffs it against real Tailwind v4.
        </HomeH3>
      </YStack>

      {/* featured proof: the whole pitch in one glance */}
      <ThemeTint>
        <YStack
          self="center"
          width="100%"
          maxW={820}
          items="center"
          gap="$5"
          py="$9"
          px="$4"
          rounded="$8"
          bg="$color2"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack items="center" justify="center" flexWrap="wrap" gap="$3">
            <ProofRow c={featured} scale={2.3} />
          </XStack>
          <XStack items="center" justify="center" gap="$3" flexWrap="wrap">
            <SizableText fontFamily="$mono" size="$3" color="$color11">
              className=&quot;{featured.className}&quot;
            </SizableText>
            <MatchChip diff={featured.diff} />
          </XStack>
        </YStack>
      </ThemeTint>

      {/* stat row */}
      <XStack self="center" items="center" flexWrap="wrap" justify="center">
        <Stat value={`${conformance.web}%`} label="web vs Tailwind" />
        <Separator vertical />
        <Stat value={`${conformance.native}%`} label="iOS vs Tailwind" />
        <Separator vertical />
        <Stat value={`${conformance.cases}`} label="cases measured" />
      </XStack>

      {/* the rest, one full-width row each so the three legs never wrap */}
      <YStack
        self="center"
        width="100%"
        maxW={980}
        rounded="$6"
        borderWidth={1}
        borderColor="$borderColor"
        bg="$color1"
        overflow="hidden"
      >
        {rest.map((c, i) => (
          <YStack key={c.slug}>
            {i > 0 && <Separator opacity={0.5} />}
            <XStack
              items="center"
              justify="space-between"
              gap="$4"
              px="$5"
              py="$4"
              flexWrap="wrap"
            >
              <YStack gap="$2" minWidth={220} flex={1} items="flex-start">
                <SizableText fontFamily="$mono" size="$2" color="$color11">
                  {c.className}
                </SizableText>
                <MatchChip diff={c.diff} />
              </YStack>
              <ProofRow c={c} scale={1.1} />
            </XStack>
          </YStack>
        ))}
      </YStack>

      <YStack self="center" maxW={720} items="center" gap="$3">
        <Paragraph text="center" color="$color10" size="$3" lineHeight="$5">
          Method: each className is cropped to its element and diffed per pixel at{' '}
          {conformance.tolerance}% tolerance, on a real iOS render and a browser. The rest
          is {conformance.failing.join(', ')}: a few conversions still in progress, and
          real platform differences like CSS margin-collapse, which flexbox does not have.
          No fallbacks.
        </Paragraph>
        <ParagraphLink href={'/tailwind/intro/introduction' as Href}>
          <SizableText fontFamily="$mono" size="$2" color="$accent7">
            Read the docs
          </SizableText>
        </ParagraphLink>
      </YStack>
    </ContainerLarge>
  )
}
