import { AnimationsDemo as AnimationsDemoBase } from '@tamagui/demos'
import React from 'react'

import { useTint } from './ColorToggleButton'

export const AnimationsDemo = (props) => {
  const { tint } = useTint()
  return <AnimationsDemoBase tint={tint} {...props} />
}
