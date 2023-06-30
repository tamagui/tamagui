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
  SvgProps,
  Symbol,
  Use,
  Circle as _Circle,
  Text as _Text,
} from 'react-native-svg'

const Icon = (props: SvgProps) => {
  const { color = 'black', width = 24, height = 24, ...otherProps } = props
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Polygon
        points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"
        stroke={color}
      />
      <Line x1="9" x2="9" y1="3" y2="18" stroke={color} />
      <Line x1="15" x2="15" y1="6" y2="21" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Map'

export const Map = memo<IconProps>(themed(Icon))
