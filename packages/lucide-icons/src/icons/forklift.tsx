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
      <Path d="M12 12H5a2 2 0 0 0-2 2v5" stroke={color} />
      <_Circle cx="13" cy="19" r="2" stroke={color} />
      <_Circle cx="5" cy="19" r="2" stroke={color} />
      <Path d="M8 19h3m5-17v17h6M6 12V7c0-1.1.9-2 2-2h3l5 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Forklift'

export const Forklift = memo<IconProps>(themed(Icon))
