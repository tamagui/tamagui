import { Image, type ImageProps } from '@tamagui/image-next'
import { ArrowLeft, ArrowRight, X } from '@tamagui/lucide-icons'
import { createUseStore } from '@tamagui/use-store'
import { useEffect } from 'react'
import type { StackProps } from 'tamagui'
import {
  AnimatePresence,
  Button,
  Dialog,
  H6,
  Paragraph,
  Spacer,
  Unspaced,
  XStack,
  YStack,
  styled,
} from 'tamagui'

const androidImages = [
  '/takeout/starter-screenshots/android-001.jpeg',
  '/takeout/starter-screenshots/android-002.jpeg',
  '/takeout/starter-screenshots/android-003.jpeg',
  '/takeout/starter-screenshots/android-004.jpeg',
  '/takeout/starter-screenshots/android-005.jpeg',
  '/takeout/starter-screenshots/android-006.jpeg',
  '/takeout/starter-screenshots/android-007.jpeg',
  '/takeout/starter-screenshots/android-008.jpeg',
  '/takeout/starter-screenshots/android-009.jpeg',
  '/takeout/starter-screenshots/android-010.jpeg',
  '/takeout/starter-screenshots/android-011.jpeg',
  '/takeout/starter-screenshots/android-012.jpeg',
  '/takeout/starter-screenshots/android-013.jpeg',
  '/takeout/starter-screenshots/android-014.jpeg',
]

const iosImages = [
  '/takeout/starter-screenshots/ios-001.jpeg',
  '/takeout/starter-screenshots/ios-002.jpeg',
  '/takeout/starter-screenshots/ios-003.jpeg',
  '/takeout/starter-screenshots/ios-004.jpeg',
  '/takeout/starter-screenshots/ios-005.jpeg',
  '/takeout/starter-screenshots/ios-006.jpeg',
  '/takeout/starter-screenshots/ios-007.jpeg',
  '/takeout/starter-screenshots/ios-008.jpeg',
  '/takeout/starter-screenshots/ios-009.jpeg',
  '/takeout/starter-screenshots/ios-010.jpeg',
  '/takeout/starter-screenshots/ios-011.jpeg',
  '/takeout/starter-screenshots/ios-012.jpeg',
  '/takeout/starter-screenshots/ios-013.jpeg',
  '/takeout/starter-screenshots/ios-014.jpeg',
]

const webImages = [
  '/takeout/starter-screenshots/web-001.jpeg',
  '/takeout/starter-screenshots/web-002.jpeg',
  '/takeout/starter-screenshots/web-003.jpeg',
  '/takeout/starter-screenshots/web-004.jpeg',
  '/takeout/starter-screenshots/web-005.jpeg',
  '/takeout/starter-screenshots/web-006.jpeg',
  '/takeout/starter-screenshots/web-007.jpeg',
  '/takeout/starter-screenshots/web-008.jpeg',
  '/takeout/starter-screenshots/web-009.jpeg',
  '/takeout/starter-screenshots/web-010.jpeg',
]

const takeoutImages = [
  { src: '/takeout/starter-screenshots/ios.jpg', alt: 'iOS mockup' },
  ...iosImages.map((src, idx) => ({
    src,
    alt: `iOS screenshot #${idx + 1}`,
  })),
  { src: '/takeout/starter-screenshots/web.jpg', alt: 'Web mockup' },

  ...webImages.map((src, idx) => ({
    src,
    alt: `Web screenshot #${idx + 1}`,
  })),
  {
    src: '/takeout/starter-screenshots/android.jpg',
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
        ai="center"
        jc="center"
        gap="$6"
        px="$4"
        $md={{
          flexDirection: 'column',
        }}
      >
        <TakeoutImage
          index={takeoutIosImageIdx}
          pos="absolute"
          w="100%"
          h="100%"
          src={takeoutImages[takeoutIosImageIdx].src}
          alt={takeoutImages[takeoutIosImageIdx].alt}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          wrapperProps={{
            flex: 1,
            position: 'relative',
            height: 300,

            borderRadius: '$12',
            overflow: 'hidden',
            $md: {
              width: '100%',
            },
          }}
        />

        <TakeoutImage
          index={takeoutWebImageIdx}
          src={takeoutImages[takeoutWebImageIdx].src}
          alt={takeoutImages[takeoutWebImageIdx].alt}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          pos="absolute"
          w="100%"
          h="100%"
          wrapperProps={{
            flex: 2,
            position: 'relative',
            height: 300,

            borderRadius: '$12',
            overflow: 'hidden',
            $md: {
              width: '100%',
            },
          }}
        />

        <TakeoutImage
          index={takeoutAndroidImageIdx}
          src={takeoutImages[takeoutAndroidImageIdx].src}
          alt={takeoutImages[takeoutAndroidImageIdx].alt}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          pos="absolute"
          w="100%"
          h="100%"
          wrapperProps={{
            flex: 1,
            position: 'relative',
            height: 300,

            borderRadius: '$12',
            overflow: 'hidden',
            $md: {
              width: '100%',
            },
          }}
        />
      </XStack>

      <Spacer size="$8" />

      <XStack fw="wrap" gap="$4" mx="$1" ai="center" jc="center">
        {takeoutImages.slice(1, 12).map((image, index) => (
          <YStack key={index} pos="relative">
            <TakeoutImage
              alt={image.alt}
              src={image.src}
              style={{ objectFit: 'cover' }}
              width={100}
              height={100}
              index={index}
              wrapperProps={{
                br: '$10',
              }}
            />
          </YStack>
        ))}
        <YStack pos="relative" overflow="hidden">
          <YStack
            onPress={() => {
              store.galleryOpen = true
            }}
            width={100}
            height={100}
            bg="$color12"
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
          gap="$4"
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
                top="$6"
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
      backgroundColor="rgba(0,0,0,0.9)"
      position="relative"
      height="100vh"
      width="100vw"
      alignItems="center"
    >
      <AnimatePresence enterVariant={enterVariant} exitVariant={exitVariant}>
        <YStackEnterable
          key={store.galleryImageIdx}
          animation="medium"
          x={0}
          opacity={1}
          width="100vw"
          height="100vh"
          pos="absolute"
        >
          <Image
            key={store.galleryImageIdx}
            src={currentImage.src}
            alt={currentImage.alt}
            width="100%"
            height="100%"
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
      bw={1}
      bc="$color5"
      ov="hidden"
      elevation="$3"
      cursor="pointer"
      animation="100ms"
      hoverStyle={{ scale: 1.015 }}
      pressStyle={{ scale: 0.975 }}
      {...wrapperProps}
    >
      <Image {...props} />
    </XStack>
  )
}
