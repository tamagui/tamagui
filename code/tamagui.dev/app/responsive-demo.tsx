// @ts-nocheck responsive props
import img1 from '@tamagui/demos/photo/photo1'
import img2 from '@tamagui/demos/photo/photo2'
import img3 from '@tamagui/demos/photo/photo3'
import { LinearGradient } from '@tamagui/linear-gradient'
import { MapPin, Star } from '@tamagui/lucide-icons-2'
import { H3, H4, H5, Image, Paragraph, Spacer, Theme, XStack, YStack } from 'tamagui'

export default function ResponsiveDemo() {
  const header = (
    <XStack flex={1} flexBasis="auto" items="flex-end">
      <YStack flex={1}>
        <Spacer display="gtSmall:none" flex />
        <H3>Enchanting Garden</H3>
        <XStack items="center" gap="4">
          <MapPin size={12} color="var(--color)" />
          <H5>Kailua, HI</H5>
        </XStack>
      </YStack>
      <YStack items="flex-end">
        <Spacer flex display="gtSmall:none" />
        <H4>$45</H4>
        <Paragraph>/night</Paragraph>
      </YStack>
    </XStack>
  )

  const coverPhoto = (
    <Theme name="dark">
      <XStack
        flex={1}
        flexBasis="auto"
        items="center"
        justify="center"
        position="relative"
        rounded="6"
        overflow="hidden"
      >
        <YStack>
          <Image width={800} height={200} src={img1} objectFit="cover" />
          <Overlay display="gtSmall:none" />
        </YStack>
        <YStack
          z={100}
          paddingTop="small:3"
          paddingBottom="small:3"
          px="small:4"
          position="small:absolute"
          inset="small:0px"
          display="gtSmall:none"
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
        maxH="100vh"
        overflow="hidden"
        p="4 gtLarge:6"
        flexDirection="gtLarge:row-reverse"
        maxW="gtLarge:1200px"
        self="gtLarge:center"
        gap="gtLarge:4"
      >
        <YStack position="relative" display="gtSmall:none">
          {coverPhoto}
        </YStack>

        <XStack
          flex={1}
          flexBasis="auto"
          gap="4"
          display="small:none"
          flexDirection="gtLarge:column"
          maxW="gtLarge:450px"
        >
          <YStack overflow="hidden" flex={2} flexBasis="auto" maxW="400px gtMedium:100%">
            {coverPhoto}
          </YStack>
          <XStack
            flex={1}
            flexBasis="auto"
            overflow="hidden"
            maxW="50% gtLarge:100%"
            maxH="gtLarge:100%"
          >
            <YStack
              maxW="100%"
              maxH="100%"
              items="center"
              height={200}
              y={0}
              rounded="6"
              overflow="hidden"
              flex={1}
            >
              <Image width={450} height={200} src={img2} objectFit="cover" />
            </YStack>
            <YStack
              items="center"
              height={200}
              y={0}
              rounded="6"
              overflow="hidden"
              flex={1}
              display="none gtMedium:flex"
              maxW="100%"
              maxH="100%"
              ml="gtMedium:4"
            >
              <Image width={450} height={200} src={img3} objectFit="cover" />
            </YStack>
          </XStack>
        </XStack>

        <YStack
          flex={1}
          flexBasis="auto"
          paddingTop="4 gtLarge:0px"
          paddingBottom="4 gtLarge:0px"
          paddingLeft="4 gtLarge:0px"
          pr="4 gtLarge:6"
          maxW="gtLarge:50%"
        >
          <YStack display="none gtSmall:flex">{header}</YStack>
          <YStack flex={1} flexBasis="auto" gap="4">
            <XStack>
              <XStack items="center" gap="4">
                <Paragraph color="color9">4 guests</Paragraph>
                <Paragraph color="color9">&middot;</Paragraph>
                <Paragraph color="color9">Entire house</Paragraph>
              </XStack>
              <Spacer flex={1} />
              <XStack items="center" gap="4">
                <Star size={20} color="var(--green10)" />
                <Paragraph theme="green">4.55</Paragraph>
              </XStack>
            </XStack>

            <Paragraph color="color10" size="4">
              A lovely, private and very clean cottage with all amenities for a
              comfortable and peaceful stay. We are a 20 minute walk from the Hawaii
              Tropical Botanical Garden and well situated for touring to Akaka Falls,
              Volcano National Park, and many other destinations.
            </Paragraph>

            <Paragraph display="medium:none" color="color10" size="4">
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
      width={800}
      height="100%"
      position="absolute"
      inset={0}
      z={10}
      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.85)']}
      {...props}
    />
  )
}
