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
      <Path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" stroke={color} />
      <Path d="M9 19.8V15m0 0H4.2M9 15l-6 6" stroke={color} />
      <Path d="M15 4.2V9m0 0h4.8M15 9l6-6" stroke={color} />
      <Path d="M9 4.2V9m0 0H4.2M9 9 3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Shrink'

export const Shrink = React.memo<IconProps>(themed(Icon))
