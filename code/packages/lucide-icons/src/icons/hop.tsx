import React from 'react'
import PropTypes from 'prop-types'
import type { IconProps } from '@tamagui/helpers-icon'
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

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
      <Path d="M17.5 5.5C19 7 20.5 9 21 11c-2.5.5-5 .5-8.5-1" stroke={color} />
      <Path d="M5.5 17.5C7 19 9 20.5 11 21c.5-2.5.5-5-1-8.5" stroke={color} />
      <Path d="M16.5 11.5c1 2 1 3.5 1 6-2.5 0-4 0-6-1" stroke={color} />
      <Path d="M20 11.5c1 1.5 2 3.5 2 4.5-1.5.5-3 0-4.5-.5" stroke={color} />
      <Path d="M11.5 20c1.5 1 3.5 2 4.5 2 .5-1.5 0-3-.5-4.5" stroke={color} />
      <Path d="M20.5 16.5c1 2 1.5 3.5 1.5 5.5-2 0-3.5-.5-5.5-1.5" stroke={color} />
      <Path
        d="M4.783 4.782C8.493 1.072 14.5 1 18 5c-1 1-4.5 2-6.5 1.5 1 1.5 1 4 .5 5.5-1.5.5-4 .5-5.5-.5C7 13.5 6 17 5 18c-4-3.5-3.927-9.508-.217-13.218Z"
        stroke={color}
      />

      <Path d="M4.5 4.5 3 3c-.184-.185-.184-.816 0-1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Hop'

export const Hop = React.memo<IconProps>(themed(Icon))
