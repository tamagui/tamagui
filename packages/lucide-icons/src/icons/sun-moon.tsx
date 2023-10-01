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
      <_Circle cx="12" cy="12" r="4" stroke={color} />
      <Path d="M12 8a2 2 0 1 0 4 4" stroke={color} />
      <Path d="M12 2v2" stroke={color} />
      <Path d="M12 20v2" stroke={color} />
      <Path d="m4.93 4.93 1.41 1.41" stroke={color} />
      <Path d="m17.66 17.66 1.41 1.41" stroke={color} />
      <Path d="M2 12h2" stroke={color} />
      <Path d="M20 12h2" stroke={color} />
      <Path d="m6.34 17.66-1.41 1.41" stroke={color} />
      <Path d="m19.07 4.93-1.41 1.41" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SunMoon'

export const SunMoon = memo<IconProps>(themed(Icon))
