import { ArrowLeft, ArrowRight, X } from '@tamagui/lucide-icons'
import { createUseStore } from '@tamagui/use-store'
import Image, { ImageProps } from 'next/image'
import { useEffect } from 'react'
import {
  AnimatePresence,
  Button,
  Dialog,
  H6,
  Paragraph,
  Spacer,
  StackProps,
  Unspaced,
  XStack,
  YStack,
  styled,
} from 'tamagui'

const androidImages = [
  require('public/takeout/starter-screenshots/android-001.jpeg'),
  require('public/takeout/starter-screenshots/android-002.jpeg'),
  require('public/takeout/starter-screenshots/android-003.jpeg'),
  require('public/takeout/starter-screenshots/android-004.jpeg'),
  require('public/takeout/starter-screenshots/android-005.jpeg'),
  require('public/takeout/starter-screenshots/android-006.jpeg'),
  require('public/takeout/starter-screenshots/android-007.jpeg'),
  require('public/takeout/starter-screenshots/android-008.jpeg'),
  require('public/takeout/starter-screenshots/android-009.jpeg'),
  require('public/takeout/starter-screenshots/android-010.jpeg'),
  require('public/takeout/starter-screenshots/android-011.jpeg'),
  require('public/takeout/starter-screenshots/android-012.jpeg'),
  require('public/takeout/starter-screenshots/android-013.jpeg'),
  require('public/takeout/starter-screenshots/android-014.jpeg'),
]

const iosImages = [
  require('public/takeout/starter-screenshots/ios-001.jpeg'),
  require('public/takeout/starter-screenshots/ios-002.jpeg'),
  require('public/takeout/starter-screenshots/ios-003.jpeg'),
  require('public/takeout/starter-screenshots/ios-004.jpeg'),
  require('public/takeout/starter-screenshots/ios-005.jpeg'),
  require('public/takeout/starter-screenshots/ios-006.jpeg'),
  require('public/takeout/starter-screenshots/ios-007.jpeg'),
  require('public/takeout/starter-screenshots/ios-008.jpeg'),
  require('public/takeout/starter-screenshots/ios-009.jpeg'),
  require('public/takeout/starter-screenshots/ios-010.jpeg'),
  require('public/takeout/starter-screenshots/ios-011.jpeg'),
  require('public/takeout/starter-screenshots/ios-012.jpeg'),
  require('public/takeout/starter-screenshots/ios-013.jpeg'),
  require('public/takeout/starter-screenshots/ios-014.jpeg'),
]

const webImages = [
  require('public/takeout/starter-screenshots/web-001.jpeg'),
  require('public/takeout/starter-screenshots/web-002.jpeg'),
  require('public/takeout/starter-screenshots/web-003.jpeg'),
  require('public/takeout/starter-screenshots/web-004.jpeg'),
  require('public/takeout/starter-screenshots/web-005.jpeg'),
  require('public/takeout/starter-screenshots/web-006.jpeg'),
  require('public/takeout/starter-screenshots/web-007.jpeg'),
  require('public/takeout/starter-screenshots/web-008.jpeg'),
  require('public/takeout/starter-screenshots/web-009.jpeg'),
  require('public/takeout/starter-screenshots/web-010.jpeg'),
]

const takeoutImages = [
  { src: require('public/takeout/starter-screenshots/ios.jpg'), alt: 'iOS mockup' },
  ...iosImages.map((src, idx) => ({
    src,
    alt: `iOS screenshot #${idx + 1}`,
  })),
  { src: require('public/takeout/starter-screenshots/web.jpg'), alt: 'Web mockup' },

  ...webImages.map((src, idx) => ({
    src,
    alt: `Web screenshot #${idx + 1}`,
  })),
  {
    src: require('public/takeout/starter-screenshots/android.jpg'),
    alt: 'Android mockup',
  },
  ...androidImages.map((src, idx) => ({
    src,
    alt: `Android screenshot #${idx + 1}`,
  })),
]

const takeoutIosImageIdx = 0
const takeoutWebImageIdx = takeoutIosImageIdx + iosImages.length + 1
const takeoutAndroidImageIdx = takeoutWebImageIdx + webImages.length + 1

class GalleryStore {
  galleryOpen = false
  galleryImageIdx = 0
  galleryDirection = 0
  paginateGallery(newDirection: number) {
    this.galleryImageIdx = wrap(
      0,
      takeoutImages.length,
      this.galleryImageIdx + newDirection
    )
    this.galleryDirection = newDirection
  }
}

const useGalleryStore = createUseStore(GalleryStore)

