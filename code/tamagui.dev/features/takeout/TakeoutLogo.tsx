import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { useDisableMotion } from '~/hooks/useDisableMotion'
import { H1, YStack } from 'tamagui'

export const TAKEOUT = ({ fontSize = 280, lineHeight = fontSize * 0.74, ...props }) => (
  <H1
    userSelect="none"
    color="transparent"
    fontFamily="$silkscreen"
    fontSize={fontSize}
    lineHeight={lineHeight}
    letterSpacing={-18}
    whiteSpace="nowrap"
    minWidth={970}
    ta="center"
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
      <YStack
        pos="absolute"
        style={{
          clipPath: `polygon(0% 0%, 0% 0%, 100% 100%, 100% 0%, 100% 0, 0% 100%)`,
        }}
      >
        <>
          <>
            <TAKEOUT className="text-3d" zi={1000} color="$color8" />
          </>
        </>
      </YStack>

      <YStack
        mt={0}
        zi={0}
        className="mix-blend"
        style={{
          clipPath: `polygon(0% 0%, 0% 100%, 100% 100%, 0% 0%, 100% 0, 0% 100%)`,
        }}
      >
        <ThemeTintAlt offset={2}>
          <TAKEOUT className="font-outlined" zi={1000} color="var(--color8)" />
        </ThemeTintAlt>

        {!disableMotion && (
          <>
            {/* alt color slices */}
            {/* <ThemeTintAlt>
              <TAKEOUT
                color="$color7"
                className="clip-slice mix-blend slice-alt"
                pos="absolute"
                o={1}
                zi={1002}
              />
            </ThemeTintAlt> */}
            <ThemeTintAlt offset={2}>
              {/* main color slices */}
              <TAKEOUT
                color="$color7"
                className="clip-slice-2"
                pos="absolute"
                o={1}
                zi={1001}
              />
            </ThemeTintAlt>
          </>
        )}
      </YStack>
    </YStack>
  )
}
