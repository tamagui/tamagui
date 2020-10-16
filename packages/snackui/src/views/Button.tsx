import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { HStack, StackProps } from './Stacks'

export type ButtonProps = StackProps

// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing

export const Button = (props: ButtonProps) => {
  return <HStack {...defaultProps} {...props} />
}

const defaultProps: ButtonProps = {
  alignSelf: 'flex-start',
  pointerEvents: 'auto',
  // @ts-ignore
  cursor: 'pointer',
  padding: 5,
  borderRadius: 5,
  backgroundColor: 'rgba(150,150,150,0.05)',
  hoverStyle: {
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  pressStyle: {
    backgroundColor: 'rgba(150,150,150,0.2)',
  },
}

if (process.env.IS_STATIC) {
  Button.staticConfig = extendStaticConfig(HStack, {
    defaultProps,
  })
}
