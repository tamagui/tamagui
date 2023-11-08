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
      <Rect width="16" height="13" x="6" y="4" rx="2" stroke={color} />
      <Path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7" stroke={color} />
      <Path d="M2 8v11c0 1.1.9 2 2 2h14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Mails'

export const Mails = memo<IconProps>(themed(Icon))
