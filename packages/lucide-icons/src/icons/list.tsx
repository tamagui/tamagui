import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  SvgProps,
  Symbol,
  Use,
  Circle as _Circle,
  Text as _Text,
} from 'react-native-svg'

const Icon = (props: SvgProps) => {
  const { color = 'black', width = 24, height = 24, ...otherProps } = props
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Line x1="8" x2="21" y1="6" y2="6" stroke={color} />
      <Line x1="8" x2="21" y1="12" y2="12" stroke={color} />
      <Line x1="8" x2="21" y1="18" y2="18" stroke={color} />
      <Line x1="3" x2="3.01" y1="6" y2="6" stroke={color} />
      <Line x1="3" x2="3.01" y1="12" y2="12" stroke={color} />
      <Line x1="3" x2="3.01" y1="18" y2="18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'List'

export const List = memo<IconProps>(themed(Icon))
