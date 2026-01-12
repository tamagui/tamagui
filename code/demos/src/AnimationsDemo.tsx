import { LogoIcon } from '@tamagui/logo'
import { Play } from '@tamagui/lucide-icons'
import { Button, isWeb, Square, useControllableState, Image, useEvent } from 'tamagui'

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
        animateOnly={['transform']}
        onPress={onPress}
        size={104}
        borderColor="$borderColor"
        borderWidth={1}
        rounded="$9"
        bg="$color9"
        hoverStyle={{
          scale: 1.01,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...position}
      >
        {isWeb && <LogoIcon downscale={0.75} />}
      </Square>

      <Button
        position="absolute"
        b={20}
        l={20}
        icon={Play}
        theme={props.tint}
        size="$5"
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
    scale: 1,
    rotate: '0deg',
  },
  {
    x: -50,
    y: -50,
    scale: 0.5,
    rotate: '-45deg',
    hoverStyle: {
      scale: 0.6,
    },
    pressStyle: {
      scale: 0.4,
    },
  },
  {
    x: 50,
    y: 50,
    scale: 1,
    rotate: '180deg',
    hoverStyle: {
      scale: 1.1,
    },
    pressStyle: {
      scale: 0.9,
    },
  },
]
