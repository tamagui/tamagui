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
      <_Path d="M231.9,169.8l-94.8,65.6a15.7,15.7,0,0,1-18.2,0L24.1,169.8a16.1,16.1,0,0,1-6.4-17.3L45,50a12,12,0,0,1,22.9-1.1L88.5,104h79l20.6-55.1A12,12,0,0,1,211,50l27.3,102.5A16.1,16.1,0,0,1,231.9,169.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'GitlabLogoSimpleFill'

export const GitlabLogoSimpleFill = memo<IconProps>(themed(Icon))
