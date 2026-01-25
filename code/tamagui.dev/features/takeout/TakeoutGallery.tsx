import { Image, type ImageProps } from '@tamagui/image'
import { ArrowLeft, ArrowRight, X } from '@tamagui/lucide-icons'
import { createUseStore } from '@tamagui/use-store'
import { useEffect } from 'react'
import type { ViewProps } from 'tamagui'
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
  '/takeout/starter-screenshots/android-001.jpg',
  '/takeout/starter-screenshots/android-002.jpg',
  '/takeout/starter-screenshots/android-003.jpg',
  '/takeout/starter-screenshots/android-004.jpg',
  '/takeout/starter-screenshots/android-005.jpg',
  '/takeout/starter-screenshots/android-006.jpg',
  '/takeout/starter-screenshots/android-007.jpg',
  '/takeout/starter-screenshots/android-008.jpg',
  '/takeout/starter-screenshots/android-009.jpg',
]

const iosImages = [
  '/takeout/starter-screenshots/ios-001.jpg',
  '/takeout/starter-screenshots/ios-002.jpg',
  '/takeout/starter-screenshots/ios-003.jpg',
  '/takeout/starter-screenshots/ios-004.jpg',
  '/takeout/starter-screenshots/ios-005.jpg',
  '/takeout/starter-screenshots/ios-006.jpg',
  '/takeout/starter-screenshots/ios-007.jpg',
  '/takeout/starter-screenshots/ios-008.jpg',
  '/takeout/starter-screenshots/ios-009.jpg',
  '/takeout/starter-screenshots/ios-010.jpg',
  '/takeout/starter-screenshots/ios-011.jpg',
  '/takeout/starter-screenshots/ios-012.jpg',
  '/takeout/starter-screenshots/ios-013.jpg',
  '/takeout/starter-screenshots/ios-014.jpg',
]

const webImages = [
  '/takeout/starter-screenshots/web-001.jpg',
  '/takeout/starter-screenshots/web-002.jpg',
  '/takeout/starter-screenshots/web-003.jpg',
  '/takeout/starter-screenshots/web-004.jpg',
  '/takeout/starter-screenshots/web-005.jpg',
  '/takeout/starter-screenshots/web-006.jpg',
  '/takeout/starter-screenshots/web-008.jpeg',
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

// Export for external use
export { useGalleryStore }

// Export just the dialog for use in other pages
export function TakeoutGalleryDialog() {
  return <ImageGallery />
}

export default function TakeoutGallery() {
  const store = useGalleryStore()

  return (
    <>
      <ImageGallery />

      <XStack
        items="center"
        justify="center"
        gap="$6"
        px="$4"
        width="100%"
        $md={{
          flexDirection: 'column',
        }}
      >
        <TakeoutImage
          index={takeoutIosImageIdx}
          position="absolute"
          width="100%"
          height="100%"
          src={takeoutImages[takeoutIosImageIdx].src}
          alt={takeoutImages[takeoutIosImageIdx].alt}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          wrapperProps={{
            flex: 1,
            flexBasis: 'auto',
            position: 'relative',
            height: 300,

            rounded: '$12',
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
          position="absolute"
          width="100%"
          height="100%"
          wrapperProps={{
            flex: 2,
            flexBasis: 'auto',
            position: 'relative',
            height: 300,

            rounded: '$12',
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
          position="absolute"
          width="100%"
          height="100%"
          wrapperProps={{
            flex: 1,
            flexBasis: 'auto',
            position: 'relative',
            height: 300,

            rounded: '$12',
            overflow: 'hidden',
            $md: {
              width: '100%',
            },
          }}
        />
      </XStack>

      <Spacer size="$8" />

      <XStack flexWrap="wrap" gap="$4" mx="$1" items="center" justify="center">
        {takeoutImages.slice(1, 12).map((image, index) => (
          <YStack key={index} position="relative">
            <TakeoutImage
              alt={image.alt}
              src={image.src}
              style={{ objectFit: 'cover' }}
              width={100}
              height={100}
              index={index}
              wrapperProps={{
                rounded: '$10',
              }}
            />
          </YStack>
        ))}
        <YStack position="relative" overflow="hidden">
          <YStack
            onPress={() => {
              store.galleryOpen = true
            }}
            width={100}
            height={100}
            bg="$color12"
            rounded="$6"
            overflow="hidden"
            elevation="$2"
            cursor="pointer"
            items="center"
            justify="center"
          >
            <H6 fontFamily="$mono" color="black">
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
      <Dialog.Portal zIndex={100000001}>
        <Dialog.Overlay
          key="overlay"
          transition="lazy"
          opacity={0.1}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          borderWidth={0.5}
          borderColor="$borderColor"
          elevate
          key="content"
          transition={[
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
            <YStack position="absolute" r="$6" b="$8" z={4}>
              <Paragraph
                textShadowColor="black"
                textShadowOffset={{ height: 1, width: 1 }}
                textShadowRadius={4}
                fontFamily="$mono"
              >
                {store.galleryImageIdx + 1} / {takeoutImages.length}
              </Paragraph>
            </YStack>

            <YStack position="absolute" l="$6" b="$8" z={4}>
              <Paragraph
                textShadowColor="black"
                textShadowOffset={{ height: 1, width: 1 }}
                textShadowRadius={4}
                fontFamily="$mono"
              >
                {takeoutImages[store.galleryImageIdx].alt}
              </Paragraph>
            </YStack>

            <Dialog.Close asChild>
              <Button position="absolute" t="$6" r="$6" size="$3" circular icon={X} />
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
      bg="rgba(0,0,0,0.9)"
      position="relative"
      height="100vh"
      width="100vw"
      items="center"
    >
      <AnimatePresence enterVariant={enterVariant} exitVariant={exitVariant}>
        <YStackEnterable
          key={store.galleryImageIdx}
          transition="medium"
          x={0}
          opacity={1}
          width="100vw"
          height="100vh"
          position="absolute"
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
        aria-label="Carousel left"
        icon={ArrowLeft}
        size="$5"
        position="absolute"
        l="$4"
        circular
        boxShadow="0 0 10px $shadowColor"
        onPress={() => store.paginateGallery(-1)}
      />
      <Button
        aria-label="Carousel right"
        icon={ArrowRight}
        size="$5"
        position="absolute"
        r="$4"
        circular
        boxShadow="0 0 10px $shadowColor"
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
}: ImageProps & { index: number; wrapperProps?: ViewProps }) => {
  const store = useGalleryStore()
  return (
    <XStack
      onPress={() => {
        store.galleryOpen = true
        store.galleryImageIdx = props.index
      }}
      rounded="$5"
      borderWidth={0.5}
      borderColor="$color5"
      overflow="hidden"
      elevation="$3"
      cursor="pointer"
      transition="100ms"
      hoverStyle={{ scale: 1.015 }}
      pressStyle={{ scale: 0.975 }}
      {...wrapperProps}
    >
      <Image {...props} />
    </XStack>
  )
}
