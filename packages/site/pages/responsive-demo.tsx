import { TitleAndMetaTags } from '@components/TitleAndMetaTags'
import { MapPin, Star } from '@tamagui/feather-icons'
import {
  H3,
  H4,
  H5,
  Image,
  LinearGradient,
  Paragraph,
  Spacer,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import img1 from '../public/photo1.webp'
import img2 from '../public/photo2.webp'
import img3 from '../public/photo3.webp'

export default function ResponsiveDemo() {
  const header = (
    <XStack $sm={{ p: '$3', px: '$4', fullscreen: true }}>
      <YStack f={1}>
        <Spacer $gtSm={{ display: 'none' }} flex={1} />
        <H3>Enchanting Garden</H3>
        <XStack ai="center" space>
          <MapPin size={12} color="var(--color)" />
          <H5>Oakland, CA</H5>
        </XStack>
      </YStack>
      <YStack ai="flex-end">
        <Spacer flex={1} />
        <H4>$45</H4>
        <Paragraph>/night</Paragraph>
      </YStack>
    </XStack>
  )

  const coverPhoto = (
    <Theme name="dark">
      <XStack ai="center" jc="center" pos="relative" br="$6" ov="hidden">
        <YStack>
          <Image width={800} height={200} src={img1.src} />
          <Overlay $gtSm={{ display: 'none' }} />
        </YStack>
        <YStack $gtSm={{ display: 'none' }}>{header}</YStack>
      </XStack>
    </Theme>
  )

  return (
    <>
      <TitleAndMetaTags title="Tamagui — Responsive Demo" />
      <YStack mah="100vh" ov="hidden" p="$4" $gtSm={{ flexDirection: 'row-reverse' }}>
        <YStack pos="relative" $gtXs={{ display: 'none' }}>
          {coverPhoto}
        </YStack>

        <XStack space $xs={{ display: 'none' }} $gtSm={{ flexDirection: 'column', maw: 400 }}>
          <YStack ov="hidden" f={2} maw={400} $gtSm={{ maw: '100%' }}>
            {coverPhoto}
          </YStack>
          <YStack ai="center" y={0} br="$6" ov="hidden" f={1}>
            <Image width={400} height={200} src={img2.src} />
          </YStack>
          <YStack ai="center" y={0} br="$6" ov="hidden" f={1}>
            <Image width={400} height={200} src={img3.src} />
          </YStack>
        </XStack>

        <YStack f={1} p="$4" $gtSm={{ p: 0, pr: '$6' }}>
          <YStack $sm={{ display: 'none' }}>{header}</YStack>
          <YStack f={1} space="$4">
            <XStack>
              <XStack ai="center" space>
                <Paragraph theme="alt2">4 guests</Paragraph>
                <Paragraph theme="alt2">&middot;</Paragraph>
                <Paragraph theme="alt2">Entire house</Paragraph>
              </XStack>
              <Spacer flex={1} />
              <XStack ai="center" space>
                <Star size={20} color="var(--purple10)" />
                <Paragraph theme="purple_alt2">4.55</Paragraph>
              </XStack>
            </XStack>

            <Paragraph theme="alt1" size="$4">
              A lovely, private and very clean cottage with all amenities for a comfortable and
              peaceful stay. We are a 20 minute walk from the Hawaii Tropical Botanical Garden and
              well situated for touring to Akaka Falls, Volcano National Park, and many other
              destinations.
            </Paragraph>

            <Paragraph $sm={{ display: 'none' }} theme="alt1" size="$4">
              A lovely, private and very clean cottage with all amenities for a comfortable and
              peaceful stay. We are a 20 minute walk from the Hawaii Tropical Botanical Garden and
              well situated for touring to Akaka Falls, Volcano National Park, and many other
              destinations.
            </Paragraph>
          </YStack>
        </YStack>
      </YStack>
    </>
  )
}

const Overlay = (props) => {
  return (
    <LinearGradient
      w={800}
      h={300}
      fullscreen
      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
      {...props}
    />
  )
}
