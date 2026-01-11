import { Image } from '@tamagui/image'
import { ThemeTintAlt } from '@tamagui/logo'
import { SizableText, Theme, XStack, YStack, useThemeName } from 'tamagui'
import { useGalleryStore, TakeoutGalleryDialog } from './TakeoutGallery'

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

const polaroidColorsLight = [
  '#fff9f0',
  '#f0f5ff',
  '#f5fff0',
  '#fff0f5',
  '#fffff0',
  '#f0ffff',
]

const polaroidColorsDark = [
  '#3d3530',
  '#2d3340',
  '#303d30',
  '#3d3035',
  '#3d3d30',
  '#303d3d',
]

const PolaroidCard = ({
  img,
  index,
  onPress,
}: {
  img: (typeof screenshotImages)[0]
  index: number
  onPress: () => void
}) => {
  const isDark = useThemeName().startsWith('dark')
  const rotations = [-3, 2, -2, 3, -1, 2]
  const rotation = rotations[index % rotations.length]
  const frameColor = isDark
    ? polaroidColorsDark[index % polaroidColorsDark.length]
    : polaroidColorsLight[index % polaroidColorsLight.length]

  return (
    <YStack
      cursor="pointer"
      animation="quick"
      hoverStyle={{
        scale: 1.08,
        rotate: '0deg',
        z: 10,
      }}
      pressStyle={{
        scale: 0.98,
      }}
      rotate={`${rotation}deg`}
      onPress={onPress}
      aria-label={`View ${img.label} screenshot`}
    >
      <YStack
        p="$1.5"
        pb="$4"
        rounded="$2"
        bg={frameColor as any}
        boxShadow={
          isDark
            ? '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)'
        }
      >
        <YStack
          width={120}
          height={120}
          $md={{ width: 100, height: 100 }}
          $sm={{ width: 70, height: 70 }}
          overflow="hidden"
          bg="#1a1a1a"
        >
          <Image
            src={img.src}
            alt={img.alt}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </YStack>

        <YStack mt="$1.5" items="center">
          <SizableText
            size="$1"
            color={isDark ? '#aaa' : '#444'}
            fontFamily="$mono"
            fontWeight="500"
          >
            {img.label}
          </SizableText>
        </YStack>
      </YStack>
    </YStack>
  )
}

export const ScreenshotGallery = () => {
  const store = useGalleryStore()
  const isDark = useThemeName().startsWith('dark')
  const frameColor = isDark ? '#B8894A' : '#E8C896'

  return (
    <YStack items="center" gap="$6" maxW={1100} mx="auto" width="100%">
      <TakeoutGalleryDialog />

      <ThemeTintAlt>
        <SizableText
          size="$8"
          fontFamily="$silkscreen"
          color="$color11"
          letterSpacing={3}
          text="center"
        >
          SCREENSHOTS
        </SizableText>
      </ThemeTintAlt>

      <YStack
        position="relative"
        bg="$orange1"
        rounded="$4"
        p="$3"
        style={{
          boxShadow: isDark
            ? 'inset 0 2px 4px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.4)'
            : 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <YStack
          bg={frameColor}
          rounded="$3"
          p="$6"
          $sm={{ p: '$4' }}
          position="relative"
          overflow="hidden"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(circle at 20% 30%, #B8894A 1px, transparent 1px), radial-gradient(circle at 80% 70%, #9A7030 1px, transparent 1px), radial-gradient(circle at 50% 50%, #A67B3C 1px, transparent 1px)'
              : 'radial-gradient(circle at 20% 30%, #E8C896 1px, transparent 1px), radial-gradient(circle at 80% 70%, #C49A5A 1px, transparent 1px), radial-gradient(circle at 50% 50%, #D4A85A 1px, transparent 1px)',
            backgroundSize: '20px 20px, 25px 25px, 15px 15px',
          }}
        >
          <XStack gap="$4" justify="center" $sm={{ gap: '$2' }} z={1}>
            {screenshotImages.map((img, i) => (
              <PolaroidCard
                key={i}
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
      </YStack>
    </YStack>
  )
}
