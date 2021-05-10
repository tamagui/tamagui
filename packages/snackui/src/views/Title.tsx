import React from 'react'

import { useTheme } from '../hooks/useTheme'
import { Paragraph } from './Paragraph'
import { SizableTextProps } from './SizableTextProps'
import { getSize } from './Size'

export type TitleProps = SizableTextProps

// TODO can static extract once paragraph works

export const Title = (props: TitleProps) => {
  const size = getSize(props.size ?? 'md') * 1.5
  return (
    <Paragraph fontWeight="300" marginVertical={0} sizeLineHeight={0.7} {...props} size={size} />
  )
}

export const H1 = (props: TitleProps) => <Title accessibilityRole="header" size="xl" {...props} />

export const H2 = (props: TitleProps) => <Title accessibilityRole="header" size="md" {...props} />

export const H3 = (props: TitleProps) => {
  const theme = useTheme()
  return (
    <Title
      accessibilityRole="header"
      size="xs"
      fontWeight="800"
      color={theme.colorTertiary}
      {...props}
    />
  )
}

export const H4 = (props: TitleProps) => (
  <Title
    textTransform="uppercase"
    accessibilityRole="header"
    size="xxs"
    color="rgba(0,0,0,0.7)"
    {...props}
  />
)

export const H5 = (props: TitleProps) => (
  <Title accessibilityRole="header" size="xxs" color="rgba(0,0,0,0.7)" {...props} />
)
