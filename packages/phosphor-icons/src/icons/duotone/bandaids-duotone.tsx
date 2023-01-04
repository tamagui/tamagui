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
        d="M206.6,94.6a32,32,0,0,0-45.2-45.2L128,82.7,173.3,128Z"
        opacity="0.2"
      />
      <_Path
        d="M49.4,161.4a32,32,0,0,0,45.2,45.2L128,173.3,82.7,128Z"
        opacity="0.2"
      />
      <_Path
        d="M94.6,49.4A32,32,0,0,0,49.4,94.6L82.7,128,128,82.7Z"
        opacity="0.2"
      />
      <_Path
        d="M173.3,128,128,173.3l33.4,33.3a32,32,0,0,0,45.2-45.2Z"
        opacity="0.2"
      />
      <_Path
        d="M49.4,94.6A32,32,0,0,1,94.6,49.4l112,112a32,32,0,0,1-45.2,45.2Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M161.4,49.4a32,32,0,0,1,45.2,45.2l-112,112a32,32,0,0,1-45.2-45.2Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle
        cx="128"
        cy="128"
        r="4"
        fill="none"
        stroke={`${color}`}
        opacity="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle cx="128" cy="128" r="12" />
    </_Svg>
  )
}

Icon.displayName = 'BandaidsDuotone'

export const BandaidsDuotone = memo<IconProps>(themed(Icon))
