import React from 'react'
import PropTypes from 'prop-types'
import type { IconProps } from '@tamagui/helpers-icon'
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

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
      <Polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" stroke={color} />
      <Line x1="9" x2="9" y1="3" y2="18" stroke={color} />
      <Line x1="15" x2="15" y1="6" y2="21" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Map'

export const Map = React.memo<IconProps>(themed(Icon))
