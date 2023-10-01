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
        d="M5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1"
        stroke={color}
      />
      <Path
        d="M5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-1"
        stroke={color}
      />
      <Path d="M6 6h.01" stroke={color} />
      <Path d="M6 18h.01" stroke={color} />
      <_Circle cx="12" cy="12" r="3" stroke={color} />
      <Path d="M12 8v1" stroke={color} />
      <Path d="M12 15v1" stroke={color} />
      <Path d="M16 12h-1" stroke={color} />
      <Path d="M9 12H8" stroke={color} />
      <Path d="m15 9-.88.88" stroke={color} />
      <Path d="M9.88 14.12 9 15" stroke={color} />
      <Path d="m15 15-.88-.88" stroke={color} />
      <Path d="M9.88 9.88 9 9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ServerCog'

export const ServerCog = memo<IconProps>(themed(Icon))
