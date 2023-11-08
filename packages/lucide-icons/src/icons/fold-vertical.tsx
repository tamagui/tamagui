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
      <Path d="M12 22v-6" stroke={color} />
      <Path d="M12 8V2" stroke={color} />
      <Path d="M4 12H2" stroke={color} />
      <Path d="M10 12H8" stroke={color} />
      <Path d="M16 12h-2" stroke={color} />
      <Path d="M22 12h-2" stroke={color} />
      <Path d="m15 19-3-3-3 3" stroke={color} />
      <Path d="m15 5-3 3-3-3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FoldVertical'

export const FoldVertical = memo<IconProps>(themed(Icon))
