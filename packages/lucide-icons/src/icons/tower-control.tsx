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
        d="M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z"
        stroke={color}
      />
      <Path d="M8 13v9" stroke={color} />
      <Path d="M16 22v-9" stroke={color} />
      <Path d="m9 6 1 7" stroke={color} />
      <Path d="m15 6-1 7" stroke={color} />
      <Path d="M12 6V2" stroke={color} />
      <Path d="M13 2h-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TowerControl'

export const TowerControl = memo<IconProps>(themed(Icon))
