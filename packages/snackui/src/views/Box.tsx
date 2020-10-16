import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { StackProps, VStack } from './Stacks'

const defaultProps: StackProps = {
  backgroundColor: '#fff',
  padding: 5,
  borderRadius: 12,
  shadowColor: 'rgba(0,0,0,0.125)',
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 3 },
  overflow: 'hidden',
}

export type BoxProps = StackProps

export function Box(props: BoxProps) {
  return <VStack {...defaultProps} {...props} />
}

if (process.env.IS_STATIC) {
  Box.staticConfig = extendStaticConfig(VStack, {
    defaultProps,
  })
}
