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
        d="M14 16.5v-.77a2.73 2.73 0 0 1 3.27-2.68l3.02.6a1.4 1.4 0 0 0 1.5-2.08l-1.63-2.8a3 3 0 1 0-3.35-4.82"
        stroke={color}
      />
      <Path d="M16 9h-.01" stroke={color} />
      <Path
        d="M17 5.12V5a3 3 0 1 0-5.24 2h-1A6.77 6.77 0 0 0 4 13.77C4 16.1 5.9 18 8.23 18H9"
        stroke={color}
      />
      <Path d="M13 22H4a2 2 0 1 1 0-4h12" stroke={color} />
      <Path
        d="M13.67 18c.21-.44.33-.94.33-1.45A3.65 3.65 0 0 0 10.26 13"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Rat'

export const Rat = memo<IconProps>(themed(Icon))
