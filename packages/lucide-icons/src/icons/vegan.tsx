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
        d="M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14"
        stroke={color}
      />
      <Path d="M16 8c4 0 6-2 6-6-4 0-6 2-6 6" stroke={color} />
      <Path d="M17.41 3.6a10 10 0 1 0 3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Vegan'

export const Vegan = memo<IconProps>(themed(Icon))
