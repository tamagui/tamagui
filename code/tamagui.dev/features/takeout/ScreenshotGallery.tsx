import { Image } from '@tamagui/image'
import { ThemeTintAlt } from '@tamagui/logo'
import { H2, Paragraph, styled, XStack, YStack } from 'tamagui'
import { SubTitle } from '../../components/SubTitle'
import { HighlightText } from './HighlightText'
import { TakeoutGalleryDialog, useGalleryStore } from './TakeoutGallery'

const screenshotImages = [
  {
    src: '/takeout/starter-screenshots/ios.jpg',
    alt: 'iOS',
    label: 'iOS',
    galleryIdx: 0,
  },
  {
    src: '/takeout/starter-screenshots/web.jpg',
    alt: 'Web',
    label: 'Web',
    galleryIdx: 15,
  },
  {
    src: '/takeout/starter-screenshots/android.jpg',
    alt: 'Android',
    label: 'Android',
    galleryIdx: 26,
  },
  {
    src: '/takeout/starter-screenshots/ios-001.jpeg',
    alt: 'Login',
    label: 'Login',
    galleryIdx: 1,
  },
  {
    src: '/takeout/starter-screenshots/ios-002.jpeg',
    alt: 'Feed',
    label: 'Feed',
    galleryIdx: 2,
  },
  {
    src: '/takeout/starter-screenshots/web-001.jpeg',
    alt: 'Dashboard',
    label: 'Dashboard',
    galleryIdx: 16,
  },
]

const ScreenshotCard = styled(YStack, {
  bg: '$background02',
  rounded: '$5',
  p: '$2',
  pb: '$3',
  cursor: 'pointer',
  borderWidth: 0.5,
  borderColor: 'transparent',
  overflow: 'hidden',
  transition: 'quick',

  hoverStyle: {
    scale: 1.05,
    borderColor: '$color6',
    z: 10,
  },

  pressStyle: {
    scale: 0.98,
  },
})

const ImageWrapper = styled(YStack, {
  width: 140,
  height: 140,
  overflow: 'hidden',
  rounded: '$3',
  bg: '$color2',

  $md: { width: 120, height: 120 },
  $sm: { width: 90, height: 90 },
})

function ScreenshotItem({
  img,
  index,
  onPress,
}: {
  img: (typeof screenshotImages)[0]
  index: number
  onPress: () => void
}) {
  return (
    <ThemeTintAlt offset={index}>
      <ScreenshotCard onPress={onPress} aria-label={`View ${img.label} screenshot`}>
        <ImageWrapper>
          <Image
            src={img.src}
            alt={img.alt}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </ImageWrapper>

        <YStack mt="$2" items="center">
          <Paragraph fontSize={12} color="$color10" fontFamily="$mono" fontWeight="500">
            {img.label}
          </Paragraph>
        </YStack>
      </ScreenshotCard>
    </ThemeTintAlt>
  )
}

export const ScreenshotGallery = () => {
  const store = useGalleryStore()

  return (
    <YStack
      items="center"
      gap="$6"
      maxW={1100}
      mx="auto"
      py="$8"
      px="$4"
      width="100%"
      position="relative"
    >
      <TakeoutGalleryDialog />

      {/* Large ambient glow behind the section */}
      <ThemeTintAlt>
        <YStack
          position="absolute"
          t="30%"
          l="50%"
          x={-300}
          width={600}
          height={400}
          rounded={999}
          bg="$color8"
          opacity={0.08}
          pointerEvents="none"
          style={{ filter: 'blur(100px)' }}
        />
      </ThemeTintAlt>

      {/* Secondary glow */}
      <ThemeTintAlt offset={3}>
        <YStack
          position="absolute"
          b="20%"
          r="10%"
          width={400}
          height={300}
          rounded={999}
          bg="$color7"
          opacity={0.05}
          pointerEvents="none"
          style={{ filter: 'blur(80px)' }}
        />
      </ThemeTintAlt>

      <YStack items="center" gap="$4" z={1}>
        <H2
          fontSize={32}
          fontWeight="700"
          text="center"
          color="$color12"
          style={{ lineHeight: '1.2' }}
          $sm={{ fontSize: 40 }}
        >
          See it in{' '}
          <ThemeTintAlt offset={2}>
            <HighlightText render="span">action</HighlightText>
          </ThemeTintAlt>
        </H2>

        <SubTitle maxW={500} text="center">
          Real screenshots from the starter. iOS, Android, and web - all from one
          codebase.
        </SubTitle>
      </YStack>

      <XStack gap="$4" justify="center" flexWrap="wrap" z={1} $sm={{ gap: '$3' }}>
        {screenshotImages.map((img, i) => (
          <ScreenshotItem
            key={img.label}
            img={img}
            index={i}
            onPress={() => {
              store.galleryImageIdx = img.galleryIdx
              store.galleryOpen = true
            }}
          />
        ))}
      </XStack>
    </YStack>
  )
}
