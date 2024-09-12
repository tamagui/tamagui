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
      <Path d="M12 22v-6" stroke={color} />
      <Path d="M12 8V2" stroke={color} />
      <Path d="M4 12H2" stroke={color} />
      <Path d="M10 12H8" stroke={color} />
      <Path d="M16 12h-2" stroke={color} />
      <Path d="M22 12h-2" stroke={color} />
      <Path d="m15 19-3 3-3-3" stroke={color} />
      <Path d="m15 5-3-3-3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UnfoldVertical'

export const UnfoldVertical = React.memo<IconProps>(themed(Icon))
