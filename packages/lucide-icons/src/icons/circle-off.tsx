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
      <Path d="m2 2 20 20" stroke={color} />
      <Path
        d="M8.4 2.7c1.2-.4 2.4-.7 3.7-.7 5.5 0 10 4.5 10 10 0 1.3-.2 2.5-.7 3.6"
        stroke={color}
      />
      <Path
        d="M19.1 19.1C17.3 20.9 14.8 22 12 22 6.5 22 2 17.5 2 12c0-2.7 1.2-5.2 3-7"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'CircleOff'

export const CircleOff = memo<IconProps>(themed(Icon))
