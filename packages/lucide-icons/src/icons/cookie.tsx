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
        d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"
        stroke={color}
      />
      <Path d="M8.5 8.5v.01" stroke={color} />
      <Path d="M16 15.5v.01" stroke={color} />
      <Path d="M12 12v.01" stroke={color} />
      <Path d="M11 17v.01" stroke={color} />
      <Path d="M7 14v.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cookie'

export const Cookie = memo<IconProps>(themed(Icon))
