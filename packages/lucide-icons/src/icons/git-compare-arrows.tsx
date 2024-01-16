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
      <_Circle cx="5" cy="6" r="3" stroke={color} />
      <Path d="M12 6h5a2 2 0 0 1 2 2v7" stroke={color} />
      <Path d="m15 9-3-3 3-3" stroke={color} />
      <_Circle cx="19" cy="18" r="3" stroke={color} />
      <Path d="M12 18H7a2 2 0 0 1-2-2V9" stroke={color} />
      <Path d="m9 15 3 3-3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GitCompareArrows'

export const GitCompareArrows = memo<IconProps>(themed(Icon))
