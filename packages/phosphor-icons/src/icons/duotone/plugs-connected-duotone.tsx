import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_G opacity="0.2">
        <_Rect
          x="60.1"
          y="88.4"
          width="135.8"
          height="79.2"
          rx="24"
          transform="translate(-53 128) rotate(-45)"
        />
        <_Rect
          x="60.1"
          y="88.4"
          width="135.8"
          height="79.2"
          rx="24"
          transform="translate(-53 128) rotate(-45)"
        />
      </_G>
      <_Line
        x1="80"
        y1="176"
        x2="24"
        y2="232"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="232"
        y1="24"
        x2="176"
        y2="80"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Rect
        x="60.1"
        y="88.4"
        width="135.8"
        height="79.2"
        rx="24"
        transform="translate(-53 128) rotate(-45)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="92"
        y1="92"
        x2="164"
        y2="164"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="224"
        y1="160"
        x2="200"
        y2="152"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="56"
        y1="104"
        x2="32"
        y2="96"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="96"
        y1="32"
        x2="104"
        y2="56"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="152"
        y1="200"
        x2="160"
        y2="224"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'PlugsConnectedDuotone'

export const PlugsConnectedDuotone = memo<IconProps>(themed(Icon))
