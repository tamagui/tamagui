import React, { forwardRef } from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { combinePropMappers, propMapReducer } from '../helpers/PropMapper'
import { useTheme } from '../hooks/useTheme'
import { Paragraph, paragraphPropMapper } from './Paragraph'
import { SizableTextProps } from './SizableTextProps'
import { getSize } from './Size'

// TODO simplify this a bit

export type TitleProps = SizableTextProps

const titleDefaultProps: TitleProps = {
  marginVertical: 0,
  sizeLineHeight: 0.7,
}

const titlePropMapper = combinePropMappers(paragraphPropMapper, (key, val) => {
  if (key === 'size') {
    // size up
    return [['size', getSize(val || 'md') * 1.5]]
  }
  return true
})

export const Title = forwardRef((props: TitleProps, ref) => {
  return (
    <Paragraph
      ref={ref}
      {...titleDefaultProps}
      {...props}
      {...propMapReducer(titlePropMapper, props)}
    />
  )
})

export const Heading = Title

if (process.env.IS_STATIC) {
  const staticConfig = extendStaticConfig(Paragraph, {
    defaultProps: titleDefaultProps,
    propMapper: titlePropMapper,
  })
  Title['staticConfig'] = staticConfig
  Heading['staticConfig'] = staticConfig
}

export const H1 = (props: TitleProps) => <Title accessibilityRole="header" size="xl" {...props} />

export const H2 = (props: TitleProps) => <Title accessibilityRole="header" size="md" {...props} />

export const H3 = (props: TitleProps) => {
  const theme = useTheme()
  return (
    <Title accessibilityRole="header" size="xs" fontWeight="800" color={theme.color3} {...props} />
  )
}

export const H4 = (props: TitleProps) => {
  const theme = useTheme()
  return (
    <Title
      textTransform="uppercase"
      accessibilityRole="header"
      size="xxs"
      color={theme.color3}
      {...props}
    />
  )
}

export const H5 = (props: TitleProps) => {
  const theme = useTheme()
  return <Title accessibilityRole="header" size="xxs" color={theme.color3} {...props} />
}

export const H6 = (props: TitleProps) => {
  const theme = useTheme()
  return <Title accessibilityRole="header" size="xxxs" color={theme.color3} {...props} />
}
