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
        d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
        stroke={color}
      />
      <_Circle cx="12" cy="13" r="2" stroke={color} />
      <Path d="M12 10v1" stroke={color} />
      <Path d="M12 15v1" stroke={color} />
      <Path d="m14.6 11.5-.87.5" stroke={color} />
      <Path d="m10.27 14-.87.5" stroke={color} />
      <Path d="m14.6 14.5-.87-.5" stroke={color} />
      <Path d="m10.27 12-.87-.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FolderCog2'

export const FolderCog2 = memo<IconProps>(themed(Icon))
