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
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M88,68V36a20,20,0,0,1,40,0v68"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M82.6,163.6a8.2,8.2,0,0,0,0,8.8c5.7,8.8,20.8,27.6,45.4,27.6s39.7-18.8,45.4-27.6a8.2,8.2,0,0,0,0-8.8c-5.7-8.8-20.8-27.6-45.4-27.6S88.3,154.8,82.6,163.6Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M128,52a20,20,0,0,1,40,0v60"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M168,116v-4a20,20,0,0,1,40,0v40a80,80,0,0,1-160,0V68a20,20,0,0,1,40,0v44"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle cx="128" cy="168" r="12" />
    </_Svg>
  )
}

Icon.displayName = 'HandEyeRegular'

export const HandEyeRegular = memo<IconProps>(themed(Icon))
