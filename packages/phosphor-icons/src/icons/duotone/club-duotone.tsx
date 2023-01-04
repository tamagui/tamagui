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
        d="M112.5,179.2A48,48,0,1,1,76,100a51.2,51.2,0,0,1,11.2,1.3h0A47.3,47.3,0,0,1,80,76a48,48,0,0,1,96,0,47.3,47.3,0,0,1-7.2,25.3h0A51.2,51.2,0,0,1,180,100a48,48,0,1,1-36.5,79.2L160,232H96Z"
        opacity="0.2"
      />
      <_Path
        d="M112.5,179.2A48,48,0,1,1,76,100a51.2,51.2,0,0,1,11.2,1.3h0A47.3,47.3,0,0,1,80,76a48,48,0,0,1,96,0,47.3,47.3,0,0,1-7.2,25.3h0A51.2,51.2,0,0,1,180,100a48,48,0,1,1-36.5,79.2L160,232H96Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'ClubDuotone'

export const ClubDuotone = memo<IconProps>(themed(Icon))
