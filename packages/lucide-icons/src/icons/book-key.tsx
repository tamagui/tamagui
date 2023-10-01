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
      <Path d="M20,2l-4.5,4.5" stroke={color} />
      <Path d="M19,3l1,1" stroke={color} />
      <_Circle cx="14" cy="8" r="2" stroke={color} />
      <Path d="M4,19.5C4,18.1,5.1,17,6.5,17H20" stroke={color} />
      <Path
        d="M20,8v14H6.5C5.1,22,4,20.9,4,19.5v-15C4,3.1,5.1,2,6.5,2H14"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'BookKey'

export const BookKey = memo<IconProps>(themed(Icon))
