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
      <Path d="M12 13V2l8 4-8 4" stroke={color} />
      <Path d="M20.55 10.23A9 9 0 1 1 8 4.94" stroke={color} />
      <Path d="M8 10a5 5 0 1 0 8.9 2.02" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Goal'

export const Goal = React.memo<IconProps>(themed(Icon))
