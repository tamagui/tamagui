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
      <_Circle cx="6" cy="6" r="3" stroke={color} />
      <Path d="M6 9v12" stroke={color} />
      <Path d="M13 6h3a2 2 0 0 1 2 2v3" stroke={color} />
      <Path d="M18 15v6" stroke={color} />
      <Path d="M21 18h-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GitPullRequestCreate'

export const GitPullRequestCreate = memo<IconProps>(themed(Icon))
