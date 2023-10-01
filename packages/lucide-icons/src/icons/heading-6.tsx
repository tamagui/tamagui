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
      <Path d="M4 12h8" stroke={color} />
      <Path d="M4 18V6" stroke={color} />
      <Path d="M12 18V6" stroke={color} />
      <_Circle cx="19" cy="16" r="2" stroke={color} />
      <Path d="M20 10c-2 2-3 3.5-3 6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Heading6'

export const Heading6 = memo<IconProps>(themed(Icon))
