import React, { createContext, forwardRef } from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { useTheme } from '../hooks/useTheme'
import { getSizedTextProps } from './getSizedTextProps'
import { SizableTextProps } from './SizableTextProps'
import { Text } from './Text'

export type ParagraphProps = SizableTextProps

const defaultProps: ParagraphProps = {
  selectable: true,
  sizeLineHeight: 1,
  size: 'md',
}

export const ParagraphContext = createContext(false)

export const Paragraph = forwardRef((props: SizableTextProps, ref) => {
  const theme = useTheme()
  const finalProps = getSizedTextProps(props, defaultProps)
  return (
    <ParagraphContext.Provider value={true}>
      <Text ref={ref} color={theme.color} {...finalProps} />
    </ParagraphContext.Provider>
  )
})

if (process.env.IS_STATIC) {
  // @ts-ignore
  Paragraph.staticConfig = extendStaticConfig(Text, {
    defaultProps,
    postProcessStyles: getSizedTextProps,
    // preProcessProps: getSizedTextProps,
    neverFlatten: true,
  })
}
