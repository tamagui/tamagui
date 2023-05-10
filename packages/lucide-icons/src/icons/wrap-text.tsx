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

import { IconProps } from '../IconProps'
import { themed } from '../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={`${color}`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Line x1="3" x2="21" y1="6" y2="6" fill="none" stroke={`${color}`} />
      <Path d="M3 12h15a3 3 0 1 1 0 6h-4" fill="none" stroke={`${color}`} />
      <Polyline points="16 16 14 18 16 20" fill="none" stroke={`${color}`} />
      <Line x1="3" x2="10" y1="18" y2="18" fill="none" stroke={`${color}`} />
    </Svg>
  )
}

Icon.displayName = 'WrapText'

export const WrapText = memo<IconProps>(themed(Icon))
