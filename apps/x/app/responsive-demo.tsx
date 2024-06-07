// @ts-nocheck responsive props
import img1 from '@tamagui/demos/photo/photo1'
import img2 from '@tamagui/demos/photo/photo2'
import img3 from '@tamagui/demos/photo/photo3'
import { LinearGradient } from '@tamagui/linear-gradient'
import { MapPin, Star } from '@tamagui/lucide-icons'
import { H3, H4, H5, Image, Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'

export default function ResponsiveDemo() {
  const header = (
    <XStack f={1}>
      <YStack f={1}>
        <Spacer $gtSmall={{ display: 'none' }} flex />
        <H3>Enchanting Garden</H3>
        <XStack ai="center" space>
          <MapPin size={12} color="var(--color)" />
          <H5>Kailua, HI</H5>
        </XStack>
      </YStack>
      <YStack ai="flex-end">
        <Spacer flex $gtSmall={{ display: 'none' }} />
        <H4>$45</H4>
        <Paragraph>/night</Paragraph>
      </YStack>
    </XStack>
  )

  const coverPhoto = (
    <Theme name="dark">
      <XStack f={1} ai="center" jc="center" pos="relative" br="$6" ov="hidden">
        <YStack>
          <Image width={800} height={200} src={img1} />
          <Overlay $gtSmall={{ display: 'none' }} />
        </YStack>
        <YStack
          zi={100}
          $small={{ p: '$3', px: '$4', fullscreen: true }}
          $gtSmall={{ display: 'none' }}
        >
          {header}
        </YStack>
      </XStack>
    </Theme>
  )

  return (
    <>
      <title>Tamagui — Responsive Demo</title>
      <YStack
        mah="100vh"
        ov="hidden"
        p="$4"
        $gtLarge={{ fd: 'row-reverse', p: '$6', maw: 1200, als: 'center' }}
      >
        <YStack pos="relative" $gtSmall={{ display: 'none' }}>
          {coverPhoto}
        </YStack>

        <XStack
          f={1}
          gap="$4"
          $small={{ display: 'none' }}
          $gtLarge={{ fd: 'column', maw: 450 }}
        >
          <YStack ov="hidden" f={2} maw={400} $gtMedium={{ maw: '100%', f: 0 }}>
            {coverPhoto}
          </YStack>
          <XStack f={1} ov="hidden" maw="50%" $gtLarge={{ maw: '100%' }}>
            <YStack
              maw="100%"
              mah="100%"
              ai="center"
              h={200}
              y={0}
              br="$6"
              ov="hidden"
              f={1}
            >
              <Image width={450} height={200} src={img2} />
            </YStack>
            <YStack
              ai="center"
              h={200}
              y={0}
              br="$6"
              ov="hidden"
              f={1}
              display="none"
              maw="100%"
              mah="100%"
              $gtMedium={{ display: 'flex', ml: '$4' }}
            >
              <Image width={450} height={200} src={img3} />
            </YStack>
          </XStack>
        </XStack>

        <YStack f={1} p="$4" $gtLarge={{ p: 0, pr: '$6', maw: '50%' }}>
          <YStack display="none" $gtSmall={{ display: 'flex' }}>
            {header}
          </YStack>
          <YStack f={1} gap="$4">
            <XStack>
              <XStack ai="center" gap="$4">
                <Paragraph theme="alt2">4 guests</Paragraph>
                <Paragraph theme="alt2">&middot;</Paragraph>
                <Paragraph theme="alt2">Entire house</Paragraph>
              </XStack>
              <Spacer flex={1} />
              <XStack ai="center" gap="$4">
                <Star size={20} color="var(--purple10)" />
                <Paragraph theme="purple_alt2">4.55</Paragraph>
              </XStack>
            </XStack>

            <Paragraph theme="alt1" size="$4">
              A lovely, private and very clean cottage with all amenities for a
              comfortable and peaceful stay. We are a 20 minute walk from the Hawaii
              Tropical Botanical Garden and well situated for touring to Akaka Falls,
              Volcano National Park, and many other destinations.
            </Paragraph>

            <Paragraph $medium={{ display: 'none' }} theme="alt1" size="$4">
              A lovely, private and very clean cottage with all amenities for a
              comfortable and peaceful stay. We are a 20 minute walk from the Hawaii
              Tropical Botanical Garden and well situated for touring to Akaka Falls,
              Volcano National Park, and many other destinations.
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
      h="100%"
      fullscreen
      zi={10}
      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
      {...props}
    />
  )
}
