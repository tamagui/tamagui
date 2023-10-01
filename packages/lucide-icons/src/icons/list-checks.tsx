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
  Symbol,
  Use,
  Circle as _Circle,
  Text as _Text,
} from 'react-native-svg'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Line x1="10" x2="21" y1="6" y2="6" stroke={color} />
      <Line x1="10" x2="21" y1="12" y2="12" stroke={color} />
      <Line x1="10" x2="21" y1="18" y2="18" stroke={color} />
      <Polyline points="3 6 4 7 6 5" stroke={color} />
      <Polyline points="3 12 4 13 6 11" stroke={color} />
      <Polyline points="3 18 4 19 6 17" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListChecks'

export const ListChecks = memo<IconProps>(themed(Icon))
