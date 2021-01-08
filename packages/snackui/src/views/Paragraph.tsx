import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { getSizedTextProps } from './getSizedTextProps'
import { SizableTextProps } from './Size'
import { Text } from './Text'

export type ParagraphProps = SizableTextProps

export const Paragraph = (props: SizableTextProps) => {
  return <Text {...defaultProps} {...getSizedTextProps(props)} {...props} />
}

const defaultProps: ParagraphProps = {
  color: 'rgba(0,0,0,0.88)',
  fontWeight: '400',
  selectable: true,
  size: 'md',
}

if (process.env.IS_STATIC) {
  Paragraph.staticConfig = extendStaticConfig(Text, {
    defaultProps,
    expansionProps: {
      size: getSizedTextProps,
      sizeLineHeight: getSizedTextProps,
    },
  })
}
