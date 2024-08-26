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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <Path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z" stroke={color} />
      <Line x1="9" x2="9.01" y1="9" y2="9" stroke={color} />
      <Line x1="15" x2="15.01" y1="9" y2="9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Laugh'

export const Laugh = React.memo<IconProps>(themed(Icon))
