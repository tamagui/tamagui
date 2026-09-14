import { createElement } from 'react'
import { View, styled } from 'tamagui'

import './tamagui.config'

const CheckpointPublicView = styled(
  View,
  {
    backgroundColor: '$background',
    padding: '$2',
    variants: {
      tone: {
        warm: {
          backgroundColor: 'rgb(253,186,116) hover:rgb(234,88,12)',
        },
        cool: {
          backgroundColor: 'rgb(147,197,253) hover:rgb(37,99,235)',
        },
      },
      elevated: {
        true: {
          y: '0 hover:-2',
          scale: '1 press:0.98',
        },
      },
    },
  } as any,
  { acceptsClassName: true }
)

const dynamic = (globalThis as any).__checkpoint0PublicInput ?? {
  tone: 'warm',
  elevated: true,
  group: 'card',
  containerName: 'card',
  width: '24px sm:32px @sm/card:40px',
  height: { default: 24, hover: 30 },
  opacity: '1 enter:0.2 disabled:0.5',
  rotate: '0deg hover:3deg',
  transition: 'bouncy',
}

;(globalThis as any).__checkpoint0PublicView = createElement(
  CheckpointPublicView,
  dynamic
)
