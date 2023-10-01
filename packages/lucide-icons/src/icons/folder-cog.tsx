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
        d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"
        stroke={color}
      />
      <_Circle cx="18" cy="18" r="3" stroke={color} />
      <Path d="M18 14v1" stroke={color} />
      <Path d="M18 21v1" stroke={color} />
      <Path d="M22 18h-1" stroke={color} />
      <Path d="M15 18h-1" stroke={color} />
      <Path d="m21 15-.88.88" stroke={color} />
      <Path d="M15.88 20.12 15 21" stroke={color} />
      <Path d="m21 21-.88-.88" stroke={color} />
      <Path d="M15.88 15.88 15 15" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FolderCog'

export const FolderCog = memo<IconProps>(themed(Icon))
