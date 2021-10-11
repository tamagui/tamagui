import React, { forwardRef } from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { combinePropMappers, propMapReducer } from '../helpers/PropMapper'
import { useTheme } from '../hooks/useTheme'
import { SizableTextProps } from './SizableTextProps'
import { getSize } from './Size'
import { Text, textPropMapper } from './Text'

export type ParagraphProps = SizableTextProps

const defaultProps: ParagraphProps = {
  selectable: true,
  sizeLineHeight: 1,
  size: 'md',
}

export const paragraphPropMapper = combinePropMappers(
  textPropMapper,
  (key, val, props: SizableTextProps) => {
    if (key === 'size') {
      if (props.fontSize) return true
      const sizeAmt = getSize(val ?? 1)
      return [['fontSize', Math.round(16 * sizeAmt)]]
    }
    if (key === 'sizeLineHeight') {
      const sizeAmt = getSize(val ?? props.size ?? 1)
      const lineHeightScaleWithSize = -(2 - sizeAmt) * 0.55
      const lineHeight = Math.round(
        (26 + lineHeightScaleWithSize) * sizeAmt * (props.sizeLineHeight ?? 1)
      )
      return [
        ['lineHeight', lineHeight],
        ['marginVertical', -lineHeight * 0.08],
      ]
    }
  }
)

export const Paragraph = forwardRef((props: SizableTextProps, ref) => {
  const theme = useTheme()
  return (
    <Text
      // @ts-ignore
      ref={ref}
      color={theme.color}
      {...props}
      {...propMapReducer(paragraphPropMapper, props)}
    />
  )
})

if (process.env.IS_STATIC) {
  // @ts-ignore
  Paragraph.staticConfig = extendStaticConfig(Text, {
    defaultProps,
    propMapper: paragraphPropMapper,
    neverFlatten: true,
  })
}
