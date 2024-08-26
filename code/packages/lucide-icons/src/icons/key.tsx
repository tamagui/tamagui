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
      <_Circle cx="7.5" cy="15.5" r="5.5" stroke={color} />
      <Path d="m21 2-9.6 9.6" stroke={color} />
      <Path d="m15.5 7.5 3 3L22 7l-3-3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Key'

export const Key = React.memo<IconProps>(themed(Icon))
