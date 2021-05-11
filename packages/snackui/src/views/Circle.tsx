import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { StackProps } from '../StackProps'
import { VStack } from './Stacks'

export type CircleProps = StackProps & {
  size: number
}

const defaultProps: StackProps = {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 1000000000,
  overflow: 'hidden',
}

const getCircleSize = ({ size }: CircleProps) => ({
  width: size,
  height: size,
})

export const Circle = (props: CircleProps) => {
  const { size, ...rest } = props
  return <VStack {...defaultProps} {...getCircleSize(props)} {...rest} />
}

if (process.env.IS_STATIC) {
  // @ts-ignore
  Circle.staticConfig = extendStaticConfig(VStack, {
    defaultProps: defaultProps,
    preProcessProps: getCircleSize,
  })
}
