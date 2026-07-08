import { H1, YStack } from 'tamagui'
import { useFontLoaded } from '~/features/site/fonts/LoadFonts'

export const TAKEOUT = ({ fontSize = 320, lineHeight = fontSize * 0.73, ...props }) => (
  <H1
    select="none"
    fontFamily="$cherryBomb"
    fontSize={fontSize}
    lineHeight={lineHeight}
    whiteSpace="nowrap"
    minW={900}
    $sm={{
      scale: 0.5,
      m: -75,
    }}
    text="center"
    {...props}
  >
    Take
    <br />
    <span style={{ display: 'inline-flex', transform: 'translateY(-65px)' }}>out</span>
  </H1>
)

export const TakeoutLogo = (props: { scale?: number }) => {
  const fontLoaded = useFontLoaded('Cherry Bomb')

  return (
    <YStack
      contain="paint"
      opacity={fontLoaded ? 1 : 0}
      {...(typeof props.scale === 'number' && {
        scale: props.scale,
        margin: -(1 - props.scale) * 295,
      })}
    >
      {/* <YStack
        position="absolute"
        style={{
          clipPath: `polygon(0% 0%, 0% 0%, 100% 100%, 100% 0%, 100% 0, 0% 100%)`,
        }}
      >
        <ThemeTintAlt offset={-2}>
          <TAKEOUT className="text-3d" zi={1000} color="$color8" />
        </ThemeTintAlt>
      </YStack> */}

      <YStack
        mt={0}
        z={0}
        // className="mix-blend"
        // style={{
        //   clipPath: `polygon(0% 0%, 0% 100%, 100% 100%, 0% 0%, 100% 0, 0% 100%)`,
        // }}
      >
        <>
          <TAKEOUT zi={1000} />
        </>
      </YStack>
    </YStack>
  )
}
