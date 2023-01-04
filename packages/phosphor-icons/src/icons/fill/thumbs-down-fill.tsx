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
      <_Path d="M237.7,157l-12-96a24.1,24.1,0,0,0-23.8-21H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75l37.8,75.6A8.2,8.2,0,0,0,120,240a40.1,40.1,0,0,0,40-40V184h53.9a23.9,23.9,0,0,0,23.8-27ZM72,144H32V56H72Z" />
    </_Svg>
  )
}

Icon.displayName = 'ThumbsDownFill'

export const ThumbsDownFill = memo<IconProps>(themed(Icon))
