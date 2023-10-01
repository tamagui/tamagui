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
        d="M4 6V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H4"
        stroke={color}
      />
      <Polyline points="14 2 14 8 20 8" stroke={color} />
      <_Circle cx="6" cy="14" r="3" stroke={color} />
      <Path d="M6 10v1" stroke={color} />
      <Path d="M6 17v1" stroke={color} />
      <Path d="M10 14H9" stroke={color} />
      <Path d="M3 14H2" stroke={color} />
      <Path d="m9 11-.88.88" stroke={color} />
      <Path d="M3.88 16.12 3 17" stroke={color} />
      <Path d="m9 17-.88-.88" stroke={color} />
      <Path d="M3.88 11.88 3 11" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileCog'

export const FileCog = memo<IconProps>(themed(Icon))
