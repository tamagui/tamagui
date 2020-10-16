import React from 'react'
import { TextStyle } from 'react-native'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { Text, TextProps } from './Text'

const defaultProps: TextStyle = {
  color: 'rgba(150,150,150,0.5)',
}

export const TextSecondary = (props: TextProps) => {
  return <Text {...defaultProps} {...props} />
}

if (process.env.IS_STATIC) {
  TextSecondary.staticConfig = extendStaticConfig(Text, {
    defaultProps,
  })
}
