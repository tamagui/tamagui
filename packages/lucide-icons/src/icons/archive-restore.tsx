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
      <Rect width="20" height="5" x="2" y="4" rx="2" stroke={color} />
      <Path d="M12 13v7" stroke={color} />
      <Path d="m9 16 3-3 3 3" stroke={color} />
      <Path d="M4 9v9a2 2 0 0 0 2 2h2" stroke={color} />
      <Path d="M20 9v9a2 2 0 0 1-2 2h-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArchiveRestore'

export const ArchiveRestore = memo<IconProps>(themed(Icon))
