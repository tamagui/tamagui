import { LogoIcon } from '@tamagui/logo'
import { Play } from '@tamagui/lucide-icons-2'
import { isWeb, Square, useControllableState, Image, useEvent } from 'tamagui'
import { Button } from './Button'

export function AnimationsDemo(props) {
  const [positionI, setPositionI] = useControllableState({
    strategy: 'most-recent-wins',
    prop: props.position,
    defaultProp: 0,
  })
  const position = positions[positionI]
  const onPress = useEvent(() => {
    setPositionI((x) => {
      return (x + 1) % positions.length
    })
  })

  return (
    <>
      <Square
        transition={props.animation ?? 'bouncy'}
        borderColor="border-color"
        borderWidth={1}
        rounded="9"
        bg="color9"
        {...position}
        animateOnly={['transform']}
        onPress={onPress}
        size={104}
      >
        {isWeb && <LogoIcon downscale={0.75} />}
      </Square>

      <Button
        position="absolute"
        b={20}
        l={20}
        icon={Play}
        theme={props.tint ?? 'level3'}
        size="5"
        circular
        onPress={onPress}
      />
    </>
  )
}

export const positions = [
  {
    x: 0,
    y: 0,
    scale: '1 hover:1.01 press:0.9',
    rotate: '0deg',
  },
  {
    x: -50,
    y: -50,
    scale: '0.5 hover:0.6 press:0.4',
    rotate: '-45deg',
  },
  {
    x: 50,
    y: 50,
    scale: '1 hover:1.1 press:0.9',
    rotate: '180deg',
  },
]
