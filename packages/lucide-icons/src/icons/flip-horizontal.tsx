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
      <Path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" stroke={color} />
      <Path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" stroke={color} />
      <Path d="M12 20v2" stroke={color} />
      <Path d="M12 14v2" stroke={color} />
      <Path d="M12 8v2" stroke={color} />
      <Path d="M12 2v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FlipHorizontal'

export const FlipHorizontal = memo<IconProps>(themed(Icon))
