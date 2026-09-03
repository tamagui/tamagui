import { H1, YStack } from 'tamagui'
import { useFontLoaded } from '~/features/site/fonts/LoadFonts'

// the wordmark is a 900px-wide nowrap H1 scaled down by transform, so it sits absolutely
// inside a sized box - otherwise its layout width overflows the page on small screens
export const TakeoutLogo = () => {
  const fontLoaded = useFontLoaded('Cherry Bomb')

  return (
    <YStack
      width="100%"
      height="430px md:350px sm:250px xs:180px xxs:140px"
      items="center"
      justify="center"
      position="relative"
      overflow="hidden"
      opacity={fontLoaded ? 1 : 0}
    >
      <YStack position="absolute">
        <H1
          select="none"
          fontFamily="cherryBomb"
          fontSize={320}
          lineHeight={234}
          whiteSpace="nowrap"
          minW={900}
          text="center"
          scale="md:0.8 sm:0.55 xs:0.42 xxs:0.32"
        >
          Take
          <br />
          <span style={{ display: 'inline-flex', transform: 'translateY(-65px)' }}>
            out
          </span>
        </H1>
      </YStack>
    </YStack>
  )
}
