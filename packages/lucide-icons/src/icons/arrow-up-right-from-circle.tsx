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
      <Polyline points="16,2 22,2 22,8 " stroke={color} />
      <Line x1="22" y1="2" x2="12" y2="12" stroke={color} />
      <Path
        d="M22,12c0,5.5-4.5,10-10,10S2,17.5,2,12S6.5,2,12,2"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpRightFromCircle'

export const ArrowUpRightFromCircle = memo<IconProps>(themed(Icon))
