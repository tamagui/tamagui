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
        d="M221.6,149.4a96.2,96.2,0,0,0,2.4-22.2c-.4-52.9-44.2-95.7-97-95.2A96,96,0,0,0,96,218.5a23.9,23.9,0,0,0,32-22.6V192a23.9,23.9,0,0,1,24-24h46.2A24,24,0,0,0,221.6,149.4Z"
        opacity="0.2"
      />
      <_Path
        d="M221.6,149.4a96.2,96.2,0,0,0,2.4-22.2c-.4-52.9-44.2-95.7-97-95.2A96,96,0,0,0,96,218.5a23.9,23.9,0,0,0,32-22.6V192a23.9,23.9,0,0,1,24-24h46.2A24,24,0,0,0,221.6,149.4Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle cx="128" cy="76" r="12" />
      <_Circle cx="83" cy="102" r="12" />
      <_Circle cx="83" cy="154" r="12" />
      <_Circle cx="173" cy="102" r="12" />
    </_Svg>
  )
}

Icon.displayName = 'PaletteDuotone'

export const PaletteDuotone = memo<IconProps>(themed(Icon))
