import React from 'react'

import { useTheme } from '../hooks/useTheme'
import { getSizedTextProps } from './getSizedTextProps'
import { SizableTextProps } from './Size'
import { Text } from './Text'

export type ParagraphProps = SizableTextProps

const defaultProps: ParagraphProps = {
  color: 'rgba(0,0,0,0.88)',
  fontWeight: '400',
  selectable: true,
  size: 'md',
}

export const Paragraph = (props: SizableTextProps) => {
  const theme = useTheme()
  return <Text {...defaultProps} color={theme.color} {...getSizedTextProps(props)} {...props} />
}