export default function TakeoutGallery() {
  const store = useGalleryStore()

  return (
    <>
      <ImageGallery />

      <XStack
        mx="$-4"
        ai="center"
        jc="center"
        gap="$4"
        $md={{
          flexDirection: 'column',
        }}
      >
        <TakeoutImage
          index={takeoutIosImageIdx}
          fill
          src={takeoutImages[takeoutIosImageIdx].src}
          alt={takeoutImages[takeoutIosImageIdx].alt}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          wrapperProps={{
            flexGrow: 1,
            position: 'relative',
            height: 400,

            borderRadius: '$6',
            overflow: 'hidden',
            $md: {
              width: '100%',
            },
          }}
        />

        <TakeoutImage
          index={takeoutWebImageIdx}
          fill
          src={takeoutImages[takeoutWebImageIdx].src}
          alt={takeoutImages[takeoutWebImageIdx].alt}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          wrapperProps={{
            flexGrow: 2,
            position: 'relative',
            height: 400,

            borderRadius: '$6',
            overflow: 'hidden',
            $md: {
              width: '100%',
            },
          }}
        />

        <TakeoutImage
          index={takeoutAndroidImageIdx}
          fill
          src={takeoutImages[takeoutAndroidImageIdx].src}
          alt={takeoutImages[takeoutAndroidImageIdx].alt}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          wrapperProps={{
            flexGrow: 1,
            position: 'relative',
            height: 400,

            borderRadius: '$6',
            overflow: 'hidden',
            $md: {
              width: '100%',
            },
          }}
        />
      </XStack>

      <Spacer />

      <XStack fw="wrap" gap="$3" mx="$1" ai="center" jc="center">
        {takeoutImages.slice(1, 12).map((image, index) => (
          <YStack key={index} pos="relative">
            <TakeoutImage
              alt={image.alt}
              src={image.src}
              style={{ objectFit: 'cover' }}
              width={50}
              height={50}
              index={index}
            />
          </YStack>
        ))}
        <YStack pos="relative" overflow="hidden">
          <YStack
            onPress={() => {
              store.galleryOpen = true
            }}
            width={50}
            height={50}
            bc="$color12"
            br="$6"
            ov="hidden"
            elevation="$2"
            cursor="pointer"
            ai="center"
            jc="center"
          >
            <H6 fontFamily="$munro" color="black">
              +{takeoutImages.length - 11}
            </H6>
          </YStack>
        </YStack>
      </XStack>
    </>
  )
}

const ImageGallery = () => {
  const store = useGalleryStore()

  return (
    <Dialog
      modal
      open={store.galleryOpen}
      onOpenChange={(open) => {
        store.galleryOpen = open
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="lazy"
          opacity={0.1}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'medium',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -10, opacity: 0 }}
          exitStyle={{ x: 0, y: 10, opacity: 0 }}
          space
        >
          <ImagesCarousel />
          <Unspaced>
            <YStack pos="absolute" right="$6" bottom="$8" zi="$4">
              <Paragraph
                textShadowColor="black"
                textShadowOffset={{ height: 1, width: 1 }}
                textShadowRadius={4}
                fontFamily="$munro"
              >
                {store.galleryImageIdx + 1} / {takeoutImages.length}
              </Paragraph>
            </YStack>

            <YStack pos="absolute" left="$6" bottom="$8" zi="$4">
              <Paragraph
                textShadowColor="black"
                textShadowOffset={{ height: 1, width: 1 }}
                textShadowRadius={4}
                fontFamily="$munro"
              >
                {takeoutImages[store.galleryImageIdx].alt}
              </Paragraph>
            </YStack>

            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$5"
                right="$6"
                size="$3"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const ImagesCarousel = () => {
  const store = useGalleryStore()

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft') {
        store.paginateGallery(-1)
      } else if (event.code === 'ArrowRight') {
        store.paginateGallery(1)
      }
    }

    document.addEventListener('keydown', eventHandler)
    return () => {
      document.removeEventListener('keydown', eventHandler)
    }
  }, [store.galleryOpen])

  const enterVariant =
    store.galleryDirection === 1 || store.galleryDirection === 0 ? 'isRight' : 'isLeft'
  const exitVariant = store.galleryDirection === 1 ? 'isLeft' : 'isRight'

  const currentImage = takeoutImages[store.galleryImageIdx]
  return (
    <XStack
      overflow="hidden"
      backgroundColor="#00000000"
      position="relative"
      height="100vh"
      width="100vw"
      alignItems="center"
    >
      <AnimatePresence
        enterVariant={enterVariant}
        exitVariant={exitVariant}
        exitBeforeEnter
      >
        <YStackEnterable
          key={store.galleryImageIdx}
          animation="100ms"
          x={0}
          opacity={1}
          width="100vw"
          height="100vh"
        >
          <Image
            key={store.galleryImageIdx}
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            style={{
              objectFit: 'contain',
            }}
          />
        </YStackEnterable>
      </AnimatePresence>

      <Button
        accessibilityLabel="Carousel left"
        icon={ArrowLeft}
        size="$5"
        position="absolute"
        left="$4"
        circular
        elevate
        onPress={() => store.paginateGallery(-1)}
      />
      <Button
        accessibilityLabel="Carousel right"
        icon={ArrowRight}
        size="$5"
        position="absolute"
        right="$4"
        circular
        elevate
        onPress={() => store.paginateGallery(1)}
      />
    </XStack>
  )
}

const YStackEnterable = styled(YStack, {
  variants: {
    isLeft: { true: { x: -300, opacity: 0 } },
    isRight: { true: { x: 300, opacity: 0 } },
  } as const,
})

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const TakeoutImage = ({
  wrapperProps,
  ...props
}: ImageProps & { index: number; wrapperProps?: StackProps }) => {
  const store = useGalleryStore()
  return (
    <XStack
      onPress={() => {
        store.galleryOpen = true
        store.galleryImageIdx = props.index
      }}
      br="$5"
      ov="hidden"
      elevation="$3"
      cursor="pointer"
      animation="100ms"
      hoverStyle={{ scale: 1.015 }}
      pressStyle={{ scale: 0.975 }}
      borderWidth={1}
      borderColor="$borderColor"
      {...wrapperProps}
    >
      <YStack
        style={{
          boxShadow: `inset 0 0 ${+(props.width || 100) / 2.5}px rgba(0, 0, 0, 0.6)`,
        }}
        fullscreen
      />
      <Image {...props} />
    </XStack>
  )
}
