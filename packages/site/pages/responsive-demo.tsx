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
  const coverPhoto = (
    <Theme name="dark">
      <XStack ai="center" jc="center" pos="relative" br="$6" ov="hidden">
        <YStack>
          <Image width={800} height={200} src={img1.src} />
          <Overlay />
        </YStack>
        <XStack p="$3" px="$4" fullscreen>
          <YStack f={1}>
            <Spacer flex={1} />
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
      </XStack>
    </Theme>
  )

  return (
    <>
      <TitleAndMetaTags title="Tamagui — Responsive Demo" />
      <YStack mah="100vh" ov="hidden" p="$4">
        <YStack pos="relative" $gtXs={{ display: 'none' }}>
          {coverPhoto}
        </YStack>
        <YStack space="$6" $xs={{ display: 'none' }}>
          <XStack space>
            <YStack maw={500}>{coverPhoto}</YStack>
            <Image y={0} br="$6" width={200} height={200} src={img2.src} />
            <Image y={0} br="$6" width={200} height={200} src={img3.src} />
          </XStack>
        </YStack>

        <YStack space="$4" p="$4">
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
        </YStack>
      </YStack>
    </>
  )
}

const Overlay = () => {
  return <LinearGradient w={800} h={300} fullscreen colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} />
}

// {/* <Image
//               $sm={{
//                 // TODO
//                 // width: 200,
//                 display: 'none',
//               }}
//               y={0}
//               br="$6"
//               width={100}
//               height={200}
//               src={img1.src}
//             /> */}
