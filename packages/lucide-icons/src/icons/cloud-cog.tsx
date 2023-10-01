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
      <Path
        d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"
        stroke={color}
      />
      <_Circle cx="12" cy="17" r="3" stroke={color} />
      <Path d="M12 13v1" stroke={color} />
      <Path d="M12 20v1" stroke={color} />
      <Path d="M16 17h-1" stroke={color} />
      <Path d="M9 17H8" stroke={color} />
      <Path d="m15 14-.88.88" stroke={color} />
      <Path d="M9.88 19.12 9 20" stroke={color} />
      <Path d="m15 20-.88-.88" stroke={color} />
      <Path d="M9.88 14.88 9 14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CloudCog'

export const CloudCog = memo<IconProps>(themed(Icon))
