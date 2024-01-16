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
      <Path d="M2 21a8 8 0 0 1 10.434-7.62" stroke={color} />
      <_Circle cx="10" cy="8" r="5" stroke={color} />
      <_Circle cx="18" cy="18" r="3" stroke={color} />
      <Path d="m19.5 14.3-.4.9" stroke={color} />
      <Path d="m16.9 20.8-.4.9" stroke={color} />
      <Path d="m21.7 19.5-.9-.4" stroke={color} />
      <Path d="m15.2 16.9-.9-.4" stroke={color} />
      <Path d="m21.7 16.5-.9.4" stroke={color} />
      <Path d="m15.2 19.1-.9.4" stroke={color} />
      <Path d="m19.5 21.7-.4-.9" stroke={color} />
      <Path d="m16.9 15.2-.4-.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserRoundCog'

export const UserRoundCog = memo<IconProps>(themed(Icon))
