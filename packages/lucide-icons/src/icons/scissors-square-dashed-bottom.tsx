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
        d="M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2"
        stroke={color}
      />
      <Path d="M10 22H8" stroke={color} />
      <Path d="M16 22h-2" stroke={color} />
      <_Circle cx="8" cy="8" r="2" stroke={color} />
      <Path d="M9.414 9.414 12 12" stroke={color} />
      <Path d="M14.8 14.8 18 18" stroke={color} />
      <_Circle cx="8" cy="16" r="2" stroke={color} />
      <Path d="m18 6-8.586 8.586" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ScissorsSquareDashedBottom'

export const ScissorsSquareDashedBottom = memo<IconProps>(themed(Icon))
