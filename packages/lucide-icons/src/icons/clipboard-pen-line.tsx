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
      <Rect width="8" height="4" x="8" y="2" rx="1" stroke={color} />
      <Path
        d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5"
        stroke={color}
      />
      <Path d="M16 4h2a2 2 0 0 1 1.73 1" stroke={color} />
      <Path d="M8 18h1" stroke={color} />
      <Path d="M18.4 9.6a2 2 0 0 1 3 3L17 17l-4 1 1-4Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ClipboardPenLine'

export const ClipboardPenLine = memo<IconProps>(themed(Icon))
