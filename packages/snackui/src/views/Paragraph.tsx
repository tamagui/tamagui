import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { useTheme } from '../hooks/useTheme'
import { getSizedTextProps } from './getSizedTextProps'
import { SizableTextProps } from './Size'
import { Text } from './Text'

export type ParagraphProps = SizableTextProps

const defaultProps: ParagraphProps = {
  fontWeight: '400',
  selectable: true,
  size: 'md',
}

export const Paragraph = (props: SizableTextProps) => {
  const theme = useTheme()
  const finalProps = getSizedTextProps({ ...defaultProps, ...props })
  if (props['children'] === 'San Francisco') {
    console.log('got', props, finalProps)
  }
  return <Text color={theme.color} {...finalProps} />
}

if (process.env.IS_STATIC) {
  // @ts-ignore
  Paragraph.staticConfig = extendStaticConfig(Text, {
    defaultProps,
    postProcessStyles: getSizedTextProps,
    // preProcessProps: getSizedTextProps,
    neverFlatten: true,
  })
}
