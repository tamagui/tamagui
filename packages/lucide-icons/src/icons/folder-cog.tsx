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
      <_Circle cx="18" cy="18" r="3" stroke={color} />
      <Path
        d="M10.5 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.5"
        stroke={color}
      />
      <Path d="m21.7 19.4-.9-.3" stroke={color} />
      <Path d="m15.2 16.9-.9-.3" stroke={color} />
      <Path d="m16.6 21.7.3-.9" stroke={color} />
      <Path d="m19.1 15.2.3-.9" stroke={color} />
      <Path d="m19.6 21.7-.4-1" stroke={color} />
      <Path d="m16.8 15.3-.4-1" stroke={color} />
      <Path d="m14.3 19.6 1-.4" stroke={color} />
      <Path d="m20.7 16.8 1-.4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FolderCog'

export const FolderCog = memo<IconProps>(themed(Icon))
