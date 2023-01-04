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
      <_Path
        d="M210.7,80H45.3C35.8,80,28,87.2,28,96v80H64V152H192v24h36V96C228,87.2,220.2,80,210.7,80Z"
        opacity="0.2"
      />
      <_Rect
        x="64"
        y="40"
        width="128"
        height="40"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Rect
        x="64"
        y="152"
        width="128"
        height="68"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M64,176H28V96c0-8.8,7.8-16,17.3-16H210.7c9.5,0,17.3,7.2,17.3,16v80H192"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle cx="188" cy="116" r="12" />
    </_Svg>
  )
}

Icon.displayName = 'PrinterDuotone'

export const PrinterDuotone = memo<IconProps>(themed(Icon))
