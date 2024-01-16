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
      <_Circle cx="10" cy="7" r="4" stroke={color} />
      <Path d="M10.3 15H7a4 4 0 0 0-4 4v2" stroke={color} />
      <_Circle cx="17" cy="17" r="3" stroke={color} />
      <Path d="m21 21-1.9-1.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserSearch'

export const UserSearch = memo<IconProps>(themed(Icon))
