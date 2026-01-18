import { Image } from '@tamagui/image'
import { ThemeTintAlt } from '@tamagui/logo'
import { H2, SizableText, XStack, YStack, useThemeName } from 'tamagui'
import { useGalleryStore, TakeoutGalleryDialog } from './TakeoutGallery'
import { HighlightText } from './HighlightText'

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
      transition="quick"
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

  return (
    <YStack
      items="center"
      gap="$6"
      maxW={1100}
      mx="auto"
      py="$8"
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
          opacity={0.1}
          pointerEvents="none"
          style={{
            filter: 'blur(100px)',
          }}
        />
      </ThemeTintAlt>

      <H2
        fontSize={32}
        fontWeight="700"
        text="center"
        color="$color12"
        style={{ lineHeight: '1.2' }}
        $sm={{ fontSize: 40 }}
        z={1}
      >
        v1{' '}
        <ThemeTintAlt offset={2}>
          <HighlightText render="span">screenshots</HighlightText>
        </ThemeTintAlt>
      </H2>

      <YStack
        position="relative"
        bg="$background04"
        rounded="$6"
        p="$6"
        $sm={{ p: '$4' }}
        overflow="hidden"
        z={1}
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <XStack gap="$4" justify="center" flexWrap="wrap" $sm={{ gap: '$2' }}>
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
  )
}
