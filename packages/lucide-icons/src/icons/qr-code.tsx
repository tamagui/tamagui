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
      <Rect width="5" height="5" x="3" y="3" rx="1" stroke={color} />
      <Rect width="5" height="5" x="16" y="3" rx="1" stroke={color} />
      <Rect width="5" height="5" x="3" y="16" rx="1" stroke={color} />
      <Path d="M21 16h-3a2 2 0 0 0-2 2v3" stroke={color} />
      <Path d="M21 21v.01" stroke={color} />
      <Path d="M12 7v3a2 2 0 0 1-2 2H7" stroke={color} />
      <Path d="M3 12h.01" stroke={color} />
      <Path d="M12 3h.01" stroke={color} />
      <Path d="M12 16v.01" stroke={color} />
      <Path d="M16 12h1" stroke={color} />
      <Path d="M21 12v.01" stroke={color} />
      <Path d="M12 21v-1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'QrCode'

export const QrCode = memo<IconProps>(themed(Icon))
