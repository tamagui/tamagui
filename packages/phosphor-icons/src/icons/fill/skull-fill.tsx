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
      <_Path d="M124.1,16.1c-51.6,1.9-93.7,43.6-96,95.3A99.4,99.4,0,0,0,72,198.9V216a16,16,0,0,0,16,16h8a4,4,0,0,0,4-4V204.3a8.2,8.2,0,0,1,7.5-8.3,8,8,0,0,1,8.5,8v24a4,4,0,0,0,4,4h16a4,4,0,0,0,4-4V204.3a8.2,8.2,0,0,1,7.5-8.3,8,8,0,0,1,8.5,8v24a4,4,0,0,0,4,4h8a16,16,0,0,0,16-16V198.9A100,100,0,0,0,124.1,16.1ZM92,152a20,20,0,1,1,20-20A20.1,20.1,0,0,1,92,152Zm72,0a20,20,0,1,1,20-20A20.1,20.1,0,0,1,164,152Z" />
    </_Svg>
  )
}

Icon.displayName = 'SkullFill'

export const SkullFill = memo<IconProps>(themed(Icon))
