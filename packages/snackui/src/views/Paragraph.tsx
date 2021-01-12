import React from 'react'

import { isWeb } from '../constants'
import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { getSizedTextProps } from './getSizedTextProps'
import { SizableTextProps } from './Size'
import { Text } from './Text'

export type ParagraphProps = SizableTextProps

export const Paragraph = (props: SizableTextProps) => {
  return <Text {...defaultProps} {...getSizedTextProps(props)} {...props} />
}

const defaultProps: ParagraphProps = {
  // TODO we need to support a more robust extraction system to support this
  // as a useTheme(). Basically would have to run SnackUI internally on itself
  // and then figure out the spreads/themes/etc, then use that in the future.
  // would open up ability to have users components static extract.
  color: isWeb ? 'var(--color)' : 'rgba(0,0,0,0.88)',
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
