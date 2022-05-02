import { Play } from '@tamagui/feather-icons'
import React from 'react'
import { Button, Square, useControllableState } from 'tamagui'

import { useTint } from '../ColorToggleButton'
import { LogoIcon } from '../TamaguiLogo'

export default (props) => {
  const { tint } = useTint()
  const [positionI, setPositionI] = useControllableState({
    strategy: 'most-recent-wins',
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
        onPress={() => next()}
        size={110}
        elevation="$4"
        bc="$pink10"
        br="$9"
        hoverStyle={{
          scale: 1.1,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...position}
      >
        <LogoIcon downscale={0.75} />
      </Square>

      <Button
        pos="absolute"
        b={20}
        l={20}
        iconAfter={Play}
        theme={tint}
        size="$5"
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
