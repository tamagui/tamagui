import React from 'react'
import { TextStyle } from 'react-native'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { Text, TextProps } from './Text'

const defaultProps: TextStyle = {
  fontSize: 12,
  textAlignVertical: 'top',
  opacity: 0.5,
}

export function TextSuperScript(props: TextProps) {
  return <Text {...defaultProps} {...props} />
}

if (process.env.IS_STATIC) {
  TextSuperScript.staticConfig = extendStaticConfig(Text, {
    defaultProps,
  })
}
