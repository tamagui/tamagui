import { Play } from '@tamagui/lucide-icons'
import { LogoIcon } from '@tamagui/logo'
import React from 'react'
import { Button, Square, useControllableState } from 'tamagui'

export function AnimationsDemo(props) {
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
        focusable={false}
        animation={props.animation || 'bouncy'}
        onPress={() => next()}
        size={104}
        boc="$backgroundHover"
        bw={1}
        br="$9"
        bc="$backgroundStrong"
        hoverStyle={{
          scale: 1.1,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...position}
      >
        {props.children || <LogoIcon downscale={0.75} />}
      </Square>

      <Button
        pos="absolute"
        b={20}
        l={20}
        icon={Play}
        theme={props.tint}
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
