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
        d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0"
        stroke={color}
      />
      <Path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" stroke={color} />
      <Path d="M10 20h4" stroke={color} />
      <_Circle cx="16" cy="20" r="2" stroke={color} />
      <_Circle cx="8" cy="20" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Luggage'

export const Luggage = memo<IconProps>(themed(Icon))
