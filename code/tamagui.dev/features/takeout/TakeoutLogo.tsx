import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { H1, YStack } from 'tamagui'
import { useDisableMotion } from '~/hooks/useDisableMotion'
import { isSafari } from './helpers'

export const TAKEOUT = ({ fontSize = 260, lineHeight = fontSize * 0.73, ...props }) => (
  <H1
    select="none"
    color="transparent"
    fontFamily="$cherryBomb"
    fontSize={fontSize}
    lineHeight={lineHeight}
    whiteSpace="nowrap"
    minW={900}
    text="center"
    {...props}
  >
    Take
    <br />
    <span style={{ display: 'inline-flex', transform: 'translateY(-65px)' }}>out</span>
  </H1>
)

export const TakeoutLogo = (props: { scale?: number }) => {
  const disableMotion = useDisableMotion()

  return (
    <YStack
      contain="paint"
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
        <TAKEOUT className="text-3d" zi={1000} color="$color5" />
      </YStack> */}

      <YStack
        mt={0}
        z={0}
        className="mix-blend"
        // style={{
        //   clipPath: `polygon(0% 0%, 0% 100%, 100% 100%, 0% 0%, 100% 0, 0% 100%)`,
        // }}
      >
        <ThemeTintAlt>
          <TAKEOUT className="font-outlined" zi={1000} color="var(--color8)" />
        </ThemeTintAlt>

        {!disableMotion && !isSafari() && (
          <>
            {/* main color slices */}
            <ThemeTint>
              <TAKEOUT
                color="$color1"
                className="clip-slice mix-blend"
                position="absolute"
                opacity={1}
                z={1001}
              />
            </ThemeTint>

            {/* alt color slices */}
            <ThemeTintAlt>
              <TAKEOUT
                color="$color7"
                className="clip-slice mix-blend"
                position="absolute"
                opacity={1}
                z={1002}
              />
            </ThemeTintAlt>

            {/* secondary slice layer */}
            <ThemeTintAlt offset={-2}>
              <TAKEOUT
                color="$color7"
                className="clip-slice-2 mix-blend"
                position="absolute"
                opacity={1}
                z={1001}
              />
            </ThemeTintAlt>
          </>
        )}
      </YStack>
    </YStack>
  )
}
