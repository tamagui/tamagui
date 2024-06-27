import React, { memo } from 'react'
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
      <_Circle cx="12" cy="12" r="3" stroke={color} />
      <Path
        d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5"
        stroke={color}
      />
      <Path d="m15.7 10.4-.9.4" stroke={color} />
      <Path d="m9.2 13.2-.9.4" stroke={color} />
      <Path d="m13.6 15.7-.4-.9" stroke={color} />
      <Path d="m10.8 9.2-.4-.9" stroke={color} />
      <Path d="m15.7 13.5-.9-.4" stroke={color} />
      <Path d="m9.2 10.9-.9-.4" stroke={color} />
      <Path d="m10.5 15.7.4-.9" stroke={color} />
      <Path d="m13.1 9.2.4-.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BrainCog'

export const BrainCog = memo<IconProps>(themed(Icon))
