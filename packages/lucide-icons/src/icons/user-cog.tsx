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
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={color} />
      <_Circle cx="9" cy="7" r="4" stroke={color} />
      <_Circle cx="19" cy="11" r="2" stroke={color} />
      <Path d="M19 8v1" stroke={color} />
      <Path d="M19 13v1" stroke={color} />
      <Path d="m21.6 9.5-.87.5" stroke={color} />
      <Path d="m17.27 12-.87.5" stroke={color} />
      <Path d="m21.6 12.5-.87-.5" stroke={color} />
      <Path d="m17.27 10-.87-.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserCog'

export const UserCog = memo<IconProps>(themed(Icon))
