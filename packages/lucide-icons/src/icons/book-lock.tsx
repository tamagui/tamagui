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
      <Path d="M4,19.5C4,18.1,5.1,17,6.5,17H20" stroke={color} />
      <Path d="M18,6V4c0-1.1-0.9-2-2-2s-2,0.9-2,2v2" stroke={color} />
      <Path
        d="M20,15v7H6.5C5.1,22,4,20.9,4,19.5v-15C4,3.1,5.1,2,6.5,2H10"
        stroke={color}
      />
      <Path
        d="M13,6h6c0.6,0,1,0.4,1,1v3c0,0.6-0.4,1-1,1h-6c-0.6,0-1-0.4-1-1V7C12,6.4,12.4,6,13,6z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'BookLock'

export const BookLock = memo<IconProps>(themed(Icon))
