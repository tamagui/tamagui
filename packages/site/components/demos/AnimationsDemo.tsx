import { Play } from '@tamagui/feather-icons'
import React from 'react'
import { AnimationKeys, Button, Square, useControllableState } from 'tamagui'

import { useTint } from '../ColorToggleButton'
import { LogoIcon } from '../TamaguiLogo'

export default (props: { position?: number; animation?: AnimationKeys }) => {
  const { tint } = useTint()
  const [positionI, setPositionI] = useControllableState({
    prop: props.position,
    defaultProp: 0,
  })
  const position = positions[positionI]
  const next = (to = 1) => {
    setPositionI((x) => {
      return (x + to) % positions.length
    })
  }

  return (
    <>
      <Square
        animation={props.animation || 'bouncy'}
        elevation="$4"
        size={110}
        bc="$green10"
        br="$9"
        bw={2}
        boc="transparent"
        hoverStyle={{
          scale: 1.1,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...position}
        onPress={() => next()}
      >
        <LogoIcon downscale={0.75} />
      </Square>

      <Button
        pos="absolute"
        bottom={20}
        left={20}
        iconAfter={Play}
        theme={tint}
        size="$6"
        circular
        onPress={() => next()}
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
