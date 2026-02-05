import { Globe, Leaf, Puzzle } from '@tamagui/lucide-icons'
import { useStore } from '@tamagui/use-store'
import { Circle, H4, Paragraph, XStack, YStack } from 'tamagui'
import { BentoStore, ComponentSection } from '~/components/BentoComponentSection'
import { ContainerLarge } from '~/components/Containers'
import { HeadInfo } from '~/components/HeadInfo'
import { BentoPageFrame } from '~/features/bento/BentoPageFrame'
import { LoadCherryBomb } from '~/features/site/fonts/LoadFonts'
import { BentoHero } from '../../../../components/BentoHero'

export default function BentoPage() {
  const store = useStore(BentoStore)

  return (
    <>
      <LoadCherryBomb />

      <HeadInfo
        title="Copy-paste UI for React Native and Web - Tamagui Bento"
        description="Tamagui Bento - Copy-paste components and screens for React and React Native"
        openGraph={{
          url: '/bento',
          images: [
            {
              url: '/bento/social.png',
            },
          ],
        }}
      />

      <BentoPageFrame>
        <YStack
          onLayout={(e) => {
            store.heroHeight = e.nativeEvent.layout.height
          }}
        >
          <BentoHero />
          <Intermediate />
        </YStack>
        <ComponentSection />
      </BentoPageFrame>
    </>
  )
}

const Intermediate = () => {
  return (
    <ContainerLarge z={1000}>
      <XStack
        gap="$4"
        py="$6"
        pt={20}
        mb={-20}
        mx="auto"
        maxW={900}
        $sm={{
          flexDirection: 'column',
          px: '$2',
          pt: '$4',
          mb: 0,
        }}
      >
        <IntermediateCard Icon={Globe} title="Universal">
          Whether light or dark mode, native or web, or any screen size.
        </IntermediateCard>
        <IntermediateCard Icon={Puzzle} title="Copy & Paste">
          Customize to your design system, designed to be used independently.
        </IntermediateCard>
        <IntermediateCard Icon={Leaf} title="Free">
          Expanding free components. Lifetime&nbsp;rights paid.
        </IntermediateCard>
      </XStack>
    </ContainerLarge>
  )
}

const IntermediateCard = ({
  title,
  children,
  Icon,
}: {
  title?: any
  children?: any
  Icon?: any
}) => {
  return (
    <XStack overflow="hidden" flex={1} gap="$5" px="$5" py="$4" minHeight={80}>
      <YStack flex={1} gap="$2">
        <H4
          opacity={0.5}
          fontFamily="$silkscreen"
          color="$color11"
          className="text-glow"
          size="$2"
        >
          {title}
        </H4>
        <Paragraph mb={-5} size="$3" color="$color12" opacity={0.7}>
          {children}
        </Paragraph>
      </YStack>
      <Circle
        outlineColor="$color02"
        outlineOffset={-4}
        outlineWidth={1}
        outlineStyle="solid"
        size="$5"
        elevation="$0.5"
        backdropFilter="blur(5px)"
      >
        <Icon color="$color11" o={0.85} />
      </Circle>
    </XStack>
  )
}
