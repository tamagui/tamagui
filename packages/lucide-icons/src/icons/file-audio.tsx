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
        d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"
        stroke={color}
      />
      <Polyline points="14 2 14 8 20 8" stroke={color} />
      <Path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z" stroke={color} />
      <Path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z" stroke={color} />
      <Path d="M2 19v-3a6 6 0 0 1 12 0v3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileAudio'

export const FileAudio = memo<IconProps>(themed(Icon))
