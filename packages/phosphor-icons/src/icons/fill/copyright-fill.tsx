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
      <_Path d="M128,20A108,108,0,1,0,236,128,108.1,108.1,0,0,0,128,20Zm0,196a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-160a72,72,0,1,0,72,72A72.1,72.1,0,0,0,128,56Zm0,104a31.8,31.8,0,0,0,25.6-12.8,8.1,8.1,0,0,1,11.2-1.6,8,8,0,0,1,1.6,11.2,48,48,0,1,1,0-57.6,8,8,0,0,1-1.6,11.2,8.1,8.1,0,0,1-11.2-1.6A32,32,0,1,0,128,160Z" />
    </_Svg>
  )
}

Icon.displayName = 'CopyrightFill'

export const CopyrightFill = memo<IconProps>(themed(Icon))
