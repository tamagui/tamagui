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

export const TowerControl = React.memo<IconProps>(themed(Icon))
