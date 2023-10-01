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
        d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"
        stroke={color}
      />
      <Path
        d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"
        stroke={color}
      />
      <Path d="M8 7h.01" stroke={color} />
      <Path d="M16 7h.01" stroke={color} />
      <Path d="M12 7h.01" stroke={color} />
      <Path d="M12 11h.01" stroke={color} />
      <Path d="M16 11h.01" stroke={color} />
      <Path d="M8 11h.01" stroke={color} />
      <Path d="M10 22v-6.5m4 0V22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Hotel'

export const Hotel = memo<IconProps>(themed(Icon))
