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
      <Path d="m18 2 4 4" stroke={color} />
      <Path d="m17 7 3-3" stroke={color} />
      <Path
        d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"
        stroke={color}
      />
      <Path d="m9 11 4 4" stroke={color} />
      <Path d="m5 19-3 3" stroke={color} />
      <Path d="m14 4 6 6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Syringe'

export const Syringe = memo<IconProps>(themed(Icon))
