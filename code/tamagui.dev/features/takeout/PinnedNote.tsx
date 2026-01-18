import { Image } from '@tamagui/image'
import { SizableText, Theme, YStack } from 'tamagui'
import {
  useScrollProgress,
  WEB_FRAME_SCROLL_START,
  WEB_FRAME_SCROLL_END,
} from './useScrollProgress'

export const PinnedNote = () => {
  const scrollProgress = useScrollProgress(WEB_FRAME_SCROLL_START, WEB_FRAME_SCROLL_END)

  const opacity = scrollProgress
  const x = 30 * (1 - scrollProgress)

  return (
    <YStack
      //@ts-ignore
      position="fixed"
      t={100}
      r={20}
      z={1000}
      rotate="-3deg"
      opacity={opacity}
      x={x}
      className="ease-out ms500 all"
      $md={{ r: 10 }}
      $sm={{ display: 'none' }}
    >
      <Image
        src="/takeout/pixel-icons/pin.svg"
        alt="Pin"
        width={36}
        height={36}
        position="absolute"
        t={-18}
        l="50%"
        x={-18}
        z={1}
      />
      <Theme name="orange">
        <YStack
          bg="$color4"
          px="$4"
          py="$5"
          pt="$6"
          pb="$6"
          elevation="$3"
          width={120}
          minH={100}
          justify="center"
          rounded="$1"
        >
          <SizableText
            size="$3"
            fontFamily="$mono"
            color="$color12"
            fontWeight="600"
            text="center"
          >
            Buy ONE get TWO
          </SizableText>
        </YStack>
      </Theme>
    </YStack>
  )
}
