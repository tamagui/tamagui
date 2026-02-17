import { H1, YStack } from 'tamagui'
import { useFontLoaded } from '~/features/site/fonts/LoadFonts'
import { useDisableMotion } from '~/hooks/useDisableMotion'

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
  const disableMotion = useDisableMotion()
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

//  {!disableMotion && (
//           <YStack
//             fullscreen
//             $theme-dark={{
//               opacity: 0.5,
//             }}
//             $theme-light={{
//               opacity: 1,
//             }}
//           >
//             {/* main color slices */}
//             {/* <ThemeTintAlt offset={5}>
//               <TAKEOUT
//                 color="$color10"
//                 className="clip-slice"
//                 position="absolute"
//                 opacity={0.3}
//                 z={1001}
//               />
//             </ThemeTintAlt> */}

//             <Theme name="red">
//               <TAKEOUT
//                 color="$color9"
//                 className="clip-slice mix-blend"
//                 position="absolute"
//                 opacity={1}
//                 z={1002}
//               />
//             </Theme>

//             {/* alt color slices */}
//             <Theme name="red">
//               <TAKEOUT
//                 color="$color9"
//                 className="clip-slice-2 mix-blend"
//                 position="absolute"
//                 opacity={0.5}
//                 z={1002}
//               />
//             </Theme>

//             {/* secondary slice layer */}
//             {/* <ThemeTintAlt offset={-2}>
//               <TAKEOUT
//                 color="$color7"
//                 className="clip-slice-2 mix-blend"
//                 position="absolute"
//                 opacity={1}
//                 z={1001}
//               />
//             </ThemeTintAlt> */}
//           </YStack>
//         )}
